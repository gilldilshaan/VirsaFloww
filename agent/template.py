from typing import Dict, Any, List
from agent.context import ExplainerContext

class ExplainerTemplate:
    @staticmethod
    def generate(context: ExplainerContext) -> Dict[str, Any]:
        """Deterministic string-assembly fallback engine.

        Zero AI dependency. Guarantees 100% adherence to server ground truth.
        """
        assessment = context.assessment
        field = context.field

        pass_rules = [r for r in assessment.rule_results if r.result.value == "pass"]
        fail_rules = [r for r in assessment.rule_results if r.result.value == "fail"]
        warn_rules = [r for r in assessment.rule_results if r.result.value == "warn"]

        status_str = assessment.status.value
        summary = (
            f"Assessment {assessment.id} for field {field.id} has server status '{status_str}'. "
            f"Automated evaluation completed across {len(assessment.rule_results)} screening rules: "
            f"{len(pass_rules)} passed, {len(fail_rules)} flagged, {len(warn_rules)} warnings."
        )

        rule_breakdowns: List[Dict[str, Any]] = []
        citations_set = {field.id, assessment.id}

        for r in sorted(assessment.rule_results, key=lambda x: x.rule_id):
            citations_set.add(r.rule_id)
            for s_id in r.source_record_ids:
                citations_set.add(s_id)

            rule_breakdowns.append({
                "ruleId": r.rule_id,
                "status": r.result.value,
                "explanation": r.explanation,
                "sourceRecordIds": r.source_record_ids,
            })

        citations = sorted(list(citations_set))

        return {
            "summary": summary,
            "ruleBreakdowns": rule_breakdowns,
            "citations": citations,
        }
