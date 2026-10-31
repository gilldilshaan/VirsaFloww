import os
import json
import logging
from typing import Optional, Dict, Any
import httpx
from agent.prompts import SYSTEM_EXPLAINER_PROMPT

logger = logging.getLogger("terraledger-explainer")

class LLMAdapter:
    def __init__(
        self,
        api_url: Optional[str] = None,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
        timeout_seconds: float = 5.0,
    ):
        self.api_url = api_url or os.getenv("EXPLAINER_LLM_URL")
        self.api_key = api_key or os.getenv("EXPLAINER_LLM_KEY")
        self.model = model or os.getenv("EXPLAINER_LLM_MODEL", "gemini-1.5-flash")
        self.timeout_seconds = timeout_seconds

    def is_available(self) -> bool:
        return bool(self.api_url and self.api_key)

    def generate_explanation(
        self,
        prompt_dict: Dict[str, Any],
        user_question: str,
    ) -> Optional[str]:
        """Calls the configured LLM endpoint with timeout and 1 retry.
        
        Returns raw text response or None if LLM is disabled or call fails.
        """
        if not self.is_available():
            return None

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": SYSTEM_EXPLAINER_PROMPT},
                {
                    "role": "user",
                    "content": f"Context Data:\n{json.dumps(prompt_dict, indent=2)}\n\nUser Question:\n{user_question}",
                },
            ],
            "temperature": 0.0,
        }
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        # Attempt call with max 1 retry
        for attempt in range(2):
            try:
                with httpx.Client(timeout=self.timeout_seconds) as client:
                    resp = client.post(self.api_url, json=payload, headers=headers)
                    if resp.status_code == 200:
                        data = resp.json()
                        # Extract response text depending on API structure (e.g. choices[0].message.content)
                        if "choices" in data and len(data["choices"]) > 0:
                            return data["choices"][0].get("message", {}).get("content", "")
                        elif "text" in data:
                            return data["text"]
                        return json.dumps(data)
                    else:
                        logger.warning(f"LLM API returned status {resp.status_code} (attempt {attempt+1})")
            except Exception as e:
                logger.warning(f"LLM API connection error (attempt {attempt+1}): {e}")

        return None
