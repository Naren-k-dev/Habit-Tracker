from datetime import date, datetime

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    String,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.core.database import Base


class DailyTask(Base):
    __tablename__ = "daily_tasks"

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
    # TRACKING PERIOD
    # ==========================================

    tracking_period_id: Mapped[int] = mapped_column(
        ForeignKey("tracking_periods.id"),
        nullable=False,
        index=True
    )

    # ==========================================
    # TASK INFORMATION
    # ==========================================

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )

    # ==========================================
    # DATE
    # ==========================================

    task_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True
    )

    due_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True
    )

    # ==========================================
    # PRIORITY
    # ==========================================

    priority: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="medium"
    )

    # ==========================================
    # CATEGORY
    # ==========================================

    category: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="Other"
    )

    # ==========================================
    # COMPLETION
    # ==========================================

    completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
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
        back_populates="daily_tasks"
    )

    tracking_period: Mapped["TrackingPeriod"] = relationship(
        back_populates="daily_tasks"
    )