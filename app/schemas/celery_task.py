from pydantic import BaseModel


class AddTaskRequest(BaseModel):
    x: int
    y: int


class TranscribeChunkRequest(BaseModel):
    session_id: str
    chunk_path: str


class TranscribeChunkResult(BaseModel):
    session_id: str
    chunk_path: str
    transcript: str


class AddTaskResult(BaseModel):
    task_id: str
    status: str
    result: int | None = None
