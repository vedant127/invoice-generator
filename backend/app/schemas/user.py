from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from uuid import UUID
from typing import Optional
from ..models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    business_name: Optional[str] = None
    selected_template: str = "minimalist"
    role: UserRole = UserRole.OWNER

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    business_name: Optional[str] = None
    selected_template: Optional[str] = None
    password: Optional[str] = None

class UserOut(UserBase):
    id: UUID
    is_active: bool
    is_verified: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[str] = None
