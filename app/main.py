from fastapi import FastAPI

from app.api.endpoints import audio_stream, celery_task

app = FastAPI(title="SercueScribe")

app.include_router(celery_task.router, prefix="/api", tags=["celery"])
app.include_router(audio_stream.router, prefix="/api", tags=["audio"])


@app.get("/")
def root():
    return {"message": "Welcome to SercueScribe API"}


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "SercueScribe"}
