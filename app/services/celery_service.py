from app.core.celery import celery


# Async task trigger
def trigger_add_task(x: int, y: int):
    task = celery.send_task("app.core.celery.add", args=[x, y])
    return task.id


# Get task result
def get_task_result(task_id: str):
    async_result = celery.AsyncResult(task_id)
    return {
        "task_id": task_id,
        "status": async_result.status,
        "result": async_result.result if async_result.successful() else None,
    }
