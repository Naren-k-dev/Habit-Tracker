from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class TrackingPeriod(Base):
    __tablename__ = "tracking_periods"

    # ==========================================
    # ID
    # ==========================================

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True
    )

    # ==========================================
    # USER
    # ==========================================

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    # ==========================================
    # PERIOD INFORMATION
    # ==========================================

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    start_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    end_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    # ==========================================
    # STATUS
    # ==========================================

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    # ==========================================
    # CREATED
    # ==========================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    # ==========================================
    # RELATIONSHIPS
    # ==========================================

    user: Mapped["User"] = relationship(
        back_populates="tracking_periods"
    )

    habits: Mapped[list["Habit"]] = relationship(
        back_populates="tracking_period"
    )

    daily_tasks: Mapped[list["DailyTask"]] = relationship(
        back_populates="tracking_period"
    )