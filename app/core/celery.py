import os

from celery import Celery

CELERY_BROKER_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
CELERY_RESULT_BACKEND = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery = Celery(
    "sercuescribe",
    broker=CELERY_BROKER_URL,
    backend=CELERY_RESULT_BACKEND,
)


# Example simple task
def add(x: int, y: int) -> int:
    return x + y
