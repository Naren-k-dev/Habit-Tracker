from datetime import datetime, date

from sqlalchemy.orm import Session

from app.models import Habit, HabitCompletion
from app.schemas.habit_completion import HabitCompletionCreate


def create_or_update_completion(
    db: Session,
    completion_data: HabitCompletionCreate,
    user_id: int
) -> HabitCompletion:

    # 1. Check whether the habit exists
    habit = (
        db.query(Habit)
        .filter(Habit.id == completion_data.habit_id)
        .first()
    )

    if not habit:
        raise ValueError("Habit not found")

    # 2. Check whether the habit belongs to the logged-in user
    if habit.user_id != user_id:
        raise ValueError(
            "You do not have access to this habit"
        )

    # 3. Check whether completion date is valid
    if completion_data.completion_date < habit.start_date:
        raise ValueError(
            "Completion date cannot be before habit start date"
        )

    if (
        habit.end_date is not None
        and completion_data.completion_date > habit.end_date
    ):
        raise ValueError(
            "Completion date cannot be after habit end date"
        )

    # 4. Check if completion already exists
    completion = (
        db.query(HabitCompletion)
        .filter(
            HabitCompletion.habit_id == completion_data.habit_id,
            HabitCompletion.completion_date
            == completion_data.completion_date
        )
        .first()
    )

    # 5. Create new completion
    if not completion:

        completion = HabitCompletion(
            habit_id=completion_data.habit_id,
            completion_date=completion_data.completion_date,
            completed=completion_data.completed,
            completed_at=(
                datetime.utcnow()
                if completion_data.completed
                else None
            ),
        )

        db.add(completion)

    # 6. Update existing completion
    else:

        completion.completed = completion_data.completed

        completion.completed_at = (
            datetime.utcnow()
            if completion_data.completed
            else None
        )

    # 7. Save changes
    db.commit()
    db.refresh(completion)

    return completion


def get_habit_completions(
    db: Session,
    habit_id: int,
    user_id: int
) -> list[HabitCompletion]:

    # Check whether habit exists
    habit = (
        db.query(Habit)
        .filter(Habit.id == habit_id)
        .first()
    )

    if not habit:
        raise ValueError("Habit not found")

    # Check ownership
    if habit.user_id != user_id:
        raise ValueError(
            "You do not have access to this habit"
        )

    return (
        db.query(HabitCompletion)
        .filter(
            HabitCompletion.habit_id == habit_id
        )
        .order_by(
            HabitCompletion.completion_date.asc()
        )
        .all()
    )


def get_completions_by_date(
    db: Session,
    completion_date: date,
    user_id: int
) -> list[HabitCompletion]:

    return (
        db.query(HabitCompletion)
        .join(
            Habit,
            Habit.id == HabitCompletion.habit_id
        )
        .filter(
            HabitCompletion.completion_date == completion_date,
            Habit.user_id == user_id
        )
        .order_by(
            HabitCompletion.habit_id.asc()
        )
        .all()
    )


def get_period_completions(
    db: Session,
    tracking_period_id: int,
    user_id: int
) -> list[HabitCompletion]:

    # Check whether the tracking period belongs
    # to the logged-in user
    from app.models import TrackingPeriod

    period = (
        db.query(TrackingPeriod)
        .filter(
            TrackingPeriod.id == tracking_period_id
        )
        .first()
    )

    if not period:
        raise ValueError(
            "Tracking period not found"
        )

    if period.user_id != user_id:
        raise ValueError(
            "You do not have access to this tracking period"
        )

    return (
        db.query(HabitCompletion)
        .join(
            Habit,
            Habit.id == HabitCompletion.habit_id
        )
        .filter(
            Habit.tracking_period_id == tracking_period_id,
            Habit.user_id == user_id
        )
        .order_by(
            HabitCompletion.completion_date.asc(),
            HabitCompletion.habit_id.asc()
        )
        .all()
    )