import json
import re
from typing import Dict, Any, List, Tuple
from agent.context import ExplainerContext

FORBIDDEN_WORDS = [
    "certified",
    "audited",
    "guaranteed",
    "credits-issued",
]

class ExplainerValidationError(Exception):
    pass

class ExplainerValidator:
    @staticmethod
    def validate(
        raw_output: str,
        context: ExplainerContext,
    ) -> Dict[str, Any]:
        """Runs the 6-point deterministic safety validation on LLM output.

        Returns parsed dict if valid; raises ExplainerValidationError on failure.
        """
        # 1. Strict JSON schema check
        try:
            # Strip accidental markdown code blocks
            cleaned = raw_output.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            elif cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()

            data = json.loads(cleaned)
        except Exception as e:
            raise ExplainerValidationError(f"Invalid JSON schema: {e}")

        if not isinstance(data, dict):
            raise ExplainerValidationError("Output must be a JSON object.")

        summary = data.get("summary")
        if not summary or not isinstance(summary, str):
            raise ExplainerValidationError("Field 'summary' must be a non-empty string.")

        rule_breakdowns = data.get("ruleBreakdowns", [])
        if not isinstance(rule_breakdowns, list):
            raise ExplainerValidationError("Field 'ruleBreakdowns' must be a list.")

        citations = data.get("citations")
        if not isinstance(citations, list):
            raise ExplainerValidationError("Field 'citations' must be a list.")

        # 6. Minimum citations check
        if len(citations) < 1:
            raise ExplainerValidationError("At least one citation must be provided.")

        # 2. Citation verification (every citation ID exists in context)
        for cid in citations:
            if not isinstance(cid, str) or cid not in context.valid_ids:
                raise ExplainerValidationError(f"Citation ID '{cid}' does not exist in context facts.")

        for rb in rule_breakdowns:
            if not isinstance(rb, dict):
                raise ExplainerValidationError("Rule breakdown item must be an object.")
            r_id = rb.get("ruleId")
            if r_id and r_id not in context.valid_ids:
                raise ExplainerValidationError(f"Rule ID '{r_id}' in ruleBreakdowns is invalid.")
            for src_id in rb.get("sourceRecordIds", []):
                if src_id not in context.valid_ids:
                    raise ExplainerValidationError(f"Source record ID '{src_id}' is invalid.")

        # 4. Stated status check
        full_text = summary + " " + " ".join(rb.get("explanation", "") for rb in rule_breakdowns)
        server_status = context.assessment.status.value
        # If server is UNVERIFIED, check for claims of ready for verification or verified
        if server_status == "UNVERIFIED":
            if re.search(r"\b(ready for verification|all rules passed|fully passed)\b", full_text, re.IGNORECASE):
                raise ExplainerValidationError("Stated status contradicts server status 'UNVERIFIED'.")

        # 5. Forbidden words check
        for w in FORBIDDEN_WORDS:
            if re.search(rf"\b{w}\b", full_text, re.IGNORECASE):
                raise ExplainerValidationError(f"Forbidden word detected: '{w}'.")

        # Check for 'verified' (allow only if exactly part of 'READY_FOR_VERIFICATION' or 'ready for verification')
        verified_matches = re.finditer(r"\bverified\b", full_text, re.IGNORECASE)
        for m in verified_matches:
            start, end = max(0, m.start() - 15), min(len(full_text), m.end() + 15)
            snippet = full_text[start:end].lower()
            if "ready for verification" not in snippet:
                raise ExplainerValidationError("Forbidden word 'verified' detected outside permitted phrase 'Ready for verification'.")

        # 3. Number grounding check
        ExplainerValidator._check_number_grounding(full_text, citations, context)

        return data

    @staticmethod
    def _check_number_grounding(text: str, citations: List[str], context: ExplainerContext) -> None:
        """Verifies every number in text is grounded, ignoring digits in cited IDs and normalizing dates."""
        scrubbed = text

        # 1. Ignore digits inside all valid context IDs and citations
        all_ids = sorted(list(context.valid_ids) + citations, key=len, reverse=True)
        for cid in all_ids:
            if cid:
                scrubbed = scrubbed.replace(cid, "[ID_TOKEN]")

        # 2. Extract and validate ISO dates (YYYY-MM-DD)
        iso_dates = re.findall(r"\b(\d{4})-(\d{1,2})-(\d{1,2})\b", scrubbed)
        for year_s, month_s, day_s in iso_dates:
            y, m, d = float(year_s), float(int(month_s)), float(int(day_s))
            if y not in context.ground_truth_numbers:
                raise ExplainerValidationError(f"Ungrounded year '{year_s}' in date.")
            if m not in context.ground_truth_numbers:
                raise ExplainerValidationError(f"Ungrounded month '{month_s}' in date.")
            if d not in context.ground_truth_numbers:
                raise ExplainerValidationError(f"Ungrounded day '{day_s}' in date.")
        scrubbed = re.sub(r"\b\d{4}-\d{1,2}-\d{1,2}\b", "[DATE_TOKEN]", scrubbed)

        # 3. Extract and validate slash dates (DD/MM/YYYY)
        slash_dates = re.findall(r"\b(\d{1,2})/(\d{1,2})/(\d{4})\b", scrubbed)
        for day_s, month_s, year_s in slash_dates:
            y, m, d = float(year_s), float(int(month_s)), float(int(day_s))
            if y not in context.ground_truth_numbers:
                raise ExplainerValidationError(f"Ungrounded year '{year_s}' in date.")
            if m not in context.ground_truth_numbers:
                raise ExplainerValidationError(f"Ungrounded month '{month_s}' in date.")
            if d not in context.ground_truth_numbers:
                raise ExplainerValidationError(f"Ungrounded day '{day_s}' in date.")
        scrubbed = re.sub(r"\b\d{1,2}/\d{1,2}/\d{4}\b", "[DATE_TOKEN]", scrubbed)

        # 4. Separate numbers from adjacent units (e.g. 525.9m -> 525.9 m, 20.0% -> 20.0 %)
        scrubbed = re.sub(r"(\d+(?:\.\d+)?)([a-zA-Z%]+)", r"\1 \2", scrubbed)

        # 5. Extract all remaining numbers (integers & floats)
        numbers_found = re.findall(r"\b\d+(?:\.\d+)?\b", scrubbed)
        for num_s in numbers_found:
            num = float(num_s)
            # Check if num is close to any ground truth number
            is_grounded = any(abs(num - gt) < 1e-2 for gt in context.ground_truth_numbers)
            if not is_grounded:
                raise ExplainerValidationError(f"Ungrounded number detected: '{num_s}'.")
