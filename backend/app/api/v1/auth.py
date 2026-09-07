from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.auth import LoginRequest, LoginResponse
from app.services.auth_service import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/login",
    response_model=LoginResponse
)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    try:
        return AuthService.login(
            db,
            request.email,
            request.password
        )

    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )