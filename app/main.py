from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.endpoints import audio_stream, celery_task, test_ws

app = FastAPI(title="SercueScribe")

# Allow all origins for local development (adjust in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(celery_task.router, prefix="/api", tags=["celery"])
app.include_router(audio_stream.router, prefix="/api", tags=["audio"])
app.include_router(test_ws.router, prefix="/api/ws", tags=["test"])

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def root():
    return {"message": "Welcome to SercueScribe API"}


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "SercueScribe"}
