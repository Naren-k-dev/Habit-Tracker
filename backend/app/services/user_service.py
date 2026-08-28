from sqlalchemy.orm import Session

from app.models import User
from app.schemas.user import UserCreate
from pwdlib import PasswordHash


password_hash = PasswordHash.recommended()


def create_user(db: Session, user_data: UserCreate) -> User:
    # Check whether email already exists
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise ValueError("Email already registered")

    # Hash the password
    hashed_password = password_hash.hash(user_data.password)

    # Create user
    user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def get_user(
    db: Session,
    user_id: int
) -> User | None:
    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )


def verify_password(
    password: str,
    password_hash_value: str
) -> bool:
    return password_hash.verify(
        password,
        password_hash_value
    )


def authenticate_user(
    db: Session,
    email: str,
    password: str
) -> User:
    # Find user by email
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    # Don't reveal whether the email exists
    if not user:
        raise ValueError("Invalid email or password")

    # Verify password against stored hash
    if not verify_password(
        password,
        user.password_hash
    ):
        raise ValueError("Invalid email or password")

    return user