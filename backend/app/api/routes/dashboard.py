from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import get_current_user

from app.schemas.dashboard import DashboardSummaryResponse
from app.services.dashboard_service import get_dashboard_summary


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get(
    "/summary",
    response_model=DashboardSummaryResponse
)
def get_dashboard_summary_route(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    return get_dashboard_summary(
        db,
        current_user_id
    )