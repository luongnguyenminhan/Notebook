from sqlalchemy import BigInteger, Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.orm import relationship

from app.db import BaseEntity


class Recording(BaseEntity):
    __tablename__ = "recordings"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    # Title will now often be AI-generated, maybe start with filename?
    title = Column(String(200), nullable=True)  # Allow Null initially
    participants = Column(String(500), nullable=True)
    summary = Column(String(500), nullable=True)
    original_filename = Column(String(255), nullable=True)
    audio_path = Column(String(500), nullable=True)
    bucket_name = Column(String(255), nullable=True)
    object_name = Column(String(255), nullable=True)
    transcription = Column(LONGTEXT, nullable=True)  # Đã chuyển sang LONGTEXT cho MySQL
    summary = Column(Text, nullable=True)
    status = Column(String(20), default="PENDING")  # PENDING, PROCESSING, SUMMARIZING, COMPLETED, FAILED
    file_size = Column(BigInteger, nullable=True)
    duration = Column(Integer, nullable=True)  # in seconds
    is_highlighted = Column(Boolean, nullable=False, default=False)

    # Processing metadata
    processing_started_at = Column(DateTime(timezone=True), nullable=True)
    processing_completed_at = Column(DateTime(timezone=True), nullable=True)
    error_message = Column(Text, nullable=True)

    # Example additional column
    notes = Column(Text, nullable=True)

    # Relationships
    owner = relationship("User", back_populates="recordings")

    def __repr__(self):
        return f"Recording('{self.filename}', '{self.status}')"
