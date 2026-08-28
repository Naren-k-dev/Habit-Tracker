from datetime import date

from app.core.database import SessionLocal
from app.schemas.habit_completion import HabitCompletionCreate
from app.services.habit_completion_service import (
    create_or_update_completion,
)


def test_habit_completion_service():
    db = SessionLocal()

    try:
        # -----------------------------
        # TEST 1: Create completion
        # -----------------------------

        completion_data = HabitCompletionCreate(
            habit_id=6,
            completion_date=date(2026, 9, 1),
            completed=True,
        )

        completion = create_or_update_completion(
            db,
            completion_data
        )

        print("\nCompletion created:")
        print(f"ID: {completion.id}")
        print(f"Habit ID: {completion.habit_id}")
        print(f"Date: {completion.completion_date}")
        print(f"Completed: {completion.completed}")
        print(f"Completed At: {completion.completed_at}")

        # -----------------------------
        # TEST 2: Update completion
        # -----------------------------

        update_data = HabitCompletionCreate(
            habit_id=6,
            completion_date=date(2026, 9, 1),
            completed=False,
        )

        updated = create_or_update_completion(
            db,
            update_data
        )

        print("\nCompletion updated:")
        print(f"ID: {updated.id}")
        print(f"Completed: {updated.completed}")
        print(f"Completed At: {updated.completed_at}")

    except Exception as e:
        db.rollback()
        print("\nHabit completion service test failed!")
        print(e)

    finally:
        db.close()


if __name__ == "__main__":
    test_habit_completion_service()