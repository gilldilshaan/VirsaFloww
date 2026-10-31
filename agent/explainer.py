import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any

from backend.app.schemas.explainer import ExplainerResponse, ExplainerMode, RuleExplanationItem
from agent.context import ExplainerContext
from agent.cache import ExplainerCache
from agent.adapter import LLMAdapter
from agent.validator import ExplainerValidator, ExplainerValidationError
from agent.template import ExplainerTemplate

logger = logging.getLogger("terraledger-explainer")

class TerraExplainer:
    def __init__(
        self,
        cache: Optional[ExplainerCache] = None,
        llm_adapter: Optional[LLMAdapter] = None,
    ):
        self.cache = cache or ExplainerCache()
        self.llm_adapter = llm_adapter or LLMAdapter()

    def explain(
        self,
        context: ExplainerContext,
        question: str = "Explain the assessment status and rule evaluation results.",
    ) -> ExplainerResponse:
        """Executes the strict 3-stage explainer pipeline: CACHE -> LLM -> TEMPLATE."""
        now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        assessment = context.assessment
        field = context.field
        canonical_dict = context.to_canonical_prompt_dict()

        cache_key = ExplainerCache.compute_cache_key(
            assessment_id=assessment.id,
            ruleset_version=assessment.ruleset_version,
            canonical_dict=canonical_dict,
            question=question,
        )

        # 1. CACHE STAGE
        cached_data = self.cache.get(cache_key)
        if cached_data:
            return self._format_response(
                data=cached_data,
                assessment_id=assessment.id,
                field_id=field.id,
                status_str=assessment.status.value,
                mode=ExplainerMode.CACHED,
                now_iso=now_iso,
            )

        # 2. LLM STAGE
        raw_llm_output = self.llm_adapter.generate_explanation(canonical_dict, question)
        if raw_llm_output:
            try:
                validated_data = ExplainerValidator.validate(raw_llm_output, context)
                # Store ONLY validated LLM answers in cache (Amendment 1)
                self.cache.set(cache_key, validated_data)
                return self._format_response(
                    data=validated_data,
                    assessment_id=assessment.id,
                    field_id=field.id,
                    status_str=assessment.status.value,
                    mode=ExplainerMode.LLM,
                    now_iso=now_iso,
                )
            except ExplainerValidationError as val_err:
                logger.warning(f"LLM explanation failed safety validation: {val_err}. Falling back to Template.")

        # 3. TEMPLATE STAGE (Fallback, uncached per Amendment 1)
        template_data = ExplainerTemplate.generate(context)
        return self._format_response(
            data=template_data,
            assessment_id=assessment.id,
            field_id=field.id,
            status_str=assessment.status.value,
            mode=ExplainerMode.TEMPLATE,
            now_iso=now_iso,
        )

    def _format_response(
        self,
        data: Dict[str, Any],
        assessment_id: str,
        field_id: str,
        status_str: str,
        mode: ExplainerMode,
        now_iso: str,
    ) -> ExplainerResponse:
        breakdowns = [
            RuleExplanationItem(
                rule_id=rb.get("ruleId", rb.get("rule_id", "")),
                status=rb.get("status", ""),
                explanation=rb.get("explanation", ""),
                source_record_ids=rb.get("sourceRecordIds", rb.get("source_record_ids", [])),
            )
            for rb in data.get("ruleBreakdowns", data.get("rule_breakdowns", []))
        ]

        return ExplainerResponse(
            assessment_id=assessment_id,
            field_id=field_id,
            status=status_str,
            mode=mode,
            summary=data.get("summary", ""),
            rule_breakdowns=breakdowns,
            citations=data.get("citations", []),
            generated_at=now_iso,
        )
