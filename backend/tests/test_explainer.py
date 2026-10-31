import os
import ast
import json
import pytest
from backend.app.core.config import settings
from backend.app.schemas.explainer import ExplainerMode
from agent.context import ExplainerContext
from agent.validator import ExplainerValidator, ExplainerValidationError
from agent.adapter import LLMAdapter
from agent.explainer import TerraExplainer
from agent.cache import ExplainerCache
from backend.app.api.routes.explanations import reset_explainer_rate_limits

def test_ast_explainer_zero_storage_mutators():
    """AST inspection test: asserts that agent/ never imports storage or calls repository write methods."""
    agent_dir = os.path.join(settings.REPO_ROOT, "agent")
    assert os.path.exists(agent_dir), "agent/ directory must exist"

    forbidden_call_names = {"create", "insert", "delete", "record_status_transition"}

    for root, _, files in os.walk(agent_dir):
        for fname in files:
            if fname.endswith(".py"):
                fpath = os.path.join(root, fname)
                with open(fpath, "r", encoding="utf-8") as f:
                    tree = ast.parse(f.read(), filename=fpath)

                for node in ast.walk(tree):
                    # Check for forbidden imports
                    if isinstance(node, (ast.Import, ast.ImportFrom)):
                        mod = getattr(node, "module", "") or ""
                        if "backend.app.storage" in mod or "storage" in mod:
                            pytest.fail(f"AST violation in {fpath}:{node.lineno} - forbidden storage import '{mod}'")

                    # Check for forbidden method calls
                    if isinstance(node, ast.Call):
                        if isinstance(node.func, ast.Attribute) and node.func.attr in forbidden_call_names:
                            pytest.fail(f"AST violation in {fpath}:{node.lineno} - forbidden method call '{node.func.attr}()'")
                        elif isinstance(node.func, ast.Name) and node.func.id in forbidden_call_names:
                            pytest.fail(f"AST violation in {fpath}:{node.lineno} - forbidden function call '{node.func.id}()'")

def test_number_grounding_ignores_id_digits_and_normalizes_dates(test_container):
    # Setup context
    field = test_container.field_repo.get("PB-FIELD-001")
    assessments, _ = test_container.assessment_repo.list()
    # Run an assessment to have ground truth
    from backend.app.rules.evaluator import run_deterministic_ruleset
    activities, _ = test_container.activity_repo.list(filter_fn=lambda a: a.field_id == field.id)
    evidence, _ = test_container.evidence_repo.list(filter_fn=lambda e: e.field_id == field.id)
    assessment = run_deterministic_ruleset(field=field, activities=activities, evidence_items=evidence, satellite_obs=[])

    context = ExplainerContext(
        assessment=assessment,
        field=field,
        activities=activities,
        evidence_items=evidence,
        observations=[],
    )

    # Text containing numbers only inside IDs and valid date
    valid_text = json.dumps({
        "summary": f"Field PB-FIELD-001 evaluated with area {field.area_ha} ha on date 2026-06-15.",
        "ruleBreakdowns": [
            {"ruleId": "R1", "status": "pass", "explanation": "Rule R1 passed.", "sourceRecordIds": []}
        ],
        "citations": ["PB-FIELD-001", "R1"],
    })

    # Should validate cleanly without tripping on '001' from PB-FIELD-001 or '1' from R1
    validated = ExplainerValidator.validate(valid_text, context)
    assert validated["summary"] is not None

    # Text with ungrounded invented number (e.g. 777.7) must fail
    invalid_text = json.dumps({
        "summary": "Field PB-FIELD-001 has 777.7 credits issued.",
        "ruleBreakdowns": [],
        "citations": ["PB-FIELD-001"],
    })
    with pytest.raises(ExplainerValidationError):
        ExplainerValidator.validate(invalid_text, context)

def test_explainer_pipeline_cache_llm_template(tmp_path, test_container):
    field = test_container.field_repo.get("PB-FIELD-001")
    from backend.app.rules.evaluator import run_deterministic_ruleset
    activities, _ = test_container.activity_repo.list(filter_fn=lambda a: a.field_id == field.id)
    evidence, _ = test_container.evidence_repo.list(filter_fn=lambda e: e.field_id == field.id)
    assessment = run_deterministic_ruleset(field=field, activities=activities, evidence_items=evidence, satellite_obs=[])

    context = ExplainerContext(
        assessment=assessment,
        field=field,
        activities=activities,
        evidence_items=evidence,
        observations=[],
    )

    cache_file = str(tmp_path / "cache.json")
    cache = ExplainerCache(cache_file)

    # 1. No LLM adapter, cache empty -> should return TEMPLATE mode (uncached)
    explainer = TerraExplainer(cache=cache, llm_adapter=LLMAdapter())
    resp1 = explainer.explain(context)
    assert resp1.mode == ExplainerMode.TEMPLATE
    # Cache should still be empty because Template is not cached
    assert cache._read_cache() == {}

    # 2. Simulated LLM returning valid response -> should return LLM mode and store in cache
    class MockValidLLM(LLMAdapter):
        def is_available(self):
            return True
        def generate_explanation(self, prompt_dict, user_question):
            return json.dumps({
                "summary": f"Assessment {assessment.id} for field {field.id} has server status '{assessment.status.value}'.",
                "ruleBreakdowns": [
                    {"ruleId": "R1", "status": "pass", "explanation": "R1 passed.", "sourceRecordIds": []}
                ],
                "citations": [field.id, assessment.id, "R1"],
            })

    explainer_llm = TerraExplainer(cache=cache, llm_adapter=MockValidLLM())
    resp2 = explainer_llm.explain(context)
    assert resp2.mode == ExplainerMode.LLM
    # Cache now contains the entry
    assert len(cache._read_cache()) == 1

    # 3. Subsequent request with cache populated -> should return CACHED mode
    resp3 = explainer_llm.explain(context)
    assert resp3.mode == ExplainerMode.CACHED

def test_explainer_validation_failures_fallback_to_template(tmp_path, test_container):
    field = test_container.field_repo.get("PB-FIELD-001")
    from backend.app.rules.evaluator import run_deterministic_ruleset
    activities, _ = test_container.activity_repo.list(filter_fn=lambda a: a.field_id == field.id)
    evidence, _ = test_container.evidence_repo.list(filter_fn=lambda e: e.field_id == field.id)
    assessment = run_deterministic_ruleset(field=field, activities=activities, evidence_items=evidence, satellite_obs=[])

    context = ExplainerContext(
        assessment=assessment,
        field=field,
        activities=activities,
        evidence_items=evidence,
        observations=[],
    )

    cache = ExplainerCache(str(tmp_path / "cache.json"))

    # Mock LLM returning forbidden word "certified"
    class MockBadLLM(LLMAdapter):
        def is_available(self):
            return True
        def generate_explanation(self, prompt_dict, user_question):
            return json.dumps({
                "summary": "This is a certified assessment for field PB-FIELD-001.",
                "ruleBreakdowns": [],
                "citations": ["PB-FIELD-001"],
            })

    explainer = TerraExplainer(cache=cache, llm_adapter=MockBadLLM())
    resp = explainer.explain(context)
    # Failed validation -> fallback to Template mode
    assert resp.mode == ExplainerMode.TEMPLATE

def test_explainer_endpoint_and_audit(client, auth_headers):
    reset_explainer_rate_limits()
    # First create an assessment
    assess_resp = client.post("/api/assessments/run", json={"fieldId": "PB-FIELD-001"}, headers=auth_headers("reviewer"))
    assert assess_resp.status_code == 201
    assessment_id = assess_resp.json()["id"]

    # Call POST /api/explanations as reviewer
    resp = client.post(
        "/api/explanations",
        json={"assessmentId": assessment_id, "question": "Explain assessment status."},
        headers=auth_headers("reviewer"),
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["assessmentId"] == assessment_id
    assert data["fieldId"] == "PB-FIELD-001"
    assert data["mode"] in ["Template", "LLM", "Cached"]
    assert len(data["citations"]) > 0

    # Verify audit event was logged without full explanation text
    audit_resp = client.get("/api/audit", headers=auth_headers("admin"))
    assert audit_resp.status_code == 200
    events = audit_resp.json()["items"]
    expl_events = [e for e in events if e["action"] == "explanation.generated"]
    assert len(expl_events) >= 1
    latest_event = expl_events[0]
    assert latest_event["entityId"] == assessment_id
    # Assert full text is not leaked into audit
    assert "summary" not in latest_event["details"]

def test_explainer_rate_limiting(client, auth_headers):
    reset_explainer_rate_limits()
    # Create an assessment
    assess_resp = client.post("/api/assessments/run", json={"fieldId": "PB-FIELD-001"}, headers=auth_headers("admin"))
    assert assess_resp.status_code == 201
    assessment_id = assess_resp.json()["id"]

    # Make 10 requests rapidly (allowed limit)
    for _ in range(10):
        r = client.post(
            "/api/explanations",
            json={"assessmentId": assessment_id},
            headers=auth_headers("admin"),
        )
        assert r.status_code == 200

    # 11th request must receive 429 Too Many Requests
    r11 = client.post(
        "/api/explanations",
        json={"assessmentId": assessment_id},
        headers=auth_headers("admin"),
    )
    assert r11.status_code == 429
    assert r11.json()["error"]["code"] == "RATE_LIMITED"
    reset_explainer_rate_limits()

def test_explainer_rbac_farmer_buyer_denied(client, auth_headers):
    # Farmer calling explainer gets 404
    resp_farmer = client.post(
        "/api/explanations",
        json={"assessmentId": "ASSESS-2026-001"},
        headers=auth_headers("farmer"),
    )
    assert resp_farmer.status_code == 404

    # Buyer calling explainer gets 404
    resp_buyer = client.post(
        "/api/explanations",
        json={"assessmentId": "ASSESS-2026-001"},
        headers=auth_headers("buyer"),
    )
    assert resp_buyer.status_code == 404
