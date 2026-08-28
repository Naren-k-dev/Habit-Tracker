from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import get_current_user

from app.schemas.tracking_period import (
    TrackingPeriodCreate,
    TrackingPeriodResponse,
)

from app.services.tracking_period_service import (
    create_tracking_period,
    get_tracking_periods,
    get_tracking_period,
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
        # Never trust user_id coming from the client.
        period_data.user_id = current_user_id

        return create_tracking_period(
            db,
            period_data
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


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