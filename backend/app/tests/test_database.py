from datetime import date

from app.core.database import SessionLocal
from app.models import (
    User,
    TrackingPeriod,
    Habit,
    HabitCompletion,
    DailyTask,
)


def test_database():
    db = SessionLocal()

    try:
        # 1. Create user
        user = User(
            name="Test User",
            email="test@habicttracker.com",
            password_hash="test_password_hash",
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        print(f"User created: {user.id}")

        # 2. Create tracking period
        period = TrackingPeriod(
            user_id=user.id,
            name="Winter Arc",
            start_date=date(2026, 9, 1),
            end_date=date(2026, 12, 31),
        )

        db.add(period)
        db.commit()
        db.refresh(period)

        print(f"Tracking period created: {period.id}")

        # 3. Create habit
        habit = Habit(
    user_id=user.id,
    tracking_period_id=period.id,
    name="Workout",
    description="Daily workout",
    start_date=date(2026, 9, 1),
    end_date=date(2026, 12, 31),
)

        db.add(habit)
        db.commit()
        db.refresh(habit)

        print(f"Habit created: {habit.id}")

        # 4. Create completion
        completion = HabitCompletion(
            habit_id=habit.id,
            completion_date=date(2026, 9, 1),
            completed=True,
        )

        db.add(completion)
        db.commit()
        db.refresh(completion)

        print(f"Habit completion created: {completion.id}")

        # 5. Create daily task
        task = DailyTask(
            user_id=user.id,
            title="Complete DSA practice",
            description="Solve 3 problems",
            task_date=date(2026, 9, 1),
        )

        db.add(task)
        db.commit()
        db.refresh(task)

        print(f"Daily task created: {task.id}")

        print("\nDatabase test completed successfully!")

    except Exception as e:
        db.rollback()
        print("\nDatabase test failed!")
        print(e)

    finally:
        db.close()


if __name__ == "__main__":
    test_database()