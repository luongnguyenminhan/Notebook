from fastapi import FastAPI

from app.api.endpoints import celery_task, google_meet

app = FastAPI(title="SercueScribe")

app.include_router(celery_task.router)
app.include_router(google_meet.router)


@app.get("/")
def root():
    return {"message": "Welcome to SercueScribe API"}
