from fastapi import FastAPI

app = FastAPI(
    title="Winter Arc API",
    description="Backend API for the Winter Arc Habit & Personal Progress System",
    version="0.1.0"
)


@app.get("/")
def root():
    return {
        "message": "Winter Arc API is running",
        "status": "ok"
    }