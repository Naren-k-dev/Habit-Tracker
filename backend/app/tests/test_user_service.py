from app.core.database import SessionLocal
from app.schemas.user import UserCreate
from app.services.user_service import create_user


def test_create_user():
    db = SessionLocal()

    try:
        user_data = UserCreate(
            name="Service Test User",
            email="service-test@habittracker.com",
            password="test12345",
        )

        user = create_user(db, user_data)

        print(f"User created: {user.id}")
        print(f"Name: {user.name}")
        print(f"Email: {user.email}")
        print(f"Password hash exists: {bool(user.password_hash)}")

    except Exception as e:
        db.rollback()
        print("User service test failed!")
        print(e)

    finally:
        db.close()


if __name__ == "__main__":
    test_create_user()