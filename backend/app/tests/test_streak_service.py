from datetime import date

from app.core.database import SessionLocal
from app.services.streak_service import get_overall_streak


def test_overall_streak():

    db = SessionLocal()

    try:

        result = get_overall_streak(
            db,
            user_id=7,
            end_date=date(2026, 9, 1),
        )

        print("\nStreak Test")
        print("----------------")
        print(
            f"Current streak: "
            f"{result['current_streak']}"
        )
        print(
            f"Longest streak: "
            f"{result['longest_streak']}"
        )

    except Exception as e:

        print("\nStreak service test failed!")
        print(e)

    finally:
        db.close()


if __name__ == "__main__":
    test_overall_streak()