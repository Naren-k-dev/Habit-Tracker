from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class TrackingPeriodCreate(BaseModel):

    name: str = Field(
        min_length=1,
        max_length=100
    )

    start_date: date

    end_date: date


class TrackingPeriodUpdate(BaseModel):

    name: str = Field(
        min_length=1,
        max_length=100
    )

    start_date: date

    end_date: date


class TrackingPeriodResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: int

    user_id: int

    name: str

    start_date: date

    end_date: date

    is_active: bool

    created_at: datetime