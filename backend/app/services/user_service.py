from sqlalchemy.orm import Session

from app.models import User
from app.schemas.user import UserCreate

from pwdlib import PasswordHash


password_hash = PasswordHash.recommended()


# ==========================================
# CREATE USER
# ==========================================

def create_user(
    db: Session,
    user_data: UserCreate
) -> User:

    existing_user = (
        db.query(User)
        .filter(
            User.email == user_data.email
        )
        .first()
    )

    if existing_user:
        raise ValueError(
            "Email already registered"
        )

    hashed_password = password_hash.hash(
        user_data.password
    )

    user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,
    )

    db.add(user)

    db.commit()

    db.refresh(user)

    return user


# ==========================================
# GET USER
# ==========================================

def get_user(
    db: Session,
    user_id: int
) -> User | None:

    return (
        db.query(User)
        .filter(
            User.id == user_id
        )
        .first()
    )


# ==========================================
# VERIFY PASSWORD
# ==========================================

def verify_password(
    password: str,
    password_hash_value: str
) -> bool:

    return password_hash.verify(
        password,
        password_hash_value
    )


# ==========================================
# AUTHENTICATE USER
# ==========================================

def authenticate_user(
    db: Session,
    email: str,
    password: str
) -> User | None:

    user = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )

    if not user:
        return None

    if not verify_password(
        password,
        user.password_hash
    ):
        return None

    return user


# ==========================================
# CHANGE PASSWORD
# ==========================================

def change_password(
    db: Session,
    user_id: int,
    current_password: str,
    new_password: str,
) -> None:

    # ------------------------------------------
    # FIND USER
    # ------------------------------------------

    user = (
        db.query(User)
        .filter(
            User.id == user_id
        )
        .first()
    )

    if not user:

        raise ValueError(
            "User not found"
        )


    # ------------------------------------------
    # VERIFY CURRENT PASSWORD
    # ------------------------------------------

    if not verify_password(
        current_password,
        user.password_hash
    ):

        raise ValueError(
            "Current password is incorrect"
        )


    # ------------------------------------------
    # PREVENT SAME PASSWORD
    # ------------------------------------------

    if verify_password(
        new_password,
        user.password_hash
    ):

        raise ValueError(
            "New password must be different from your current password"
        )


    # ------------------------------------------
    # HASH NEW PASSWORD
    # ------------------------------------------

    user.password_hash = password_hash.hash(
        new_password
    )


    # ------------------------------------------
    # SAVE
    # ------------------------------------------

    db.commit()