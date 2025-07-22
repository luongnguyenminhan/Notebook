import os
from typing import List, Dict
from litellm import completion

class ChatService:
    def __init__(self, base_url: str = None, model: str = "ollama/llama2"):
        if base_url is None:
            base_url = os.environ.get("OLLAMA_URL", "http://localhost:11434")
        self.base_url = base_url
        self.model = model

    def chat(self, message: str, history: List[Dict[str, str]] = None) -> str:
        # Compose messages for litellm
        messages = []
        if history:
            for item in history:
                # Defensive: skip if missing keys
                if not isinstance(item, dict):
                    continue
                role = item.get("role")
                content = item.get("content")
                if role and content:
                    messages.append({"role": role, "content": content})
        # Add current user message
        messages.append({"role": "user", "content": message})
        response = completion(
            model=self.model,
            messages=messages,
            api_base=self.base_url
        )
        return response.choices[0].message.content

chat_service = ChatService()
