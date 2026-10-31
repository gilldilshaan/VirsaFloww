"""SQLAlchemy 2.x declarative models for PostgreSQL persistence.

Hybrid Architecture:
- Strongly typed columns for primary keys, foreign keys, filtering criteria, and status enums.
- PostGIS Geometry(Polygon, 4326) on fields.boundary with GiST indexing.
- Comprehensive 'payload' JSONB column storing the exact canonical camelCase wire representation.
- Strict RESTRICT foreign key deletion rules to prevent cascading data or audit destruction.
"""

from typing import Any, Dict, Optional
from sqlalchemy import (
    BigInteger,
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry

from backend.app.db.base import Base

class UserDB(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(128), primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    organization: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    buyer_company_id: Mapped[Optional[str]] = mapped_column(String(128), nullable=True, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    payload: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)

class ProjectDB(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String(128), primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    district: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    practice: Mapped[str] = mapped_column(String(255), nullable=False)
    developer: Mapped[str] = mapped_column(String(255), nullable=False)
    assessment_status: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    payload: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)

class FarmerDB(Base):
    __tablename__ = "farmers"

    id: Mapped[str] = mapped_column(String(128), primary_key=True)
    user_id: Mapped[str] = mapped_column(
        String(128), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    name_local: Mapped[str] = mapped_column(String(255), nullable=False)
    phone_masked: Mapped[str] = mapped_column(String(64), nullable=False)
    district: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    payload: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)

class FieldDB(Base):
    __tablename__ = "fields"

    id: Mapped[str] = mapped_column(String(128), primary_key=True)
    code: Mapped[str] = mapped_column(String(128), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    farmer_id: Mapped[str] = mapped_column(
        String(128), ForeignKey("farmers.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    district: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    area_ha: Mapped[float] = mapped_column(Numeric(10, 4), nullable=False)
    project_id: Mapped[Optional[str]] = mapped_column(
        String(128), ForeignKey("projects.id", ondelete="RESTRICT"), nullable=True, index=True
    )
    boundary = mapped_column(
        Geometry(geometry_type="POLYGON", srid=4326, spatial_index=True),
        nullable=True,
    )
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    payload: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)

class SeasonDB(Base):
    __tablename__ = "seasons"

    id: Mapped[str] = mapped_column(String(128), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    start_date: Mapped[str] = mapped_column(String(32), nullable=False)
    end_date: Mapped[str] = mapped_column(String(32), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    payload: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)

class ActivityDB(Base):
    __tablename__ = "activities"

    id: Mapped[str] = mapped_column(String(128), primary_key=True)
    field_id: Mapped[str] = mapped_column(
        String(128), ForeignKey("fields.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    season_id: Mapped[str] = mapped_column(
        String(128), ForeignKey("seasons.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    activity_type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    declared_date: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    created_by: Mapped[str] = mapped_column(
        String(128), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    created_at: Mapped[str] = mapped_column(String(64), nullable=False)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    payload: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)

class EvidenceDB(Base):
    __tablename__ = "evidence"

    id: Mapped[str] = mapped_column(String(128), primary_key=True)
    field_id: Mapped[str] = mapped_column(
        String(128), ForeignKey("fields.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    activity_id: Mapped[Optional[str]] = mapped_column(
        String(128), ForeignKey("activities.id", ondelete="RESTRICT"), nullable=True, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    captured_at: Mapped[str] = mapped_column(String(64), nullable=False)
    submitted_at: Mapped[str] = mapped_column(String(64), nullable=False)
    submitter_id: Mapped[str] = mapped_column(
        String(128), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    sha256: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    supersedes_id: Mapped[Optional[str]] = mapped_column(
        String(128), ForeignKey("evidence.id", ondelete="RESTRICT"), nullable=True, index=True
    )
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    payload: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)

class AssessmentDB(Base):
    __tablename__ = "assessments"

    id: Mapped[str] = mapped_column(String(128), primary_key=True)
    field_id: Mapped[str] = mapped_column(
        String(128), ForeignKey("fields.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    season_id: Mapped[str] = mapped_column(
        String(128), ForeignKey("seasons.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    assessed_at: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    ruleset_version: Mapped[str] = mapped_column(String(64), nullable=False)
    status: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    payload: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)

class ReviewDB(Base):
    __tablename__ = "reviews"

    id: Mapped[str] = mapped_column(String(128), primary_key=True)
    parcel_id: Mapped[str] = mapped_column(String(128), nullable=False)
    field_id: Mapped[str] = mapped_column(
        String(128), ForeignKey("fields.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    severity: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    reported_date: Mapped[str] = mapped_column(String(32), nullable=False)
    due_date: Mapped[str] = mapped_column(String(32), nullable=False)
    assigned_to: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    evidence_ref_id: Mapped[Optional[str]] = mapped_column(
        String(128), ForeignKey("evidence.id", ondelete="RESTRICT"), nullable=True, index=True
    )
    decision: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    payload: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)

class BuyerEnquiryDB(Base):
    __tablename__ = "buyer_enquiries"

    id: Mapped[str] = mapped_column(String(128), primary_key=True)
    project_id: Mapped[str] = mapped_column(
        String(128), ForeignKey("projects.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    buyer_company_id: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    owner_id: Mapped[str] = mapped_column(
        String(128), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    stage: Mapped[str] = mapped_column(String(64), nullable=False)
    status: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    inquiry_date: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    volume_requested_tons: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    payload: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)

class NotificationDB(Base):
    __tablename__ = "notifications"

    id: Mapped[str] = mapped_column(String(128), primary_key=True)
    recipient_id: Mapped[str] = mapped_column(
        String(128), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    field_id: Mapped[Optional[str]] = mapped_column(
        String(128), ForeignKey("fields.id", ondelete="RESTRICT"), nullable=True, index=True
    )
    type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    created_at: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    payload: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)

class AuditEventDB(Base):
    __tablename__ = "audit_events"

    sequence_num: Mapped[int] = mapped_column(
        BigInteger, primary_key=True, autoincrement=True
    )
    event_id: Mapped[str] = mapped_column(String(128), unique=True, nullable=False, index=True)
    actor_id: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    action: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    entity_type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    entity_id: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    timestamp: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    previous_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    event_hash: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    details: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    payload: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)

class AuditChainHeadDB(Base):
    __tablename__ = "audit_chain_head"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    last_sequence_num: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    last_event_hash: Mapped[str] = mapped_column(
        String(64),
        default="0000000000000000000000000000000000000000000000000000000000000000",
        nullable=False,
    )
    updated_at = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    __table_args__ = (
        CheckConstraint("id = 1", name="chk_single_chain_head"),
    )
