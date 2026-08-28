from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class HabitCompletion(Base):
    __tablename__ = "habit_completions"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True
    )

    habit_id: Mapped[int] = mapped_column(
        ForeignKey("habits.id"),
        nullable=False,
        index=True
    )

    completion_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )

    __table_args__ = (
        UniqueConstraint(
            "habit_id",
            "completion_date",
            name="uq_habit_completion_date"
        ),
    )
    
    habit: Mapped["Habit"] = relationship(
        back_populates="completions"
    )