from sqlalchemy.orm import Session

from app.models import Habit, TrackingPeriod, User
from app.schemas.habit import (
    HabitCreate,
    HabitUpdate,
)

def create_habit(
    db: Session,
    habit_data: HabitCreate,
    user_id: int
) -> Habit:

    # 1. Check user exists
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise ValueError("User not found")

    # 2. Check tracking period exists
    period = (
        db.query(TrackingPeriod)
        .filter(
            TrackingPeriod.id == habit_data.tracking_period_id
        )
        .first()
    )

    if not period:
        raise ValueError("Tracking period not found")

    # 3. Make sure the period belongs to the logged-in user
    if period.user_id != user_id:
        raise ValueError(
            "Tracking period does not belong to this user"
        )

    # 4. Validate habit dates
    if habit_data.end_date is not None:
        if habit_data.start_date >= habit_data.end_date:
            raise ValueError(
                "Habit start date must be before end date"
            )

    # 5. Make sure habit dates are inside tracking period
    if habit_data.start_date < period.start_date:
        raise ValueError(
            "Habit start date cannot be before tracking period"
        )

    if habit_data.end_date is not None:
        if habit_data.end_date > period.end_date:
            raise ValueError(
                "Habit end date cannot be after tracking period"
            )

    # 6. Create habit
    habit = Habit(
        user_id=user_id,
        tracking_period_id=habit_data.tracking_period_id,
        name=habit_data.name,
        description=habit_data.description,
        start_date=habit_data.start_date,
        end_date=habit_data.end_date,
        is_active=True,
    )

    db.add(habit)
    db.commit()
    db.refresh(habit)

    return habit

def get_user_habits(
    db: Session,
    user_id: int
) -> list[Habit]:

    return (
        db.query(Habit)
        .filter(Habit.user_id == user_id)
        .order_by(Habit.start_date.asc())
        .all()
    )


def get_period_habits(
    db: Session,
    tracking_period_id: int,
    user_id: int
) -> list[Habit]:

    # Check that the tracking period exists
    period = (
        db.query(TrackingPeriod)
        .filter(
            TrackingPeriod.id == tracking_period_id
        )
        .first()
    )

    if not period:
        raise ValueError("Tracking period not found")

    # Check ownership
    if period.user_id != user_id:
        raise ValueError(
            "You do not have access to this tracking period"
        )

    # Return only this user's habits
    return (
        db.query(Habit)
        .filter(
            Habit.tracking_period_id == tracking_period_id,
            Habit.user_id == user_id
        )
        .order_by(Habit.start_date.asc())
        .all()
    )

def update_habit(
    db: Session,
    habit_id: int,
    user_id: int,
    habit_data: HabitUpdate
) -> Habit:

    # 1. Find the habit
    habit = (
        db.query(Habit)
        .filter(
            Habit.id == habit_id,
            Habit.user_id == user_id
        )
        .first()
    )

    if not habit:
        raise ValueError(
            "Habit not found"
        )

    # 2. Check tracking period
    period = (
        db.query(TrackingPeriod)
        .filter(
            TrackingPeriod.id ==
            habit_data.tracking_period_id
        )
        .first()
    )

    if not period:
        raise ValueError(
            "Tracking period not found"
        )

    # 3. Make sure the period belongs
    #    to the authenticated user
    if period.user_id != user_id:
        raise ValueError(
            "Tracking period does not belong to this user"
        )

    # 4. Validate habit dates
    if habit_data.end_date is not None:

        if (
            habit_data.start_date >=
            habit_data.end_date
        ):
            raise ValueError(
                "Habit start date must be before end date"
            )

    # 5. Habit must stay inside
    #    the tracking period

    if (
        habit_data.start_date <
        period.start_date
    ):
        raise ValueError(
            "Habit start date cannot be before tracking period"
        )

    if habit_data.end_date is not None:

        if (
            habit_data.end_date >
            period.end_date
        ):
            raise ValueError(
                "Habit end date cannot be after tracking period"
            )

    # 6. Update habit

    # 6. Update habit

    habit.tracking_period_id = (
        habit_data.tracking_period_id
    )

    habit.name = habit_data.name
    habit.description = habit_data.description

    habit.start_date = (
        habit_data.start_date
    )

    habit.end_date = (
        habit_data.end_date
    )

    habit.is_active = (
        habit_data.is_active
    )

    # 7. Save

    db.commit()
    db.refresh(habit)

    return habit