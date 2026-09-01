from datetime import date

from pydantic import BaseModel


# ==========================================
# DAILY PROGRESS
# ==========================================

class DailyHabitProgress(BaseModel):

    habit_id: int

    habit_name: str

    status: str


class DailyProgressResponse(BaseModel):

    date: date

    total_habits: int

    completed_habits: int

    missed_habits: int

    pending_habits: int

    progress_percentage: float

    habits: list[DailyHabitProgress]


# ==========================================
# WEEKLY PROGRESS
# ==========================================

class WeeklyDayProgress(BaseModel):

    date: date

    total_habits: int

    completed_habits: int

    missed_habits: int

    pending_habits: int

    progress_percentage: float


class WeeklyProgressResponse(BaseModel):

    week_start: date

    week_end: date

    total_habits: int

    total_completed: int

    total_missed: int

    total_pending: int

    progress_percentage: float

    days: list[WeeklyDayProgress]


# ==========================================
# MONTHLY PROGRESS
# ==========================================

class MonthlyDayProgress(BaseModel):

    date: date

    total_habits: int

    completed_habits: int

    missed_habits: int

    pending_habits: int

    progress_percentage: float


class MonthlyHabitProgress(BaseModel):

    habit_id: int

    habit_name: str

    total_days: int

    completed_days: int

    missed_days: int

    pending_days: int

    progress_percentage: float


class MonthlyProgressResponse(BaseModel):

    month_start: date

    month_end: date

    total_habits: int

    total_completed: int

    total_missed: int

    total_pending: int

    progress_percentage: float

    days: list[MonthlyDayProgress]

    habit_progress: list[MonthlyHabitProgress]