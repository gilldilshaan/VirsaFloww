"""0001_initial_schema

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2026-10-31 20:45:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from geoalchemy2 import Geometry

# revision identifiers, used by Alembic.
revision: str = "0001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. PostGIS Extension in schema 'extensions'
    op.execute("CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;")

    # 2. Table: users
    op.create_table(
        "users",
        sa.Column("id", sa.String(length=128), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=64), nullable=False),
        sa.Column("organization", sa.String(length=255), nullable=True),
        sa.Column("buyer_company_id", sa.String(length=128), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("payload", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_role", "users", ["role"])
    op.create_index("ix_users_buyer_company_id", "users", ["buyer_company_id"])

    # 3. Table: projects
    op.create_table(
        "projects",
        sa.Column("id", sa.String(length=128), primary_key=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("slug", sa.String(length=255), nullable=False),
        sa.Column("location", sa.String(length=255), nullable=False),
        sa.Column("district", sa.String(length=128), nullable=False),
        sa.Column("practice", sa.String(length=255), nullable=False),
        sa.Column("developer", sa.String(length=255), nullable=False),
        sa.Column("assessment_status", sa.String(length=64), nullable=False),
        sa.Column("is_published", sa.Boolean(), server_default=sa.text("false"), nullable=False),
        sa.Column("is_demo", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("payload", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
    )
    op.create_index("ix_projects_slug", "projects", ["slug"], unique=True)
    op.create_index("ix_projects_district", "projects", ["district"])
    op.create_index("ix_projects_assessment_status", "projects", ["assessment_status"])
    op.create_index("ix_projects_is_published", "projects", ["is_published"])

    # 4. Table: farmers
    op.create_table(
        "farmers",
        sa.Column("id", sa.String(length=128), primary_key=True),
        sa.Column("user_id", sa.String(length=128), sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("name_local", sa.String(length=255), nullable=False),
        sa.Column("phone_masked", sa.String(length=64), nullable=False),
        sa.Column("district", sa.String(length=128), nullable=False),
        sa.Column("is_demo", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("payload", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
    )
    op.create_index("ix_farmers_user_id", "farmers", ["user_id"])
    op.create_index("ix_farmers_district", "farmers", ["district"])

    # 5. Table: fields
    op.create_table(
        "fields",
        sa.Column("id", sa.String(length=128), primary_key=True),
        sa.Column("code", sa.String(length=128), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("farmer_id", sa.String(length=128), sa.ForeignKey("farmers.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("district", sa.String(length=128), nullable=False),
        sa.Column("area_ha", sa.Numeric(precision=10, scale=4), nullable=False),
        sa.Column("project_id", sa.String(length=128), sa.ForeignKey("projects.id", ondelete="RESTRICT"), nullable=True),
        sa.Column("boundary", Geometry(geometry_type="POLYGON", srid=4326, spatial_index=True), nullable=True),
        sa.Column("is_demo", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("payload", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
    )
    op.create_index("ix_fields_code", "fields", ["code"], unique=True)
    op.create_index("ix_fields_farmer_id", "fields", ["farmer_id"])
    op.create_index("ix_fields_district", "fields", ["district"])
    op.create_index("ix_fields_project_id", "fields", ["project_id"])

    # 6. Table: seasons
    op.create_table(
        "seasons",
        sa.Column("id", sa.String(length=128), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("year", sa.Integer(), nullable=False),
        sa.Column("start_date", sa.String(length=32), nullable=False),
        sa.Column("end_date", sa.String(length=32), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("is_demo", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("payload", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
    )

    # 7. Table: activities
    op.create_table(
        "activities",
        sa.Column("id", sa.String(length=128), primary_key=True),
        sa.Column("field_id", sa.String(length=128), sa.ForeignKey("fields.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("season_id", sa.String(length=128), sa.ForeignKey("seasons.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("activity_type", sa.String(length=64), nullable=False),
        sa.Column("declared_date", sa.String(length=32), nullable=False),
        sa.Column("created_by", sa.String(length=128), sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("created_at", sa.String(length=64), nullable=False),
        sa.Column("is_demo", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("payload", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
    )
    op.create_index("ix_activities_field_id", "activities", ["field_id"])
    op.create_index("ix_activities_season_id", "activities", ["season_id"])
    op.create_index("ix_activities_activity_type", "activities", ["activity_type"])
    op.create_index("ix_activities_declared_date", "activities", ["declared_date"])

    # 8. Table: evidence
    op.create_table(
        "evidence",
        sa.Column("id", sa.String(length=128), primary_key=True),
        sa.Column("field_id", sa.String(length=128), sa.ForeignKey("fields.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("activity_id", sa.String(length=128), sa.ForeignKey("activities.id", ondelete="RESTRICT"), nullable=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("type", sa.String(length=64), nullable=False),
        sa.Column("category", sa.String(length=64), nullable=False),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column("captured_at", sa.String(length=64), nullable=False),
        sa.Column("submitted_at", sa.String(length=64), nullable=False),
        sa.Column("submitter_id", sa.String(length=128), sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("sha256", sa.String(length=64), nullable=False),
        sa.Column("supersedes_id", sa.String(length=128), sa.ForeignKey("evidence.id", ondelete="RESTRICT"), nullable=True),
        sa.Column("is_demo", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("payload", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
    )
    op.create_index("ix_evidence_field_id", "evidence", ["field_id"])
    op.create_index("ix_evidence_activity_id", "evidence", ["activity_id"])
    op.create_index("ix_evidence_type", "evidence", ["type"])
    op.create_index("ix_evidence_category", "evidence", ["category"])
    op.create_index("ix_evidence_status", "evidence", ["status"])
    op.create_index("ix_evidence_sha256", "evidence", ["sha256"])
    op.create_index("ix_evidence_supersedes_id", "evidence", ["supersedes_id"])

    # 9. Table: assessments
    op.create_table(
        "assessments",
        sa.Column("id", sa.String(length=128), primary_key=True),
        sa.Column("field_id", sa.String(length=128), sa.ForeignKey("fields.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("season_id", sa.String(length=128), sa.ForeignKey("seasons.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("assessed_at", sa.String(length=64), nullable=False),
        sa.Column("ruleset_version", sa.String(length=64), nullable=False),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column("is_demo", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("payload", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
    )
    op.create_index("ix_assessments_field_id", "assessments", ["field_id"])
    op.create_index("ix_assessments_season_id", "assessments", ["season_id"])
    op.create_index("ix_assessments_assessed_at", "assessments", ["assessed_at"])
    op.create_index("ix_assessments_status", "assessments", ["status"])

    # 10. Table: reviews
    op.create_table(
        "reviews",
        sa.Column("id", sa.String(length=128), primary_key=True),
        sa.Column("parcel_id", sa.String(length=128), nullable=False),
        sa.Column("field_id", sa.String(length=128), sa.ForeignKey("fields.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("severity", sa.String(length=64), nullable=False),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column("reported_date", sa.String(length=32), nullable=False),
        sa.Column("due_date", sa.String(length=32), nullable=False),
        sa.Column("assigned_to", sa.String(length=255), nullable=False),
        sa.Column("evidence_ref_id", sa.String(length=128), sa.ForeignKey("evidence.id", ondelete="RESTRICT"), nullable=True),
        sa.Column("decision", sa.String(length=64), nullable=True),
        sa.Column("is_demo", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("payload", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
    )
    op.create_index("ix_reviews_field_id", "reviews", ["field_id"])
    op.create_index("ix_reviews_severity", "reviews", ["severity"])
    op.create_index("ix_reviews_status", "reviews", ["status"])
    op.create_index("ix_reviews_assigned_to", "reviews", ["assigned_to"])
    op.create_index("ix_reviews_evidence_ref_id", "reviews", ["evidence_ref_id"])

    # 11. Table: buyer_enquiries
    op.create_table(
        "buyer_enquiries",
        sa.Column("id", sa.String(length=128), primary_key=True),
        sa.Column("project_id", sa.String(length=128), sa.ForeignKey("projects.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("buyer_company_id", sa.String(length=128), nullable=False),
        sa.Column("owner_id", sa.String(length=128), sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("stage", sa.String(length=64), nullable=False),
        sa.Column("status", sa.String(length=64), nullable=False),
        sa.Column("inquiry_date", sa.String(length=32), nullable=False),
        sa.Column("volume_requested_tons", sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column("is_demo", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("payload", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
    )
    op.create_index("ix_buyer_enquiries_project_id", "buyer_enquiries", ["project_id"])
    op.create_index("ix_buyer_enquiries_buyer_company_id", "buyer_enquiries", ["buyer_company_id"])
    op.create_index("ix_buyer_enquiries_owner_id", "buyer_enquiries", ["owner_id"])
    op.create_index("ix_buyer_enquiries_status", "buyer_enquiries", ["status"])
    op.create_index("ix_buyer_enquiries_inquiry_date", "buyer_enquiries", ["inquiry_date"])

    # 12. Table: notifications
    op.create_table(
        "notifications",
        sa.Column("id", sa.String(length=128), primary_key=True),
        sa.Column("recipient_id", sa.String(length=128), sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("field_id", sa.String(length=128), sa.ForeignKey("fields.id", ondelete="RESTRICT"), nullable=True),
        sa.Column("type", sa.String(length=64), nullable=False),
        sa.Column("is_read", sa.Boolean(), server_default=sa.text("false"), nullable=False),
        sa.Column("created_at", sa.String(length=64), nullable=False),
        sa.Column("is_demo", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("payload", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
    )
    op.create_index("ix_notifications_recipient_id", "notifications", ["recipient_id"])
    op.create_index("ix_notifications_field_id", "notifications", ["field_id"])
    op.create_index("ix_notifications_type", "notifications", ["type"])
    op.create_index("ix_notifications_is_read", "notifications", ["is_read"])
    op.create_index("ix_notifications_created_at", "notifications", ["created_at"])

    # 13. Table: audit_events
    op.create_table(
        "audit_events",
        sa.Column("sequence_num", sa.BigInteger(), sa.Identity(always=False), primary_key=True),
        sa.Column("event_id", sa.String(length=128), nullable=False),
        sa.Column("actor_id", sa.String(length=128), nullable=False),
        sa.Column("action", sa.String(length=128), nullable=False),
        sa.Column("entity_type", sa.String(length=64), nullable=False),
        sa.Column("entity_id", sa.String(length=128), nullable=False),
        sa.Column("timestamp", sa.String(length=64), nullable=False),
        sa.Column("previous_hash", sa.String(length=64), nullable=False),
        sa.Column("event_hash", sa.String(length=64), nullable=False),
        sa.Column("details", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("payload", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
    )
    op.create_index("ix_audit_events_event_id", "audit_events", ["event_id"], unique=True)
    op.create_index("ix_audit_events_event_hash", "audit_events", ["event_hash"], unique=True)
    op.create_index("ix_audit_events_actor_id", "audit_events", ["actor_id"])
    op.create_index("ix_audit_events_action", "audit_events", ["action"])
    op.create_index("ix_audit_events_entity_type", "audit_events", ["entity_type"])
    op.create_index("ix_audit_events_entity_id", "audit_events", ["entity_id"])
    op.create_index("ix_audit_events_timestamp", "audit_events", ["timestamp"])

    # 14. Table: audit_chain_head
    op.create_table(
        "audit_chain_head",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("last_sequence_num", sa.BigInteger(), server_default=sa.text("0"), nullable=False),
        sa.Column(
            "last_event_hash",
            sa.String(length=64),
            server_default=sa.text("'0000000000000000000000000000000000000000000000000000000000000000'"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.CheckConstraint("id = 1", name="chk_single_chain_head"),
    )

    # Initialize single row for audit_chain_head
    op.execute(
        "INSERT INTO audit_chain_head (id, last_sequence_num, last_event_hash) "
        "VALUES (1, 0, '0000000000000000000000000000000000000000000000000000000000000000') "
        "ON CONFLICT (id) DO NOTHING;"
    )

    # 15. Triggers for Evidence Immutability
    op.execute("""
    CREATE OR REPLACE FUNCTION trg_fn_evidence_immutability()
    RETURNS TRIGGER AS $$
    BEGIN
        IF TG_OP = 'DELETE' THEN
            RAISE EXCEPTION 'Evidence records are strictly immutable and cannot be deleted.';
        ELSIF TG_OP = 'UPDATE' THEN
            IF OLD.id != NEW.id OR
               OLD.field_id != NEW.field_id OR
               OLD.activity_id IS DISTINCT FROM NEW.activity_id OR
               OLD.title != NEW.title OR
               OLD.type != NEW.type OR
               OLD.category != NEW.category OR
               OLD.captured_at != NEW.captured_at OR
               OLD.submitted_at != NEW.submitted_at OR
               OLD.submitter_id != NEW.submitter_id OR
               OLD.sha256 != NEW.sha256 OR
               OLD.supersedes_id IS DISTINCT FROM NEW.supersedes_id OR
               OLD.is_demo != NEW.is_demo THEN
                RAISE EXCEPTION 'Evidence records are strictly immutable. Only status transitions are permitted.';
            END IF;
        END IF;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    """)

    op.execute("""
    CREATE TRIGGER trg_evidence_immutability
    BEFORE UPDATE OR DELETE ON evidence
    FOR EACH ROW
    EXECUTE FUNCTION trg_fn_evidence_immutability();
    """)

    # 16. Triggers for Audit Immutability
    op.execute("""
    CREATE OR REPLACE FUNCTION trg_fn_audit_immutability()
    RETURNS TRIGGER AS $$
    BEGIN
        IF TG_OP = 'UPDATE' THEN
            RAISE EXCEPTION 'Audit events are cryptographically immutable and cannot be modified.';
        ELSIF TG_OP = 'DELETE' THEN
            RAISE EXCEPTION 'Audit events are append-only and cannot be deleted.';
        END IF;
        RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;
    """)

    op.execute("""
    CREATE TRIGGER trg_audit_events_immutability
    BEFORE UPDATE OR DELETE ON audit_events
    FOR EACH ROW
    EXECUTE FUNCTION trg_fn_audit_immutability();
    """)

    # 17. Enable Row Level Security (RLS) on all application tables
    app_tables = [
        "users",
        "projects",
        "farmers",
        "fields",
        "seasons",
        "activities",
        "evidence",
        "assessments",
        "reviews",
        "buyer_enquiries",
        "notifications",
        "audit_events",
        "audit_chain_head",
    ]
    for tbl in app_tables:
        op.execute(f"ALTER TABLE {tbl} ENABLE ROW LEVEL SECURITY;")

    # 18. Revoke all privileges from anon and authenticated roles
    op.execute("REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;")
    op.execute("REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;")
    op.execute("ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;")
    op.execute("ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;")

def downgrade() -> None:
    # Drop triggers and functions
    op.execute("DROP TRIGGER IF EXISTS trg_audit_events_immutability ON audit_events;")
    op.execute("DROP FUNCTION IF EXISTS trg_fn_audit_immutability();")
    op.execute("DROP TRIGGER IF EXISTS trg_evidence_immutability ON evidence;")
    op.execute("DROP FUNCTION IF EXISTS trg_fn_evidence_immutability();")

    # Drop tables in reverse topological dependency order
    op.drop_table("audit_chain_head")
    op.drop_table("audit_events")
    op.drop_table("notifications")
    op.drop_table("buyer_enquiries")
    op.drop_table("reviews")
    op.drop_table("assessments")
    op.drop_table("evidence")
    op.drop_table("activities")
    op.drop_table("seasons")
    op.drop_table("fields")
    op.drop_table("farmers")
    op.drop_table("projects")
    op.drop_table("users")
