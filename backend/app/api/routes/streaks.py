from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import get_current_user

from app.services.streak_service import get_overall_streak


router = APIRouter(
    prefix="/streaks",
    tags=["Streaks"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("/overall")
def get_overall_streak_route(
    end_date: date,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    return get_overall_streak(
        db,
        current_user_id,
        end_date
    )