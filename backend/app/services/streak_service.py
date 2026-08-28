from datetime import date, timedelta

from sqlalchemy.orm import Session

from app.models import Habit, HabitCompletion


def get_overall_streak(
    db: Session,
    user_id: int,
    end_date: date
) -> dict:

    # Get all dates from the user's active habits
    habits = (
        db.query(Habit)
        .filter(
            Habit.user_id == user_id,
            Habit.is_active.is_(True),
            Habit.start_date <= end_date,
        )
        .all()
    )

    if not habits:
        return {
            "current_streak": 0,
            "longest_streak": 0,
        }

    # Find the earliest applicable date
    start_date = min(habit.start_date for habit in habits)

    current_streak = 0
    longest_streak = 0
    running_streak = 0

    current_date = start_date

    while current_date <= end_date:

        applicable_habits = [
            habit
            for habit in habits
            if habit.start_date <= current_date
            and (
                habit.end_date is None
                or habit.end_date >= current_date
            )
        ]

        # No habits applicable on this day.
        if not applicable_habits:
            running_streak = 0
            current_date += timedelta(days=1)
            continue

        completed_count = (
            db.query(HabitCompletion)
            .join(Habit)
            .filter(
                Habit.user_id == user_id,
                HabitCompletion.completion_date == current_date,
                HabitCompletion.completed.is_(True),
                HabitCompletion.habit_id.in_(
                    [habit.id for habit in applicable_habits]
                ),
            )
            .count()
        )

        all_completed = (
            completed_count == len(applicable_habits)
        )

        if all_completed:
            running_streak += 1

            longest_streak = max(
                longest_streak,
                running_streak
            )
        else:
            running_streak = 0

        current_date += timedelta(days=1)

    # Calculate current streak backwards from end_date
    current_streak = 0
    check_date = end_date

    while check_date >= start_date:

        applicable_habits = [
            habit
            for habit in habits
            if habit.start_date <= check_date
            and (
                habit.end_date is None
                or habit.end_date >= check_date
            )
        ]

        if not applicable_habits:
            break

        completed_count = (
            db.query(HabitCompletion)
            .join(Habit)
            .filter(
                Habit.user_id == user_id,
                HabitCompletion.completion_date == check_date,
                HabitCompletion.completed.is_(True),
                HabitCompletion.habit_id.in_(
                    [habit.id for habit in applicable_habits]
                ),
            )
            .count()
        )

        if completed_count != len(applicable_habits):
            break

        current_streak += 1
        check_date -= timedelta(days=1)

    return {
        "current_streak": current_streak,
        "longest_streak": longest_streak,
    }