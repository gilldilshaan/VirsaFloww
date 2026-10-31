import os
import json
import hashlib
from typing import Dict, Any, Optional
from backend.app.core.config import settings

class ExplainerCache:
    def __init__(self, cache_file_path: Optional[str] = None):
        self.cache_file_path = cache_file_path or os.path.join(settings.RUNTIME_DIR, "explainer_cache.json")
        os.makedirs(os.path.dirname(self.cache_file_path), exist_ok=True)

    def _read_cache(self) -> Dict[str, Any]:
        if not os.path.exists(self.cache_file_path):
            return {}
        try:
            with open(self.cache_file_path, "r", encoding="utf-8") as f:
                content = f.read().strip()
                return json.loads(content) if content else {}
        except Exception:
            return {}

    def _write_cache(self, data: Dict[str, Any]) -> None:
        temp_path = f"{self.cache_file_path}.tmp"
        with open(temp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, sort_keys=True)
        os.replace(temp_path, self.cache_file_path)

    @staticmethod
    def compute_cache_key(
        assessment_id: str,
        ruleset_version: str,
        canonical_dict: Dict[str, Any],
        question: str,
    ) -> str:
        canonical_json = json.dumps(canonical_dict, sort_keys=True, separators=(",", ":"))
        context_hash = hashlib.sha256(canonical_json.encode("utf-8")).hexdigest()
        normalized_q = question.strip().lower()

        composite = f"{assessment_id}:{ruleset_version}:{context_hash}:{normalized_q}"
        return hashlib.sha256(composite.encode("utf-8")).hexdigest()

    def get(self, cache_key: str) -> Optional[Dict[str, Any]]:
        cache = self._read_cache()
        return cache.get(cache_key)

    def set(self, cache_key: str, value: Dict[str, Any]) -> None:
        cache = self._read_cache()
        cache[cache_key] = value
        self._write_cache(cache)

    def clear(self) -> None:
        if os.path.exists(self.cache_file_path):
            try:
                os.remove(self.cache_file_path)
            except Exception:
                pass
