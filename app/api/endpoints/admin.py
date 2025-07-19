from typing import Any, List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_admin_user
from app.models.user import User
from app.schemas.admin import AdminStats
from app.schemas.auth import UserAdminResponse, UserCreate, UserUpdate
from app.services.admin_service import AdminService

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/dashboard")
def admin_dashboard(current_user: User = Depends(get_current_admin_user)) -> Any:
    """
    Admin dashboard access check.
    """
    return {"message": "Welcome to Admin Dashboard"}


@router.get("/users", response_model=List[UserAdminResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
) -> Any:
    """
    Get all users with statistics.
    """
    return AdminService.get_all_users(db)


@router.post("/users", response_model=UserAdminResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
    current_user: User = Depends(get_current_admin_user),
) -> Any:
    """
    Admin create user.
    """
    return AdminService.create_user(db=db, user=user_in)


@router.put("/users/{user_id}", response_model=UserAdminResponse)
def update_user(
    *,
    db: Session = Depends(get_db),
    user_id: int,
    user_in: UserUpdate,
    current_user: User = Depends(get_current_admin_user),
) -> Any:
    """
    Admin update user.
    """
    return AdminService.update_user(db=db, user_id=user_id, user_update=user_in)


@router.delete("/users/{user_id}")
def delete_user(
    *,
    db: Session = Depends(get_db),
    user_id: int,
    current_user: User = Depends(get_current_admin_user),
) -> Any:
    """
    Admin delete user.
    """
    AdminService.delete_user(db=db, user_id=user_id, current_user_id=current_user.id)
    return {"success": True}


@router.post("/users/{user_id}/toggle-admin")
def toggle_admin_status(
    *,
    db: Session = Depends(get_db),
    user_id: int,
    current_user: User = Depends(get_current_admin_user),
) -> Any:
    """
    Toggle user admin status.
    """
    is_admin = AdminService.toggle_admin(db=db, user_id=user_id, current_user_id=current_user.id)
    return {"success": True, "is_admin": is_admin}


@router.get("/stats", response_model=AdminStats)
def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
) -> Any:
    """
    Get admin dashboard statistics.
    """
    return AdminService.get_admin_stats(db)
