from typing import Optional
from fastapi import APIRouter, Depends, Query

from backend.app.schemas.notification import Notification
from backend.app.schemas.common import ListEnvelope
from backend.app.schemas.user import User
from backend.app.api.deps import get_container, AppContainer, get_current_user

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=ListEnvelope[Notification])
def list_notifications(
    is_read: Optional[bool] = Query(None, alias="isRead"),
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    container: AppContainer = Depends(get_container),
):
    """Lists notifications addressed to the current authenticated user."""
    def filter_fn(item: Notification) -> bool:
        if item.recipient_id != current_user.id:
            return False
        if is_read is not None and item.is_read != is_read:
            return False
        return True

    items, total = container.notification_repo.list(filter_fn=filter_fn, offset=offset, limit=limit)
    return ListEnvelope[Notification](items=items, total=total, limit=limit, offset=offset)
