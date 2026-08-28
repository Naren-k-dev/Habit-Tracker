from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal

from app.schemas.user import (
    UserCreate,
    UserResponse,
)

from app.services.user_service import (
    create_user,
)


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post(
    "",
    response_model=UserResponse,
    status_code=201
)
def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    try:
        return create_user(
            db,
            user_data
        )

    except ValueError as e:
        raise HTTPException(
            status_code=409,
            detail=str(e)
        )