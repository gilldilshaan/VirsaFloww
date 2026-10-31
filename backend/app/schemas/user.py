from enum import Enum
from typing import Optional, List
from pydantic import Field
from backend.app.schemas.common import BaseSchema

class UserRole(str, Enum):
    ADMIN = "admin"
    PROJECT_DEVELOPER = "project_developer"
    FIELD_OFFICER = "field_officer"
    REVIEWER = "reviewer"
    FARMER = "farmer"
    BUYER = "buyer"

class UserBase(BaseSchema):
    id: str = Field(..., description="Unique user identifier")
    email: str = Field(..., pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$", description="User email address")
    name: str
    role: UserRole
    organization: Optional[str] = None
    assigned_project_ids: List[str] = Field(default_factory=list, alias="assignedProjectIds")
    assigned_field_ids: List[str] = Field(default_factory=list, alias="assignedFieldIds")
    buyer_company_id: Optional[str] = Field(default=None, alias="buyerCompanyId")
    is_active: bool = Field(default=True, alias="isActive")

class User(UserBase):
    pass

class UserInDB(UserBase):
    password_hash: str = Field(..., alias="passwordHash")

class LoginRequest(BaseSchema):
    email: str = Field(..., pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    password: str = Field(..., min_length=1)

class RegisterRequest(BaseSchema):
    name: str = Field(..., min_length=2, max_length=255, description="User full name")
    email: str = Field(..., pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$", description="Valid user email address")
    password: str = Field(..., min_length=8, max_length=128, description="Plaintext password, minimum 8 characters")
    role: UserRole = Field(default=UserRole.FARMER, description="Requested user role")
    organization: Optional[str] = Field(default=None, max_length=255, description="Organization or farm name")
    buyer_company_id: Optional[str] = Field(default=None, alias="buyerCompanyId", description="Buyer corporate entity ID")

class SessionResponse(BaseSchema):
    access_token: str = Field(..., alias="accessToken")
    token_type: str = Field(default="Bearer", alias="tokenType")
    expires_in_seconds: int = Field(..., alias="expiresInSeconds")
    user: User
