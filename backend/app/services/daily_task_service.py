from datetime import date, datetime

from sqlalchemy.orm import Session

from app.models import DailyTask, TrackingPeriod
from app.schemas.daily_task import (
    DailyTaskCreate,
    DailyTaskUpdate,
)


# ==========================================
# VALIDATE TRACKING PERIOD
# ==========================================

def validate_tracking_period(
    db: Session,
    user_id: int,
    tracking_period_id: int,
) -> TrackingPeriod:

    period = (
        db.query(TrackingPeriod)
        .filter(
            TrackingPeriod.id == tracking_period_id,
            TrackingPeriod.user_id == user_id,
        )
        .first()
    )

    if not period:
        raise ValueError(
            "Tracking period not found"
        )

    return period


# ==========================================
# CREATE TASK
# ==========================================

def create_daily_task(
    db: Session,
    user_id: int,
    task_data: DailyTaskCreate,
) -> DailyTask:

    period = validate_tracking_period(
        db,
        user_id,
        task_data.tracking_period_id,
    )

    # ==========================================
    # VALIDATE TASK DATE
    # ==========================================

    if task_data.task_date < period.start_date:

        raise ValueError(
            "Task date cannot be before the tracking period starts"
        )

    if task_data.task_date > period.end_date:

        raise ValueError(
            "Task date cannot be after the tracking period ends"
        )

    # ==========================================
    # VALIDATE DUE DATE
    # ==========================================

    if (
        task_data.due_date is not None
        and task_data.due_date < task_data.task_date
    ):

        raise ValueError(
            "Due date cannot be before the task date"
        )

    # ==========================================
    # CREATE TASK
    # ==========================================

    task = DailyTask(
        user_id=user_id,
        tracking_period_id=task_data.tracking_period_id,
        title=task_data.title,
        description=task_data.description,
        task_date=task_data.task_date,
        due_date=task_data.due_date,
        priority=task_data.priority,
        category=task_data.category,
        completed=False,
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


# ==========================================
# GET TASKS BY DATE
# ==========================================

def get_daily_tasks(
    db: Session,
    user_id: int,
    task_date: date,
) -> list[DailyTask]:

    return (
        db.query(DailyTask)
        .filter(
            DailyTask.user_id == user_id,
            DailyTask.task_date == task_date,
        )
        .order_by(
            DailyTask.completed.asc(),
            DailyTask.priority.desc(),
            DailyTask.created_at.asc(),
        )
        .all()
    )


# ==========================================
# GET SINGLE TASK
# ==========================================

def get_daily_task(
    db: Session,
    user_id: int,
    task_id: int,
) -> DailyTask | None:

    return (
        db.query(DailyTask)
        .filter(
            DailyTask.id == task_id,
            DailyTask.user_id == user_id,
        )
        .first()
    )


# ==========================================
# UPDATE TASK
# ==========================================

def update_daily_task(
    db: Session,
    user_id: int,
    task_id: int,
    task_data: DailyTaskUpdate,
) -> DailyTask:

    task = get_daily_task(
        db,
        user_id,
        task_id,
    )

    if not task:
        raise ValueError(
            "Task not found"
        )

    # ==========================================
    # BUILD UPDATED VALUES
    # ==========================================

    new_task_date = (
        task_data.task_date
        if task_data.task_date is not None
        else task.task_date
    )

    new_due_date = (
        task_data.due_date
        if task_data.due_date is not None
        else task.due_date
    )

    # ==========================================
    # VALIDATE TRACKING PERIOD
    # ==========================================

    period = validate_tracking_period(
        db,
        user_id,
        task.tracking_period_id,
    )

    if new_task_date < period.start_date:

        raise ValueError(
            "Task date cannot be before the tracking period starts"
        )

    if new_task_date > period.end_date:

        raise ValueError(
            "Task date cannot be after the tracking period ends"
        )

    # ==========================================
    # VALIDATE DUE DATE
    # ==========================================

    if (
        new_due_date is not None
        and new_due_date < new_task_date
    ):

        raise ValueError(
            "Due date cannot be before the task date"
        )

    # ==========================================
    # APPLY UPDATES
    # ==========================================

    if task_data.title is not None:
        task.title = task_data.title

    if task_data.description is not None:
        task.description = task_data.description

    if task_data.task_date is not None:
        task.task_date = task_data.task_date

    if task_data.due_date is not None:
        task.due_date = task_data.due_date

    if task_data.priority is not None:
        task.priority = task_data.priority

    if task_data.category is not None:
        task.category = task_data.category

    # ==========================================
    # COMPLETION
    # ==========================================

    if task_data.completed is not None:

        task.completed = task_data.completed

        if task_data.completed:

            if task.completed_at is None:
                task.completed_at = datetime.utcnow()

        else:

            task.completed_at = None

    db.commit()
    db.refresh(task)

    return task


# ==========================================
# COMPLETE / UNCOMPLETE TASK
# ==========================================

def set_task_completion(
    db: Session,
    user_id: int,
    task_id: int,
    completed: bool,
) -> DailyTask:

    task = get_daily_task(
        db,
        user_id,
        task_id,
    )

    if not task:
        raise ValueError(
            "Task not found"
        )

    task.completed = completed

    if completed:

        task.completed_at = datetime.utcnow()

    else:

        task.completed_at = None

    db.commit()
    db.refresh(task)

    return task


# ==========================================
# DELETE TASK
# ==========================================

def delete_daily_task(
    db: Session,
    user_id: int,
    task_id: int,
) -> None:

    task = get_daily_task(
        db,
        user_id,
        task_id,
    )

    if not task:
        raise ValueError(
            "Task not found"
        )

    db.delete(task)
    db.commit()