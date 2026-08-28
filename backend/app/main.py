from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine

from app.api.routes.auth import router as auth_router
from app.api.routes.users import router as users_router
from app.api.routes.tracking_periods import (
    router as tracking_periods_router
)
from app.api.routes.habits import router as habits_router
from app.api.routes.habit_completions import (
    router as habit_completions_router
)
from app.api.routes.progress import router as progress_router
from app.api.routes.streaks import router as streak_router
from app.api.routes.dashboard import (
    router as dashboard_router
)

from app.models import (
    User,
    TrackingPeriod,
    Habit,
    HabitCompletion,
    DailyTask,
)


app = FastAPI(
    title="Habit Tracker API",
    version="1.0.0"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# DATABASE
# ==========================================

@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)


# ==========================================
# ROOT
# ==========================================

@app.get("/")
def root():
    return {
        "message": "Habit Tracker API is running",
        "status": "ok"
    }


# ==========================================
# AUTHENTICATION
# ==========================================

app.include_router(
    auth_router,
    prefix="/api"
)


# ==========================================
# USERS
# ==========================================

app.include_router(
    users_router,
    prefix="/api"
)


# ==========================================
# TRACKING PERIODS
# ==========================================

app.include_router(
    tracking_periods_router,
    prefix="/api"
)


# ==========================================
# HABITS
# ==========================================

app.include_router(
    habits_router,
    prefix="/api"
)


# ==========================================
# HABIT COMPLETIONS
# ==========================================

app.include_router(
    habit_completions_router,
    prefix="/api"
)


# ==========================================
# PROGRESS
# ==========================================

app.include_router(
    progress_router,
    prefix="/api"
)


# ==========================================
# STREAKS
# ==========================================

app.include_router(
    streak_router,
    prefix="/api"
)

# ==========================================
# DASHBOARD
# ==========================================

app.include_router(
    dashboard_router,
    prefix="/api"
)