from fastapi import APIRouter

from app.schemas.celery_task import AddTaskRequest, AddTaskResult
from app.services.celery_service import get_task_result, trigger_add_task

router = APIRouter()


@router.post("/celery/add", response_model=AddTaskResult)
def add_task(request: AddTaskRequest):
    task_id = trigger_add_task(request.x, request.y)
    return AddTaskResult(task_id=task_id, status="PENDING")


@router.get("/celery/result/{task_id}", response_model=AddTaskResult)
def get_result(task_id: str):
    result = get_task_result(task_id)
    return AddTaskResult(**result)
