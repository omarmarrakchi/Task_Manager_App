import uuid
import enum
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from database import Base


class UserRole(str, enum.Enum):
    INTERN    = "INTERN"
    DEVELOPER = "DEVELOPER"
    MANAGER   = "MANAGER"
    LEAD      = "LEAD"


class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "users_db"}

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username   = Column(String(100), unique=True, nullable=False)
    email      = Column(String(255), unique=True, nullable=False)
    full_name  = Column(String(255), nullable=False)
    role       = Column(
        Enum(UserRole, name="user_role", schema="users_db"),
        nullable=False,
        default=UserRole.DEVELOPER,
    )
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
