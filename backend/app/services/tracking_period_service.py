from datetime import date

from sqlalchemy.orm import Session

from app.models import TrackingPeriod, User
from app.schemas.tracking_period import TrackingPeriodCreate


def create_tracking_period(
    db: Session,
    period_data: TrackingPeriodCreate
) -> TrackingPeriod:

    # 1. Check user exists
    user = (
        db.query(User)
        .filter(User.id == period_data.user_id)
        .first()
    )

    if not user:
        raise ValueError("User not found")

    # 2. Validate dates
    if period_data.start_date >= period_data.end_date:
        raise ValueError(
            "Start date must be before end date"
        )

    # 3. Check for an existing active period
    existing_active_period = (
        db.query(TrackingPeriod)
        .filter(
            TrackingPeriod.user_id == period_data.user_id,
            TrackingPeriod.is_active == True
        )
        .first()
    )

    if existing_active_period:
        raise ValueError(
            "User already has an active tracking period"
        )

    # 4. Create tracking period
    period = TrackingPeriod(
        user_id=period_data.user_id,
        name=period_data.name,
        start_date=period_data.start_date,
        end_date=period_data.end_date,
        is_active=True,
    )

    db.add(period)
    db.commit()
    db.refresh(period)

    return period

def get_tracking_periods(
    db: Session,
    user_id: int
) -> list[TrackingPeriod]:

    return (
        db.query(TrackingPeriod)
        .filter(TrackingPeriod.user_id == user_id)
        .order_by(TrackingPeriod.start_date.desc())
        .all()
    )

def get_tracking_period(
    db: Session,
    period_id: int
) -> TrackingPeriod | None:

    return (
        db.query(TrackingPeriod)
        .filter(TrackingPeriod.id == period_id)
        .first()
    )