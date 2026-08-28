from datetime import date

from app.core.database import SessionLocal
from app.services.progress_service import get_daily_progress


def test_daily_progress():
    db = SessionLocal()

    try:
        result = get_daily_progress(
            db,
            user_id=7,
            target_date=date(2026, 9, 1),
        )

        print("\nDaily Progress")
        print("----------------")
        print(f"Date: {result['date']}")
        print(f"Total habits: {result['total_habits']}")
        print(f"Completed: {result['completed_habits']}")
        print(f"Missed: {result['missed_habits']}")
        print(f"Pending: {result['pending_habits']}")
        print(f"Progress: {result['progress_percentage']}%")

        print("\nHabit details:")

        for habit in result["habits"]:
            print(
                f"{habit['habit_id']} - "
                f"{habit['habit_name']} → "
                f"{habit['status']}"
            )

    except Exception as e:
        print("\nProgress service test failed!")
        print(e)

    finally:
        db.close()


if __name__ == "__main__":
    test_daily_progress()