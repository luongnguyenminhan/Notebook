from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.endpoints import admin, auth, celery_task, recording
from app.core.config import settings

app = FastAPI(
    title="SercueScribe",
    description="AI-powered transcription and summarization service",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(celery_task.router)
app.include_router(recording.router)


@app.get("/")
def root():
    return {"message": "Welcome to SercueScribe API", "version": "1.0.0"}


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SercueScribe API",
        "version": "1.0.0",
        "database": "connected",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "SercueScribe"}
