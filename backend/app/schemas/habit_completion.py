from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class HabitCompletionCreate(BaseModel):
    habit_id: int
    completion_date: date
    completed: bool


class HabitCompletionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    habit_id: int
    completion_date: date
    completed: bool
    completed_at: datetime | None