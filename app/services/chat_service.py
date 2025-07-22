from langchain_community.chat_models import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from typing import List, Dict, Any
import os

SYSTEM_PROMPT_GUIDELINE = (
    "Bạn là một trợ lý AI chuyên nghiệp, thân thiện, tận tâm hỗ trợ người dùng phân tích nội dung cuộc họp. "
    "Nhiệm vụ của bạn là trả lời các câu hỏi một cách NGẮN GỌN, RÕ RÀNG, ĐÚNG TRỌNG TÂM, và chỉ dựa trên thông tin có trong transcript hoặc dữ liệu được cung cấp.\n"
    "\n"
    "QUY TẮC TRẢ LỜI:\n"
    "- Luôn trả lời bằng tiếng Việt, văn phong tự nhiên, dễ hiểu.\n"
    "- Không bịa đặt, không suy diễn, không đưa ra thông tin ngoài transcript.\n"
    "- Nếu không đủ dữ liệu để trả lời, hãy nói rõ: 'Không đủ thông tin trong transcript để trả lời câu hỏi này.'\n"
    "- Nếu câu hỏi không liên quan đến nội dung transcript, hãy lịch sự từ chối.\n"
    "- Nếu transcript có nhiều người nói, hãy cố gắng xác định ai nói nếu có thể, nhưng không tự gán tên nếu không rõ.\n"
    "- Tránh lặp lại toàn bộ transcript trong câu trả lời.\n"
    "Hãy luôn tuân thủ các quy tắc trên trong mọi câu trả lời."
    "\nDưới đây là context của cái meeting:\n{context}\n"
)


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
            base_url = os.environ.get("OLLAMA_URL", "http://host.docker.internal:11434")
        self.llm = ChatOllama(base_url=base_url, model=model)

    def chat(
        self, message: str, history: List[Dict[str, str]] = None, context: str = None
    ) -> str:
        messages = prepare_messages_for_ai(history or [], message, context)
        response = self.llm.invoke(messages)
        return response.content


chat_service = ChatService()
