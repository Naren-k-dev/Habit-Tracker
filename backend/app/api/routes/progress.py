from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import get_current_user

from app.schemas.progress import (
    DailyProgressResponse,
    WeeklyProgressResponse,
    MonthlyProgressResponse,
)

from app.services.progress_service import (
    get_daily_progress,
    get_weekly_progress,
    get_monthly_progress,
)


router = APIRouter(
    prefix="/progress",
    tags=["Progress"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# ==========================================
# DAILY PROGRESS
# ==========================================

@router.get(
    "/daily/{target_date}",
    response_model=DailyProgressResponse
)
def get_daily_progress_route(
    target_date: date,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    return get_daily_progress(
        db,
        current_user_id,
        target_date
    )


# ==========================================
# WEEKLY PROGRESS
# ==========================================

@router.get(
    "/weekly/{week_start}",
    response_model=WeeklyProgressResponse
)
def get_weekly_progress_route(
    week_start: date,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    return get_weekly_progress(
        db,
        current_user_id,
        week_start
    )

# ==========================================
# MONTHLY PROGRESS
# ==========================================

@router.get(
    "/monthly/{month_start}",
    response_model=MonthlyProgressResponse
)
def get_monthly_progress_route(
    month_start: date,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    return get_monthly_progress(
        db,
        current_user_id,
        month_start
    )