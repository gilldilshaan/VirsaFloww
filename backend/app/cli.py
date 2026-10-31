import os
import sys
import json
import logging
from backend.app.core.config import settings
from backend.app.api.deps import get_container
from backend.app.utils.crypto import hash_password

logger = logging.getLogger("terraledger-cli")

def reseed_users():
    """Generates new scrypt password hashes for seed users using DEMO_USER_PASSWORD."""
    password = os.getenv("DEMO_USER_PASSWORD", "").strip()
    if not password:
        print("Error: DEMO_USER_PASSWORD environment variable is missing. Seeding fails; no fallback passwords permitted.")
        sys.exit(1)

    seed_users_path = os.path.join(settings.SEED_DIR, "users.json")
    if not os.path.exists(seed_users_path):
        print(f"Error: Seed file '{seed_users_path}' not found.")
        sys.exit(1)

    with open(seed_users_path, "r", encoding="utf-8") as f:
        users = json.loads(f.read())

    hashed = hash_password(password)
    for u in users:
        u["passwordHash"] = hashed

    with open(seed_users_path, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"Successfully reseeded {len(users)} users in '{seed_users_path}' using DEMO_USER_PASSWORD.")

def reset_demo():
    if settings.APP_MODE != "demo":
        print(f"Error: reset-demo is only permitted in APP_MODE=demo. Current mode: {settings.APP_MODE}")
        sys.exit(1)

    container = get_container()
    container.reset_all_to_seeds()
    print("TerraLedger AI demo state successfully reset to baseline seed data.")

def warm_cache():
    """Pre-populates the explainer cache with validated explanations for demo assessments."""
    container = get_container()
    assessments, _ = container.assessment_repo.list()
    if not assessments:
        print("No assessments found to warm cache for. Run an assessment first.")
        return

    from agent.context import ExplainerContext
    from agent.validator import ExplainerValidator
    from agent.cache import ExplainerCache

    warmed_count = 0
    for assessment in assessments:
        field = container.field_repo.get(assessment.field_id)
        if not field:
            continue
        activities, _ = container.activity_repo.list(filter_fn=lambda a: a.field_id == field.id)
        evidence_items, _ = container.evidence_repo.list(filter_fn=lambda e: e.field_id == field.id)
        observations = container.graph_service._read_observations(field.id)

        context = ExplainerContext(
            assessment=assessment,
            field=field,
            activities=activities,
            evidence_items=evidence_items,
            observations=observations,
        )
        canonical_dict = context.to_canonical_prompt_dict()
        default_question = "Explain the assessment status and rule evaluation results."
        cache_key = ExplainerCache.compute_cache_key(
            assessment_id=assessment.id,
            ruleset_version=assessment.ruleset_version,
            canonical_dict=canonical_dict,
            question=default_question,
        )

        payload = {
            "summary": f"Assessment {assessment.id} for field {field.id} has server status '{assessment.status.value}'. Automated evaluation completed across {len(assessment.rule_results)} screening rules.",
            "ruleBreakdowns": [
                {
                    "ruleId": r.rule_id,
                    "status": r.result.value,
                    "explanation": r.explanation,
                    "sourceRecordIds": r.source_record_ids,
                }
                for r in sorted(assessment.rule_results, key=lambda x: x.rule_id)
            ],
            "citations": sorted(list({field.id, assessment.id} | {r.rule_id for r in assessment.rule_results})),
        }

        validated = ExplainerValidator.validate(json.dumps(payload), context)
        container.explainer.cache.set(cache_key, validated)
        warmed_count += 1

    print(f"Successfully warmed explainer cache with {warmed_count} validated assessment explanation(s).")

def main():
    if len(sys.argv) < 2:
        print("Usage: python -m backend.app.cli <command>")
        print("Available commands:")
        print("  reset-demo               Restores all runtime repositories to initial seed state (demo mode only)")
        print("  reseed-users             Updates seed users password hashes from DEMO_USER_PASSWORD env variable")
        print("  warm-cache               Populates explainer cache with pre-validated explanations for demo assessments")
        print("  migrate-json-to-postgres Migrates JSON data to PostgreSQL (--dry-run | --apply) (--target test|production)")
        sys.exit(1)

    command = sys.argv[1].lower()
    if command == "reset-demo":
        reset_demo()
    elif command == "reseed-users":
        reseed_users()
    elif command == "warm-cache":
        warm_cache()
    elif command == "migrate-json-to-postgres":
        from backend.scripts.migrate_json_to_postgres import JsonToPostgresMigrator
        apply_mode = "--apply" in sys.argv
        target_mode = "test"
        for i, arg in enumerate(sys.argv):
            if arg == "--target" and i + 1 < len(sys.argv):
                target_mode = sys.argv[i + 1].lower()

        migrator = JsonToPostgresMigrator(target=target_mode, apply=apply_mode)
        summary = migrator.run()
        if not summary.success:
            sys.exit(1)
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)

if __name__ == "__main__":
    main()
