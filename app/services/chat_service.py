from langchain_community.chat_models import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from typing import List, Dict, Any
import os

SYSTEM_PROMPT_GUIDELINE = """You are a professional, dedicated AI assistant supporting the user in analyzing meeting content.  
Answer CONCISELY, CLEARLY, and PROFESSIONALLY, relying solely on the transcript or provided data.  

RULES:  
- Always respond in Vietnamese, with natural, formal, office-style tone, and avoid verbosity.  
- Do not infer, fabricate, or include information beyond the transcript.  
- If the transcript lacks sufficient information, clearly state: “Không đủ thông tin trong transcript để trả lời câu hỏi này.”  
- Stay focused and brief.  

Below is the meeting content (context):  
{context}

- Always respond in Vietnamese, with natural, formal, office-style tone, and avoid verbosity.  
- Avoid repeating or quoting the transcript.  
- DO NOT NEED TO TRANSLATE TO OTHER LANGUAGE, JUST USE VIETNAMESE ONLY
"""


def prepare_messages_for_ai(
    history: List[Dict[str, str]], message: str, context
) -> List:
    system_prompt = SYSTEM_PROMPT_GUIDELINE.format(context=context or "")
    print(system_prompt)
    messages = [SystemMessage(content=system_prompt)]
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
    def __init__(
        self,
        base_url: str = None,
        model: str = "hf.co/namanhngco/merged_meetingqa_mistral-4bit-gguf:Q5_K_S",
    ):
        if base_url is None:
            base_url = os.environ.get("OLLAMA_API_BASE", "http://ollama:11434")
        self.llm = ChatOllama(base_url=base_url, model=model)

    def chat(
        self, message: str, history: List[Dict[str, str]] = None, context: str = None
    ) -> str:
        messages = prepare_messages_for_ai(history or [], message, context)
        response = self.llm.invoke(messages)
        return response.content


chat_service = ChatService()
