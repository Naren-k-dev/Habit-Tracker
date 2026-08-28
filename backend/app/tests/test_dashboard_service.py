from datetime import date

from app.core.database import SessionLocal
from app.services.dashboard_service import get_dashboard_summary


def test_dashboard_summary():

    db = SessionLocal()

    try:

        result = get_dashboard_summary(
            db,
            user_id=7,
            target_date=date(2026, 9, 1)
        )

        print("\nDashboard Summary")
        print("----------------------")

        print(f"Date: {result['date']}")
        print(f"Total habits: {result['total_habits']}")
        print(f"Completed: {result['completed_habits']}")
        print(f"Missed: {result['missed_habits']}")
        print(f"Pending: {result['pending_habits']}")
        print(f"Daily progress: {result['daily_progress']}%")
        print(f"Current streak: {result['current_streak']}")
        print(f"Longest streak: {result['longest_streak']}")

    except Exception as e:

        print("\nDashboard service test failed!")
        print(e)

    finally:
        db.close()


if __name__ == "__main__":
    test_dashboard_summary()