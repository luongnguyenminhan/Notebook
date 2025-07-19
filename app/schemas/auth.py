from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, field_validator


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return v


class SuperUserCreate(UserCreate):
    pass


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_admin: Optional[bool] = None
    name: Optional[str] = None
    job_title: Optional[str] = None
    company: Optional[str] = None
    transcription_language: Optional[str] = None
    output_language: Optional[str] = None
    summary_prompt: Optional[str] = None
    diarize: Optional[bool] = None

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if v is not None and len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return v


class UserResponse(UserBase):
    id: int
    is_admin: bool
    name: Optional[str] = None
    job_title: Optional[str] = None
    company: Optional[str] = None
    transcription_language: Optional[str] = None
    output_language: Optional[str] = None
    summary_prompt: Optional[str] = None
    diarize: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserAdminResponse(UserResponse):
    recordings_count: int
    storage_used: int


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    remember: Optional[bool] = False


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[str] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return v

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v, info):
        if "new_password" in info.data and v != info.data["new_password"]:
            raise ValueError("New password and confirmation do not match")
        return v
