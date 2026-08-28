from datetime import date, datetime

from sqlalchemy import String, Date, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Habit(Base):
    __tablename__ = "habits"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    tracking_period_id: Mapped[int] = mapped_column(
        ForeignKey("tracking_periods.id"),
        nullable=False,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    start_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    end_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    # Relationship with User
    user: Mapped["User"] = relationship(
        back_populates="habits"
    )

    # Relationship with TrackingPeriod
    tracking_period: Mapped["TrackingPeriod"] = relationship(
        back_populates="habits"
    )

    # Relationship with HabitCompletion
    completions: Mapped[list["HabitCompletion"]] = relationship(
        back_populates="habit",
        cascade="all, delete-orphan"
    )