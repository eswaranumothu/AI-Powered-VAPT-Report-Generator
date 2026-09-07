from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository
from app.core.security import verify_password, create_access_token


class AuthService:

    @staticmethod
    def login(db: Session, email: str, password: str):

        user = UserRepository.get_by_email(db, email)

        if not user:
            raise ValueError("Invalid email or password")

        if not verify_password(password, user.password_hash):
            raise ValueError("Invalid email or password")

        if not user.is_active:
            raise ValueError("User account is disabled")

        # Update last_login timestamp
        user.last_login = datetime.now(timezone.utc)
        db.commit()

        token = create_access_token(
            {
                "sub": user.email,
                "role": user.role,
                "user_id": user.id,
                "full_name": user.full_name,
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "role": user.role,
                "must_change_password": user.must_change_password,
            },
        }