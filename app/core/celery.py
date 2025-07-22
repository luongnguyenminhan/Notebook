import os

from celery import Celery

CELERY_BROKER_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")
CELERY_RESULT_BACKEND = os.getenv("REDIS_URL", "redis://redis:6379/0")

celery = Celery(
    "sercuescribe",
    broker=CELERY_BROKER_URL,
    backend=CELERY_RESULT_BACKEND,
    include=["app.tasks.audio_tasks"],
)
# Configure Celery
celery.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=24 * 60 * 60,  # 24 hours
    task_soft_time_limit=24 * 60 * 60,  # 24 hours
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)


# Example simple task
def add(x: int, y: int) -> int:
    return x + y
