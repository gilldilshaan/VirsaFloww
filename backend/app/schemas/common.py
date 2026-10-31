from typing import Generic, List, Optional, TypeVar, Any
from pydantic import BaseModel, ConfigDict, Field

T = TypeVar("T")

class BaseSchema(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )

class ListEnvelope(BaseSchema, Generic[T]):
    items: List[T]
    total: int
    limit: int = 50
    offset: int = 0

class ErrorDetail(BaseSchema):
    code: str
    message: str
    details: Optional[Any] = None

class ErrorEnvelope(BaseSchema):
    error: ErrorDetail

class Coordinates(BaseSchema):
    lat: float = Field(..., ge=-90.0, le=90.0)
    lng: float = Field(..., ge=-180.0, le=180.0)
