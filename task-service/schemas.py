from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from models import TaskStatus, TaskPriority


class TaskBase(BaseModel):
    title:       str
    description: Optional[str] = None
    status:      TaskStatus    = TaskStatus.TODO
    priority:    TaskPriority  = TaskPriority.MEDIUM
    assigned_to: Optional[str] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title:       Optional[str]          = None
    description: Optional[str]          = None
    status:      Optional[TaskStatus]   = None
    priority:    Optional[TaskPriority] = None
    assigned_to: Optional[str]          = None


class TaskOut(TaskBase):
    id:         uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TaskStats(BaseModel):
    total:       int
    todo:        int
    in_progress: int
    done:        int
    low:         int
    medium:      int
    high:        int
    critical:    int
