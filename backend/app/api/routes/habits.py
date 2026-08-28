from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import get_current_user

from app.schemas.habit import (
    HabitCreate,
    HabitUpdate,
    HabitResponse,
)

from app.services.habit_service import (
    create_habit,
    get_user_habits,
    get_period_habits,
    update_habit,
)



router = APIRouter(
    prefix="/habits",
    tags=["Habits"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post(
    "",
    response_model=HabitResponse,
    status_code=201
)
def create_new_habit(
    habit_data: HabitCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    try:
        return create_habit(
            db,
            habit_data,
            current_user_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.get(
    "/me",
    response_model=list[HabitResponse]
)
def get_my_habits(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    return get_user_habits(
        db,
        current_user_id
    )


@router.get(
    "/period/{tracking_period_id}",
    response_model=list[HabitResponse]
)
def get_habits_by_period(
    tracking_period_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    try:
        return get_period_habits(
            db,
            tracking_period_id,
            current_user_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=403,
            detail=str(e)
        )

@router.patch(
    "/{habit_id}",
    response_model=HabitResponse
)
def update_existing_habit(
    habit_id: int,
    habit_data: HabitUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    try:
        return update_habit(
            db,
            habit_id,
            current_user_id,
            habit_data
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )