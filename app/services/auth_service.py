from datetime import timedelta
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.recording import Recording
from app.models.user import User
from app.schemas.auth import UserCreate, UserUpdate


class AuthService:
    @staticmethod
    def create_user(db: Session, user: UserCreate) -> User:
        """Create a new user."""
        # Check if username exists
        if db.query(User).filter(User.username == user.username).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered",
            )

        # Check if email exists
        if db.query(User).filter(User.email == user.email).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        # Create user
        hashed_password = get_password_hash(user.password)
        db_user = User(username=user.username, email=user.email, password=hashed_password)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password."""
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return None
        if not verify_password(password, user.password):
            return None
        return user

    @staticmethod
    def create_access_token_for_user(user: User) -> str:
        """Create access token for authenticated user."""
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        return create_access_token(data={"sub": str(user.id)}, expires_delta=access_token_expires)

    @staticmethod
    def update_user(db: Session, user: User, user_update: UserUpdate) -> User:
        """Update user information."""
        update_data = user_update.model_dump(exclude_unset=True)

        if "password" in update_data:
            update_data["password"] = get_password_hash(update_data["password"])

        # Check username uniqueness
        if "username" in update_data and update_data["username"] != user.username:
            if db.query(User).filter(User.username == update_data["username"]).first():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already exists",
                )

        # Check email uniqueness
        if "email" in update_data and update_data["email"] != user.email:
            if db.query(User).filter(User.email == update_data["email"]).first():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already exists",
                )

        for field, value in update_data.items():
            setattr(user, field, value)

        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def change_password(db: Session, user: User, current_password: str, new_password: str) -> bool:
        """Change user password."""
        if not verify_password(current_password, user.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect",
            )

        user.password = get_password_hash(new_password)
        db.commit()
        return True

    @staticmethod
    def get_user_stats(db: Session, user: User) -> dict:
        """Get user statistics."""
        recordings_count = db.query(Recording).filter(Recording.user_id == user.id).count()
        storage_used = db.query(func.sum(Recording.file_size)).filter(Recording.user_id == user.id).scalar() or 0

        return {"recordings_count": recordings_count, "storage_used": storage_used}
