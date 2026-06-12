from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr
from models import UserRole


class UserBase(BaseModel):
    username:  str
    email:     str
    full_name: str
    role:      UserRole = UserRole.DEVELOPER


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    username:  Optional[str]      = None
    email:     Optional[str]      = None
    full_name: Optional[str]      = None
    role:      Optional[UserRole] = None


class UserOut(UserBase):
    id:         uuid.UUID
    created_at: datetime

    model_config = {"from_attributes": True}
