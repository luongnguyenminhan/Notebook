from langchain_community.chat_models import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from typing import List, Dict, Any
import os


def prepare_messages_for_ai(history: List[Dict[str, str]], message: str) -> List:
    messages = []
    if history:
        for item in history:
            if not isinstance(item, dict) or "content" not in item:
                continue
            role = item.get("role", "user")
            if role == "system":
                messages.append(SystemMessage(content=item["content"]))
            elif role in ("bot", "assistant", "ai"):
                messages.append(AIMessage(content=item["content"]))
            else:
                messages.append(HumanMessage(content=item["content"]))
    messages.append(HumanMessage(content=message))
    return messages


class ChatService:
    def __init__(self, base_url: str = None, model: str = "mistral:7b"):
        if base_url is None:
            base_url = os.environ.get("OLLAMA_URL", "http://ollama:11434")
        self.llm = ChatOllama(base_url=base_url, model=model)

    def chat(self, message: str, history: List[Dict[str, str]] = None) -> str:
        messages = prepare_messages_for_ai(history or [], message)
        response = self.llm.invoke(messages)
        return response.content


chat_service = ChatService()
