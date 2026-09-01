from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import get_current_user

from app.schemas.daily_task import (
    DailyTaskCreate,
    DailyTaskResponse,
    DailyTaskUpdate,
)

from app.services.daily_task_service import (
    create_daily_task,
    get_daily_tasks,
    get_daily_task,
    update_daily_task,
    set_task_completion,
    delete_daily_task,
)


router = APIRouter(
    prefix="/tasks",
    tags=["Daily Tasks"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# ==========================================
# CREATE TASK
# ==========================================

@router.post(
    "",
    response_model=DailyTaskResponse,
    status_code=201
)
def create_task(
    task_data: DailyTaskCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    try:

        return create_daily_task(
            db,
            current_user_id,
            task_data,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# ==========================================
# GET TASKS BY DATE
# ==========================================

@router.get(
    "",
    response_model=list[DailyTaskResponse]
)
def get_tasks(
    task_date: date,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):

    return get_daily_tasks(
        db,
        current_user_id,
        task_date,
    )


# ==========================================
# GET SINGLE TASK
# ==========================================

@router.get(
    "/{task_id}",
    response_model=DailyTaskResponse
)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):

    task = get_daily_task(
        db,
        current_user_id,
        task_id,
    )

    if not task:

        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return task


# ==========================================
# UPDATE TASK
# ==========================================

@router.patch(
    "/{task_id}",
    response_model=DailyTaskResponse
)
def update_task(
    task_id: int,
    task_data: DailyTaskUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):

    try:

        return update_daily_task(
            db,
            current_user_id,
            task_id,
            task_data,
        )

    except ValueError as e:

        if str(e) == "Task not found":

            raise HTTPException(
                status_code=404,
                detail=str(e)
            )

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# ==========================================
# COMPLETE TASK
# ==========================================

@router.post(
    "/{task_id}/complete",
    response_model=DailyTaskResponse
)
def complete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):

    try:

        return set_task_completion(
            db,
            current_user_id,
            task_id,
            True,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


# ==========================================
# DELETE TASK
# ==========================================

@router.delete(
    "/{task_id}",
    status_code=204
)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):

    try:

        delete_daily_task(
            db,
            current_user_id,
            task_id,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )