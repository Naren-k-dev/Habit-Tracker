import os

from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine

from app.api.routes import (
    auth,
    habits,
    habit_completions,
    daily_tasks,
    progress,
    tracking_periods,
    streaks,
    dashboard,
)


# ==========================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================

load_dotenv()


# ==========================================
# CREATE APPLICATION
# ==========================================

app = FastAPI(
    title="HabitFlow API",
    version="1.0.0",
)


# ==========================================
# DATABASE TABLES
# ==========================================

Base.metadata.create_all(
    bind=engine
)


# ==========================================
# CORS
# ==========================================

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173",
)


app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        FRONTEND_URL
    ],

    allow_credentials=True,

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ],
)


# ==========================================
# ROUTERS
# ==========================================

app.include_router(
    auth.router,
    prefix="/api",
)

app.include_router(
    habits.router,
    prefix="/api",
)

app.include_router(
    habit_completions.router,
    prefix="/api",
)

app.include_router(
    daily_tasks.router,
    prefix="/api",
)

app.include_router(
    progress.router,
    prefix="/api",
)

app.include_router(
    tracking_periods.router,
    prefix="/api",
)

app.include_router(
    dashboard.router,
    prefix="/api",
)

app.include_router(
    streaks.router,
    prefix="/api",
)


# ==========================================
# ROOT
# ==========================================

@app.get("/")
def root():

    return {
        "message": "HabitFlow API is running"
    }


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health_check():

    return {
        "status": "ok"
    }