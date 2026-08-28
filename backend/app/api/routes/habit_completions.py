from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import get_current_user

from app.schemas.habit_completion import (
    HabitCompletionCreate,
    HabitCompletionResponse,
)

from app.services.habit_completion_service import (
    create_or_update_completion,
    get_habit_completions,
    get_completions_by_date,
    get_period_completions,
)


router = APIRouter(
    prefix="/habit-completions",
    tags=["Habit Completions"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post(
    "",
    response_model=HabitCompletionResponse,
    status_code=201
)
def create_or_update_habit_completion(
    completion_data: HabitCompletionCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    try:
        return create_or_update_completion(
            db,
            completion_data,
            current_user_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.get(
    "/habit/{habit_id}",
    response_model=list[HabitCompletionResponse]
)
def get_completions_for_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    try:
        return get_habit_completions(
            db,
            habit_id,
            current_user_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=403,
            detail=str(e)
        )


@router.get(
    "/date/{completion_date}",
    response_model=list[HabitCompletionResponse]
)
def get_completions_for_date(
    completion_date: date,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    return get_completions_by_date(
        db,
        completion_date,
        current_user_id
    )


@router.get(
    "/period/{tracking_period_id}",
    response_model=list[HabitCompletionResponse]
)
def get_completions_for_period(
    tracking_period_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    try:
        return get_period_completions(
            db,
            tracking_period_id,
            current_user_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=403,
            detail=str(e)
        )