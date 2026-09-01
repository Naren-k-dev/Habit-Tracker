from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


# ==========================================
# CONSTANT TYPES
# ==========================================

TaskPriority = Literal[
    "low",
    "medium",
    "high",
]

TaskCategory = Literal[
    "AI / ML",
    "DSA",
    "College",
    "Personal",
    "Fitness",
    "Project",
    "Other",
]


# ==========================================
# CREATE TASK
# ==========================================

class DailyTaskCreate(BaseModel):

    tracking_period_id: int

    title: str = Field(
        min_length=1,
        max_length=200
    )

    description: str | None = Field(
        default=None,
        max_length=500
    )

    task_date: date

    due_date: date | None = None

    priority: TaskPriority = "medium"

    category: TaskCategory = "Other"


# ==========================================
# UPDATE TASK
# ==========================================

class DailyTaskUpdate(BaseModel):

    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=200
    )

    description: str | None = Field(
        default=None,
        max_length=500
    )

    task_date: date | None = None

    due_date: date | None = None

    priority: TaskPriority | None = None

    category: TaskCategory | None = None

    completed: bool | None = None


# ==========================================
# TASK RESPONSE
# ==========================================

class DailyTaskResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: int

    user_id: int

    tracking_period_id: int

    title: str

    description: str | None

    task_date: date

    due_date: date | None

    priority: TaskPriority

    category: TaskCategory

    completed: bool

    completed_at: datetime | None

    created_at: datetime