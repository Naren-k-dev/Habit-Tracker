from datetime import date

from app.core.database import SessionLocal
from app.schemas.tracking_period import TrackingPeriodCreate
from app.services.tracking_period_service import create_tracking_period


def test_create_tracking_period():
    db = SessionLocal()

    try:
        # Use an existing user from our database
        period_data = TrackingPeriodCreate(
            user_id=7,
            name="Winter Arc",
            start_date=date(2026, 9, 1),
            end_date=date(2026, 12, 31),
        )

        period = create_tracking_period(
            db,
            period_data
        )

        print(f"Period created: {period.id}")
        print(f"Name: {period.name}")
        print(f"User ID: {period.user_id}")
        print(f"Start: {period.start_date}")
        print(f"End: {period.end_date}")
        print(f"Active: {period.is_active}")

    except Exception as e:
        db.rollback()
        print("Tracking period service test failed!")
        print(e)

    finally:
        db.close()


if __name__ == "__main__":
    test_create_tracking_period()