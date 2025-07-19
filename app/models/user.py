from sqlalchemy import Boolean, Column, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db import BaseEntity


class User(BaseEntity):
    __tablename__ = "users"

    username = Column(String(20), unique=True, nullable=False, index=True)
    email = Column(String(120), unique=True, nullable=False, index=True)
    password = Column(String(60), nullable=False)
    is_admin = Column(Boolean, default=False)

    # Profile fields
    name = Column(String(100), nullable=True)
    job_title = Column(String(100), nullable=True)
    company = Column(String(100), nullable=True)

    # Language preferences
    transcription_language = Column(String(10), nullable=True)  # ISO 639-1 codes
    output_language = Column(String(50), nullable=True)  # Full language names
    summary_prompt = Column(Text, nullable=True)

    # ASR settings
    diarize = Column(Boolean, default=False)

    # Relationships
    recordings = relationship("Recording", back_populates="owner", cascade="all, delete-orphan")

    def __repr__(self):
        return f"User('{self.username}', '{self.email}')"
