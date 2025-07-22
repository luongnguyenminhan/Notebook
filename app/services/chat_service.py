from langchain_community.chat_models import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage
from typing import List, Dict, Any
import os


class ChatService:
    def __init__(self, base_url: str = None, model: str = "mistral:7b"):
        if base_url is None:
            base_url = os.environ.get("OLLAMA_URL", "http://ollama:11434")
        self.llm = ChatOllama(base_url=base_url, model=model)

    def chat(self, message: str, history: List[Dict[str, str]] = None) -> str:
        messages = []
        if history:
            for item in history:
                if item["role"] == "system":
                    messages.append(SystemMessage(content=item["content"]))
                else:
                    messages.append(HumanMessage(content=item["content"]))
        messages.append(HumanMessage(content=message))
        response = self.llm.invoke(messages)
        return response.content


chat_service = ChatService()
