from datetime import date, timedelta

from sqlalchemy.orm import Session

from app.models import Habit, HabitCompletion


# ==========================================
# DAILY PROGRESS
# ==========================================

def get_daily_progress(
    db: Session,
    user_id: int,
    target_date: date
):
    # Get habits applicable on this date
    habits = (
        db.query(Habit)
        .filter(
            Habit.user_id == user_id,
            Habit.start_date <= target_date,
            (
                (Habit.end_date.is_(None))
                | (Habit.end_date >= target_date)
            ),
            Habit.is_active.is_(True),
        )
        .order_by(Habit.id.asc())
        .all()
    )

    completed_habits = 0
    missed_habits = 0
    pending_habits = 0

    habit_progress = []

    for habit in habits:

        completion = (
            db.query(HabitCompletion)
            .filter(
                HabitCompletion.habit_id == habit.id,
                HabitCompletion.completion_date == target_date,
            )
            .first()
        )

        if completion and completion.completed:
            status = "completed"
            completed_habits += 1

        elif completion and not completion.completed:
            status = "missed"
            missed_habits += 1

        elif target_date < date.today():
            status = "missed"
            missed_habits += 1

        else:
            status = "pending"
            pending_habits += 1

        habit_progress.append(
            {
                "habit_id": habit.id,
                "habit_name": habit.name,
                "status": status,
            }
        )

    total_habits = len(habits)

    if total_habits > 0:
        progress_percentage = (
            completed_habits / total_habits
        ) * 100
    else:
        progress_percentage = 0.0

    return {
        "date": target_date,
        "total_habits": total_habits,
        "completed_habits": completed_habits,
        "missed_habits": missed_habits,
        "pending_habits": pending_habits,
        "progress_percentage": round(
            progress_percentage,
            2
        ),
        "habits": habit_progress,
    }


# ==========================================
# WEEKLY PROGRESS
# ==========================================

def get_weekly_progress(
    db: Session,
    user_id: int,
    week_start: date
):
    week_end = (
        week_start +
        timedelta(days=6)
    )

    days = []

    total_habits = 0
    total_completed = 0
    total_missed = 0
    total_pending = 0

    current_date = week_start

    for _ in range(7):

        daily_progress = get_daily_progress(
            db,
            user_id,
            current_date
        )

        days.append(
            {
                "date": current_date,

                "total_habits":
                    daily_progress[
                        "total_habits"
                    ],

                "completed_habits":
                    daily_progress[
                        "completed_habits"
                    ],

                "missed_habits":
                    daily_progress[
                        "missed_habits"
                    ],

                "pending_habits":
                    daily_progress[
                        "pending_habits"
                    ],

                "progress_percentage":
                    daily_progress[
                        "progress_percentage"
                    ],
            }
        )

        total_habits += (
            daily_progress[
                "total_habits"
            ]
        )

        total_completed += (
            daily_progress[
                "completed_habits"
            ]
        )

        total_missed += (
            daily_progress[
                "missed_habits"
            ]
        )

        total_pending += (
            daily_progress[
                "pending_habits"
            ]
        )

        current_date += timedelta(
            days=1
        )

    # --------------------------------------
    # Weekly percentage
    # --------------------------------------

    if total_habits > 0:

        progress_percentage = (
            total_completed /
            total_habits
        ) * 100

    else:

        progress_percentage = 0.0

    return {
        "week_start": week_start,

        "week_end": week_end,

        "total_habits":
            total_habits,

        "total_completed":
            total_completed,

        "total_missed":
            total_missed,

        "total_pending":
            total_pending,

        "progress_percentage":
            round(
                progress_percentage,
                2
            ),

        "days": days,
    }