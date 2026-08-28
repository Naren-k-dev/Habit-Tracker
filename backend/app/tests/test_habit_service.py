from datetime import date

from app.core.database import SessionLocal
from app.models import User
from app.schemas.habit import HabitCreate
from app.services.habit_service import create_habit


def test_habit_service():
    db = SessionLocal()

    try:
        # ---------------------------------
        # TEST 1: Create valid habit
        # ---------------------------------

        valid_habit_data = HabitCreate(
            user_id=7,
            tracking_period_id=5,
            name="DSA Practice",
            description="Solve 3 problems",
            start_date=date(2026, 9, 1),
            end_date=date(2026, 12, 31),
        )

        habit = create_habit(
            db,
            valid_habit_data
        )

        print("\nValid habit created successfully!")
        print(f"Habit ID: {habit.id}")
        print(f"Name: {habit.name}")

        # ---------------------------------
        # TEST 2: Ownership validation
        # ---------------------------------

        second_user = User(
            name="Ownership Test User",
            email="ownership-test@habittracker.com",
            password_hash="test_password_hash"
        )

        db.add(second_user)
        db.commit()
        db.refresh(second_user)

        print(f"\nSecond user created: {second_user.id}")

        invalid_habit_data = HabitCreate(
            user_id=second_user.id,
            tracking_period_id=5,
            name="Invalid Habit",
            description="Should fail",
            start_date=date(2026, 9, 1),
            end_date=date(2026, 12, 31),
        )

        try:
            create_habit(
                db,
                invalid_habit_data
            )

            print("ERROR: Ownership validation failed!")

        except ValueError as e:
            print(f"Ownership validation passed: {e}")

    except Exception as e:
        db.rollback()
        print("\nHabit service test failed!")
        print(e)

    finally:
        db.close()


if __name__ == "__main__":
    test_habit_service()