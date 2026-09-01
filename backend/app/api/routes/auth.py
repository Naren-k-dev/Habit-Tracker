from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from sqlalchemy.orm import Session

from app.core.database import SessionLocal

from app.core.security import (
    create_access_token,
    get_current_user,
)

from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
    ChangePasswordRequest,
    MessageResponse,
)

from app.services.user_service import (
    create_user,
    authenticate_user,
    get_user,
    change_password,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ==========================================
# DATABASE
# ==========================================

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()


# ==========================================
# REGISTER
# ==========================================

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201
)
def register(
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


# ==========================================
# LOGIN
# ==========================================

@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    login_data: UserLogin,
    db: Session = Depends(get_db)
):

    user = authenticate_user(
        db,
        login_data.email,
        login_data.password
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )


    access_token = create_access_token(
        user.id
    )


    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# ==========================================
# CURRENT USER
# ==========================================

@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    user_id: int = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db)
):

    user = get_user(
        db,
        user_id
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    return user


# ==========================================
# CHANGE PASSWORD
# ==========================================

@router.post(
    "/change-password",
    response_model=MessageResponse
)
def change_password_route(
    password_data: ChangePasswordRequest,
    user_id: int = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    try:

        change_password(
            db=db,
            user_id=user_id,
            current_password=
                password_data.current_password,
            new_password=
                password_data.new_password,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


    return {
        "message":
            "Password changed successfully"
    }