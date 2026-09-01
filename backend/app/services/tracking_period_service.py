from sqlalchemy.orm import Session

from app.models import TrackingPeriod, User

from app.schemas.tracking_period import (
    TrackingPeriodCreate,
    TrackingPeriodUpdate,
)


# ==========================================
# CREATE TRACKING PERIOD
# ==========================================

def create_tracking_period(
    db: Session,
    period_data: TrackingPeriodCreate,
    user_id: int
) -> TrackingPeriod:

    # ==========================================
    # 1. CHECK USER EXISTS
    # ==========================================

    user = (
        db.query(User)
        .filter(
            User.id == user_id
        )
        .first()
    )

    if not user:

        raise ValueError(
            "User not found"
        )


    # ==========================================
    # 2. VALIDATE DATES
    # ==========================================

    if (
        period_data.start_date >=
        period_data.end_date
    ):

        raise ValueError(
            "Start date must be before end date"
        )


    # ==========================================
    # 3. CHECK EXISTING ACTIVE PERIOD
    # ==========================================

    existing_active_period = (
        db.query(TrackingPeriod)
        .filter(
            TrackingPeriod.user_id == user_id,
            TrackingPeriod.is_active.is_(True)
        )
        .first()
    )

    if existing_active_period:

        raise ValueError(
            "User already has an active tracking period"
        )


    # ==========================================
    # 4. CREATE TRACKING PERIOD
    # ==========================================

    period = TrackingPeriod(

        user_id=user_id,

        name=period_data.name,

        start_date=period_data.start_date,

        end_date=period_data.end_date,

        is_active=True,

    )


    db.add(period)

    db.commit()

    db.refresh(period)


    return period


# ==========================================
# GET ALL USER TRACKING PERIODS
# ==========================================

def get_tracking_periods(
    db: Session,
    user_id: int
) -> list[TrackingPeriod]:

    return (
        db.query(TrackingPeriod)
        .filter(
            TrackingPeriod.user_id == user_id
        )
        .order_by(
            TrackingPeriod.start_date.desc()
        )
        .all()
    )


# ==========================================
# GET SINGLE TRACKING PERIOD
# ==========================================

def get_tracking_period(
    db: Session,
    period_id: int
) -> TrackingPeriod | None:

    return (
        db.query(TrackingPeriod)
        .filter(
            TrackingPeriod.id == period_id
        )
        .first()
    )


# ==========================================
# UPDATE TRACKING PERIOD
# ==========================================

def update_tracking_period(
    db: Session,
    period_id: int,
    user_id: int,
    period_data: TrackingPeriodUpdate
) -> TrackingPeriod:

    # ==========================================
    # 1. FIND PERIOD + CHECK OWNERSHIP
    # ==========================================

    period = (
        db.query(TrackingPeriod)
        .filter(
            TrackingPeriod.id == period_id,
            TrackingPeriod.user_id == user_id
        )
        .first()
    )

    if not period:

        raise ValueError(
            "Tracking period not found"
        )


    # ==========================================
    # 2. VALIDATE DATES
    # ==========================================

    if (
        period_data.start_date >=
        period_data.end_date
    ):

        raise ValueError(
            "Start date must be before end date"
        )


    # ==========================================
    # 3. UPDATE FIELDS
    # ==========================================

    period.name = (
        period_data.name
    )

    period.start_date = (
        period_data.start_date
    )

    period.end_date = (
        period_data.end_date
    )


    # ==========================================
    # 4. SAVE
    # ==========================================

    db.commit()

    db.refresh(period)


    return period


# ==========================================
# UPDATE ACTIVE STATUS
# ==========================================

def update_tracking_period_status(
    db: Session,
    period_id: int,
    user_id: int,
    is_active: bool
) -> TrackingPeriod:

    # ==========================================
    # 1. FIND PERIOD + CHECK OWNERSHIP
    # ==========================================

    period = (
        db.query(TrackingPeriod)
        .filter(
            TrackingPeriod.id == period_id,
            TrackingPeriod.user_id == user_id
        )
        .first()
    )

    if not period:

        raise ValueError(
            "Tracking period not found"
        )


    # ==========================================
    # 2. ACTIVATING PERIOD
    # ==========================================

    if is_active:

        existing_active_period = (
            db.query(TrackingPeriod)
            .filter(
                TrackingPeriod.user_id == user_id,
                TrackingPeriod.is_active.is_(True),
                TrackingPeriod.id != period_id
            )
            .first()
        )


        # ----------------------------------------
        # DEACTIVATE OLD ACTIVE PERIOD
        # ----------------------------------------

        if existing_active_period:

            existing_active_period.is_active = False


    # ==========================================
    # 3. UPDATE REQUESTED PERIOD
    # ==========================================

    period.is_active = is_active


    # ==========================================
    # 4. SAVE
    # ==========================================

    db.commit()

    db.refresh(period)


    return period