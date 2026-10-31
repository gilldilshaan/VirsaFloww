from typing import Optional
from pydantic import Field
from backend.app.schemas.common import BaseSchema

class FarmerProfile(BaseSchema):
    id: str = Field(..., description="Unique farmer identifier")
    user_id: str = Field(..., alias="userId")
    name: str
    name_local: str = Field(..., alias="nameLocal")
    phone_masked: str = Field(..., alias="phoneMasked")
    district: str
    tehsil: Optional[str] = None
    village: Optional[str] = None
    fpo_id: Optional[str] = Field(default=None, alias="fpoId")
    fpo_name: Optional[str] = Field(default=None, alias="fpoName")
    enrolled_hectares: float = Field(default=0.0, alias="enrolledHectares")
    aadhaar_consent_provided: bool = Field(default=False, alias="aadhaarConsentProvided")
    bank_account_verified: bool = Field(default=False, alias="bankAccountVerified")
    is_demo: bool = Field(default=True, alias="isDemo")
    data_label: str = Field(default="Demo data", alias="dataLabel")
