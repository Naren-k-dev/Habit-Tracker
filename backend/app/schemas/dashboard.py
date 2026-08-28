from datetime import date

from pydantic import BaseModel


class DashboardToday(BaseModel):
    date: date
    total_habits: int
    completed_habits: int
    progress_percentage: float


class DashboardPeriod(BaseModel):
    id: int
    name: str
    start_date: date
    end_date: date
    current_day: int
    total_days: int


class DashboardSummaryResponse(BaseModel):
    today: DashboardToday
    current_streak: int
    period: DashboardPeriod | None