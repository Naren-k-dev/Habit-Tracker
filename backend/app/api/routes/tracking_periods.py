from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import get_current_user

from app.schemas.tracking_period import (
    TrackingPeriodCreate,
    TrackingPeriodUpdate,
    TrackingPeriodResponse,
)

from app.services.tracking_period_service import (
    create_tracking_period,
    get_tracking_periods,
    get_tracking_period,
    update_tracking_period,
    update_tracking_period_status,
)


router = APIRouter(
    prefix="/tracking-periods",
    tags=["Tracking Periods"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# ==========================================
# CREATE TRACKING PERIOD
# ==========================================

@router.post(
    "",
    response_model=TrackingPeriodResponse,
    status_code=201
)
def create_period(
    period_data: TrackingPeriodCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    try:

        return create_tracking_period(
            db,
            period_data,
            current_user_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# ==========================================
# GET ALL USER TRACKING PERIODS
# ==========================================

@router.get(
    "",
    response_model=list[TrackingPeriodResponse]
)
def get_my_tracking_periods(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    return get_tracking_periods(
        db,
        current_user_id
    )


# ==========================================
# GET SINGLE TRACKING PERIOD
# ==========================================

@router.get(
    "/{period_id}",
    response_model=TrackingPeriodResponse
)
def get_period(
    period_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    period = get_tracking_period(
        db,
        period_id
    )

    if not period:

        raise HTTPException(
            status_code=404,
            detail="Tracking period not found"
        )

    # Ownership check
    if period.user_id != current_user_id:

        raise HTTPException(
            status_code=403,
            detail="You do not have access to this tracking period"
        )

    return period


# ==========================================
# UPDATE TRACKING PERIOD
# ==========================================

@router.patch(
    "/{period_id}",
    response_model=TrackingPeriodResponse
)
def update_period(
    period_id: int,
    period_data: TrackingPeriodUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    try:

        return update_tracking_period(
            db,
            period_id,
            current_user_id,
            period_data
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


# ==========================================
# ACTIVATE / DEACTIVATE TRACKING PERIOD
# ==========================================

@router.patch(
    "/{period_id}/status",
    response_model=TrackingPeriodResponse
)
def update_period_status(
    period_id: int,
    is_active: bool,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user),
):
    try:

        return update_tracking_period_status(
            db,
            period_id,
            current_user_id,
            is_active
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )