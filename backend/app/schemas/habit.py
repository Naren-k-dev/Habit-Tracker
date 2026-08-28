from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class HabitCreate(BaseModel):
    tracking_period_id: int

    name: str = Field(
        min_length=1,
        max_length=100
    )

    description: str | None = Field(
        default=None,
        max_length=500
    )

    start_date: date

    end_date: date | None = None


class HabitResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    tracking_period_id: int
    name: str
    description: str | None
    start_date: date
    end_date: date | None
    is_active: bool
    created_at: datetime


class HabitUpdate(BaseModel):
    tracking_period_id: int

    name: str = Field(
        min_length=1,
        max_length=100
    )

    description: str | None = Field(
        default=None,
        max_length=500
    )

    start_date: date

    end_date: date | None = None

    is_active: bool