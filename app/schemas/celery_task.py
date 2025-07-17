from pydantic import BaseModel


class AddTaskRequest(BaseModel):
    x: int
    y: int


class AddTaskResult(BaseModel):
    task_id: str
    status: str
    result: int | None = None
