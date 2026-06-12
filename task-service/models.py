import uuid
import enum
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from database import Base


class TaskStatus(str, enum.Enum):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"


class TaskPriority(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class Task(Base):
    __tablename__ = "tasks"
    __table_args__ = {"schema": "tasks_db"}

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title       = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status      = Column(
        Enum(TaskStatus, name="task_status", schema="tasks_db"),
        nullable=False,
        default=TaskStatus.TODO,
    )
    priority    = Column(
        Enum(TaskPriority, name="task_priority", schema="tasks_db"),
        nullable=False,
        default=TaskPriority.MEDIUM,
    )
    assigned_to = Column(String(255), nullable=True)
    created_at  = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at  = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
