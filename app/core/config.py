import os
from functools import lru_cache
from typing import Optional

from dotenv import load_dotenv
from pydantic import ConfigDict
from pydantic_settings import BaseSettings

# Load environment variables from .env file
load_dotenv()


class Settings(BaseSettings):
    # Database Configuration
    database_url: str = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://user:password@localhost:3306/sercuescribe?charset=utf8mb4",
    )

    # Security Configuration
    secret_key: str = os.getenv(
        "SECRET_KEY", "your-super-secret-jwt-key-change-this-in-production"
    )
    algorithm: str = "HS256"
    access_token_expire_minutes: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
    )
    asr_endpoint: str = os.getenv("ASR_ENDPOINT", "https://open-ai-api.epoints.vn")

    # Application Settings
    allow_registration: bool = os.getenv("ALLOW_REGISTRATION", "true").lower() == "true"
    environment: str = os.getenv("ENVIRONMENT", "development")

    # ASR Settings
    asr_diarize: Optional[bool] = (
        None
        if os.getenv("ASR_DIARIZE") is None
        else os.getenv("ASR_DIARIZE").lower() == "true"
    )
    use_asr_endpoint: bool = os.getenv("USE_ASR_ENDPOINT", "true").lower() == "true"

    # Redis Configuration
    redis_url: str = os.getenv("REDIS_URL", "redis://redis:6379")

    # Development Settings (optional)
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"

    # MinIO Configuration
    minio_endpoint: str = os.getenv("MINIO_ENDPOINT", "localhost:9000")
    minio_access_key: str = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
    minio_secret_key: str = os.getenv("MINIO_SECRET_KEY", "minioadmin")
    minio_secure: bool = os.getenv("MINIO_SECURE", "false").lower() == "true"
    minio_bucket_prefix: str = os.getenv("MINIO_BUCKET_PREFIX", "sercuescribe")

    # Email Settings (for Meet automation) - keeping existing for compatibility
    email_id: Optional[str] = os.getenv("EMAIL_ID")
    email_password: Optional[str] = os.getenv("EMAIL_PASSWORD")

    # Whisper Settings - keeping existing for compatibility
    hf_whisper_model: str = os.getenv("HF_WHISPER_MODEL", "openai/whisper-large-v3")
    max_audio_size_bytes: int = int(os.getenv("MAX_AUDIO_SIZE_BYTES", "20971520"))

    model_config = ConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",  # Allow extra fields but ignore them
    )
    # - Thêm cấu hình Celery cho background tasks
    celery_broker_url: str = os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0")
    celery_result_backend: str = os.getenv(
        "CELERY_RESULT_BACKEND", "redis://redis:6379/0"
    )


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
