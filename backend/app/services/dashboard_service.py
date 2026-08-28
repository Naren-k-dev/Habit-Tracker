from datetime import date, timedelta

from sqlalchemy.orm import Session

from app.models import Habit, HabitCompletion, TrackingPeriod


def get_dashboard_summary(
    db: Session,
    user_id: int
):
    today = date.today()

    # ==========================================
    # ACTIVE TRACKING PERIOD
    # ==========================================

    period = (
        db.query(TrackingPeriod)
        .filter(
            TrackingPeriod.user_id == user_id,
            TrackingPeriod.is_active.is_(True)
        )
        .order_by(
            TrackingPeriod.start_date.desc()
        )
        .first()
    )

    # ==========================================
    # TODAY'S HABITS
    # ==========================================

    todays_habits = (
        db.query(Habit)
        .filter(
            Habit.user_id == user_id,
            Habit.is_active.is_(True),
            Habit.start_date <= today,
            (
                Habit.end_date.is_(None)
                | (Habit.end_date >= today)
            )
        )
        .all()
    )

    total_habits = len(todays_habits)

    completed_habits = 0

    for habit in todays_habits:

        completion = (
            db.query(HabitCompletion)
            .filter(
                HabitCompletion.habit_id == habit.id,
                HabitCompletion.completion_date == today,
                HabitCompletion.completed.is_(True)
            )
            .first()
        )

        if completion:
            completed_habits += 1

    if total_habits > 0:
        progress_percentage = round(
            (completed_habits / total_habits) * 100,
            2
        )
    else:
        progress_percentage = 0.0

    # ==========================================
    # CURRENT STREAK
    # ==========================================

    current_streak = calculate_current_streak(
        db,
        user_id,
        today
    )

    # ==========================================
    # PERIOD INFORMATION
    # ==========================================

    period_data = None

    if period:

        total_days = (
            period.end_date - period.start_date
        ).days + 1

        if today < period.start_date:

            current_day = 0

        elif today > period.end_date:

            current_day = total_days

        else:

            current_day = (
                today - period.start_date
            ).days + 1

        period_data = {
            "id": period.id,
            "name": period.name,
            "start_date": period.start_date,
            "end_date": period.end_date,
            "current_day": current_day,
            "total_days": total_days,
        }

    return {
        "today": {
            "date": today,
            "total_habits": total_habits,
            "completed_habits": completed_habits,
            "progress_percentage": progress_percentage,
        },
        "current_streak": current_streak,
        "period": period_data,
    }


def calculate_current_streak(
    db: Session,
    user_id: int,
    today: date
) -> int:

    # ==========================================
    # FIND THE MOST RECENT ACTIVE HABIT
    # ==========================================

    latest_habit = (
        db.query(Habit)
        .filter(
            Habit.user_id == user_id,
            Habit.is_active.is_(True)
        )
        .order_by(
            Habit.start_date.desc()
        )
        .first()
    )

    if not latest_habit:
        return 0

    # ==========================================
    # CHECK WHETHER TODAY IS FULLY COMPLETED
    # ==========================================

    today_habits = (
        db.query(Habit)
        .filter(
            Habit.user_id == user_id,
            Habit.is_active.is_(True),
            Habit.start_date <= today,
            (
                Habit.end_date.is_(None)
                | (Habit.end_date >= today)
            )
        )
        .all()
    )

    today_completed = True

    if today_habits:

        for habit in today_habits:

            completion = (
                db.query(HabitCompletion)
                .filter(
                    HabitCompletion.habit_id == habit.id,
                    HabitCompletion.completion_date == today,
                    HabitCompletion.completed.is_(True)
                )
                .first()
            )

            if not completion:
                today_completed = False
                break

    else:
        today_completed = False

    # ==========================================
    # DECIDE WHERE STREAK COUNTING STARTS
    # ==========================================

    if today_completed:
        check_date = today
    else:
        check_date = today - timedelta(days=1)

    streak = 0

    # ==========================================
    # WALK BACKWARD THROUGH COMPLETED DAYS
    # ==========================================

    while check_date >= latest_habit.start_date:

        habits = (
            db.query(Habit)
            .filter(
                Habit.user_id == user_id,
                Habit.is_active.is_(True),
                Habit.start_date <= check_date,
                (
                    Habit.end_date.is_(None)
                    | (Habit.end_date >= check_date)
                )
            )
            .all()
        )

        # No active habits on this date
        if not habits:
            break

        all_completed = True

        for habit in habits:

            completion = (
                db.query(HabitCompletion)
                .filter(
                    HabitCompletion.habit_id == habit.id,
                    HabitCompletion.completion_date == check_date,
                    HabitCompletion.completed.is_(True)
                )
                .first()
            )

            if not completion:
                all_completed = False
                break

        if not all_completed:
            break

        streak += 1

        check_date -= timedelta(days=1)

    return streak