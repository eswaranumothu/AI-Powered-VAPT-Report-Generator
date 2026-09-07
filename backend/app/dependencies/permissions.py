from fastapi import Depends, HTTPException, status

from app.core.roles import UserRole
from app.dependencies.auth import get_current_user


def require_admin(
    current_user=Depends(get_current_user),
):
    if current_user.role != UserRole.ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )

    return current_user


def require_admin_or_auditor(
    current_user=Depends(get_current_user),
):
    if current_user.role not in [
        UserRole.ADMIN.value,
        UserRole.AUDITOR.value,
    ]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Auditor or Admin access required.",
        )

    return current_user