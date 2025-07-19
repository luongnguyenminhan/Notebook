from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.auth import (
    PasswordChange,
    Token,
    UserCreate,
    UserResponse,
    UserUpdate,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)) -> Any:
    """
    Create new user.
    """
    # Check if registration is allowed
    if not settings.allow_registration:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Registration is currently disabled. Please contact the administrator.",
        )

    return AuthService.create_user(db=db, user=user)


@router.post("/login", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    user = AuthService.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = AuthService.create_access_token_for_user(user)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
def read_user_me(current_user: User = Depends(get_current_user)) -> Any:
    """
    Get current user.
    """
    return current_user


@router.put("/me", response_model=UserResponse)
def update_user_me(
    *,
    db: Session = Depends(get_db),
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update own user.
    """
    # Remove is_admin from user input (only admins can change this)
    user_data = user_in.model_dump(exclude_unset=True)
    user_data.pop("is_admin", None)

    user_update = UserUpdate(**user_data)
    return AuthService.update_user(db=db, user=current_user, user_update=user_update)


@router.post("/change-password")
def change_password(
    *,
    db: Session = Depends(get_db),
    password_change: PasswordChange,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Change user password.
    """
    AuthService.change_password(
        db=db,
        user=current_user,
        current_password=password_change.current_password,
        new_password=password_change.new_password,
    )
    return {"message": "Password updated successfully"}


@router.get("/account")
def get_account_info(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> Any:
    """
    Get account information with settings.
    """
    stats = AuthService.get_user_stats(db, current_user)

    default_summary_prompt = """Identify the key issues discussed. First, give me minutes. Then, give me the key issues discussed. Then, any key takeaways. Then, key next steps. Then, all important things that I didn't ask for but that need to be recorded. Make sure every important nuance is covered."""

    return {
        "user": current_user,
        "stats": stats,
        "default_summary_prompt": default_summary_prompt,
        "use_asr_endpoint": settings.use_asr_endpoint,
        "asr_diarize_locked": settings.asr_diarize is not None,
        "asr_diarize_env_value": settings.asr_diarize,
    }
