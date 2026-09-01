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

# ==========================================
# MONTHLY PROGRESS
# ==========================================

# ==========================================
# MONTHLY PROGRESS
# ==========================================

def get_monthly_progress(
    db: Session,
    user_id: int,
    month_start: date
):
    # --------------------------------------
    # Find last day of the month
    # --------------------------------------

    if month_start.month == 12:
        next_month = date(
            month_start.year + 1,
            1,
            1
        )
    else:
        next_month = date(
            month_start.year,
            month_start.month + 1,
            1
        )

    month_end = (
        next_month -
        timedelta(days=1)
    )

    # --------------------------------------
    # Daily progress
    # --------------------------------------

    days = []

    total_habits = 0
    total_completed = 0
    total_missed = 0
    total_pending = 0

    current_date = month_start

    while current_date <= month_end:

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
    # Monthly percentage
    # --------------------------------------

    if total_habits > 0:

        progress_percentage = (
            total_completed /
            total_habits
        ) * 100

    else:

        progress_percentage = 0.0

    # --------------------------------------
    # Habit-wise monthly progress
    # --------------------------------------

    habits = (
        db.query(Habit)
        .filter(
            Habit.user_id == user_id,
            Habit.start_date <= month_end,
        )
        .order_by(Habit.id.asc())
        .all()
    )

    habit_progress = []

    for habit in habits:

        habit_total_days = 0
        completed_days = 0
        missed_days = 0
        pending_days = 0

        current_date = month_start

        while current_date <= month_end:

            # Check whether this habit
            # applies on this date
            if (
                habit.start_date <= current_date
                and (
                    habit.end_date is None
                    or habit.end_date >= current_date
                )
            ):

                habit_total_days += 1

                completion = (
                    db.query(HabitCompletion)
                    .filter(
                        HabitCompletion.habit_id == habit.id,
                        HabitCompletion.completion_date == current_date,
                    )
                    .first()
                )

                if (
                    completion
                    and completion.completed
                ):

                    completed_days += 1

                elif (
                    completion
                    and not completion.completed
                ):

                    missed_days += 1

                elif current_date < date.today():

                    missed_days += 1

                else:

                    pending_days += 1

            current_date += timedelta(
                days=1
            )

        # ----------------------------------
        # Habit percentage
        # ----------------------------------

        if habit_total_days > 0:

            habit_percentage = (
                completed_days /
                habit_total_days
            ) * 100

        else:

            habit_percentage = 0.0

        habit_progress.append(
            {
                "habit_id": habit.id,

                "habit_name": habit.name,

                "total_days":
                    habit_total_days,

                "completed_days":
                    completed_days,

                "missed_days":
                    missed_days,

                "pending_days":
                    pending_days,

                "progress_percentage":
                    round(
                        habit_percentage,
                        2
                    ),
            }
        )

    # --------------------------------------
    # Final response
    # --------------------------------------

    return {
        "month_start": month_start,

        "month_end": month_end,

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

        "days":
            days,

        "habit_progress":
            habit_progress,
    }
    # --------------------------------------
    # Monthly percentage
    # --------------------------------------

    if total_habits > 0:

        progress_percentage = (
            total_completed /
            total_habits
        ) * 100

    else:

        progress_percentage = 0.0

    return {
        "month_start": month_start,

        "month_end": month_end,

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