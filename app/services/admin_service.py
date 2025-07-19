from typing import List

from fastapi import HTTPException, status
from sqlalchemy import desc, func
from sqlalchemy.orm import Session

from app.models.recording import Recording
from app.models.user import User
from app.schemas.admin import AdminStats
from app.schemas.auth import UserAdminResponse, UserCreate, UserUpdate
from app.services.auth_service import AuthService


class AdminService:
    @staticmethod
    def get_all_users(db: Session) -> List[UserAdminResponse]:
        """Get all users with statistics."""
        users = db.query(User).all()
        user_data = []

        for user in users:
            stats = AuthService.get_user_stats(db, user)
            user_data.append(
                UserAdminResponse(
                    id=user.id,
                    username=user.username,
                    email=user.email,
                    is_admin=user.is_admin,
                    name=user.name,
                    job_title=user.job_title,
                    company=user.company,
                    transcription_language=user.transcription_language,
                    output_language=user.output_language,
                    summary_prompt=user.summary_prompt,
                    diarize=user.diarize,
                    created_at=user.created_at,
                    updated_at=user.updated_at,
                    recordings_count=stats["recordings_count"],
                    storage_used=stats["storage_used"],
                )
            )

        return user_data

    @staticmethod
    def create_user(db: Session, user: UserCreate) -> UserAdminResponse:
        """Admin create user (includes is_admin field)."""
        created_user = AuthService.create_user(db, user)
        stats = AuthService.get_user_stats(db, created_user)

        return UserAdminResponse(
            id=created_user.id,
            username=created_user.username,
            email=created_user.email,
            is_admin=created_user.is_admin,
            name=created_user.name,
            job_title=created_user.job_title,
            company=created_user.company,
            transcription_language=created_user.transcription_language,
            output_language=created_user.output_language,
            summary_prompt=created_user.summary_prompt,
            diarize=created_user.diarize,
            created_at=created_user.created_at,
            updated_at=created_user.updated_at,
            recordings_count=stats["recordings_count"],
            storage_used=stats["storage_used"],
        )

    @staticmethod
    def update_user(db: Session, user_id: int, user_update: UserUpdate) -> UserAdminResponse:
        """Admin update user."""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        updated_user = AuthService.update_user(db, user, user_update)
        stats = AuthService.get_user_stats(db, updated_user)

        return UserAdminResponse(
            id=updated_user.id,
            username=updated_user.username,
            email=updated_user.email,
            is_admin=updated_user.is_admin,
            name=updated_user.name,
            job_title=updated_user.job_title,
            company=updated_user.company,
            transcription_language=updated_user.transcription_language,
            output_language=updated_user.output_language,
            summary_prompt=updated_user.summary_prompt,
            diarize=updated_user.diarize,
            created_at=updated_user.created_at,
            updated_at=updated_user.updated_at,
            recordings_count=stats["recordings_count"],
            storage_used=stats["storage_used"],
        )

    @staticmethod
    def delete_user(db: Session, user_id: int, current_user_id: int) -> bool:
        """Delete user and associated data."""
        if user_id == current_user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete your own account",
            )

        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Delete user (recordings will be cascade deleted)
        db.delete(user)
        db.commit()
        return True

    @staticmethod
    def toggle_admin(db: Session, user_id: int, current_user_id: int) -> bool:
        """Toggle user admin status."""
        if user_id == current_user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot change your own admin status",
            )

        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        user.is_admin = not user.is_admin
        db.commit()
        return user.is_admin

    @staticmethod
    def get_admin_stats(db: Session) -> AdminStats:
        """Get admin dashboard statistics."""
        # Basic counts
        total_users = db.query(User).count()
        total_recordings = db.query(Recording).count()

        # Recording status counts
        completed_recordings = db.query(Recording).filter(Recording.status == "COMPLETED").count()
        processing_recordings = db.query(Recording).filter(Recording.status.in_(["PROCESSING", "SUMMARIZING"])).count()
        pending_recordings = db.query(Recording).filter(Recording.status == "PENDING").count()
        failed_recordings = db.query(Recording).filter(Recording.status == "FAILED").count()

        # Total storage
        total_storage = db.query(func.sum(Recording.file_size)).scalar() or 0

        # Top users by storage
        top_users_query = (
            db.query(
                User.id,
                User.username,
                func.count(Recording.id).label("recordings_count"),
                func.sum(Recording.file_size).label("storage_used"),
            )
            .outerjoin(Recording, User.id == Recording.user_id)
            .group_by(User.id, User.username)
            .order_by(desc(func.sum(Recording.file_size)))
            .limit(5)
        )

        top_users = []
        for user_id, username, recordings_count, storage_used in top_users_query:
            top_users.append(
                {
                    "id": user_id,
                    "username": username,
                    "recordings_count": recordings_count or 0,
                    "storage_used": storage_used or 0,
                }
            )

        return AdminStats(
            total_users=total_users,
            total_recordings=total_recordings,
            completed_recordings=completed_recordings,
            processing_recordings=processing_recordings,
            pending_recordings=pending_recordings,
            failed_recordings=failed_recordings,
            total_storage=total_storage,
            total_queries=0,  # Placeholder
            top_users=top_users,
        )
