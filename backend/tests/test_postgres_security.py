import os
import pytest
from sqlalchemy import text
from backend.app.core.config import Settings, settings
from backend.app.db.session import get_engine, db_session

test_db_configured = bool(settings.TEST_DATABASE_URL)

def test_isolation_guard_refuses_identical_refs():
    """Safety Rail 2: Ensures validate_isolation raises RuntimeError if DATABASE_URL and TEST_DATABASE_URL point to same project."""
    test_url = "postgresql+psycopg://postgres.same_project_ref:pass@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"

    # Temporary subclass to test isolation guard without mutating global settings
    class FakeSettings(Settings):
        _raw_database_url = test_url
        _raw_test_database_url = test_url

    with pytest.raises(RuntimeError) as excinfo:
        FakeSettings.validate_isolation()
    assert "SAFETY VIOLATION" in str(excinfo.value)

def test_pooler_port_6543_rejected():
    """Enforces rejection of transaction pooler port 6543."""
    bad_url = "postgresql+psycopg://postgres.ref:pass@aws-0-eu-west-1.pooler.supabase.com:6543/postgres"
    with pytest.raises(ValueError) as excinfo:
        Settings.validate_database_url(bad_url, label="TEST_URL")
    assert "6543" in str(excinfo.value)
    assert "Session Pooler" in str(excinfo.value)

def test_production_guard_refuses_without_env_variable(monkeypatch):
    """Safety Rail 4: Alembic migration env and production targets refuse writes without CONFIRM_PRODUCTION_WRITE='I_APPROVE_PRODUCTION_WRITE'."""
    from backend.alembic.env import get_target_url

    # Ensure confirmation environment variable is NOT set
    monkeypatch.delenv("CONFIRM_PRODUCTION_WRITE", raising=False)

    with pytest.raises(RuntimeError) as excinfo:
        get_target_url(target_override="production")
    assert "SAFETY GUARD TRIGGERED" in str(excinfo.value)
    assert "CONFIRM_PRODUCTION_WRITE" in str(excinfo.value)

@pytest.mark.skipif(not test_db_configured, reason="TEST_DATABASE_URL is not configured")
def test_rls_enabled_on_every_app_table():
    """Verifies that Row Level Security (RLS) is enabled on every application table in the database."""
    settings.validate_isolation()
    engine = get_engine(settings.TEST_DATABASE_URL)

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

    with engine.connect() as conn:
        res = conn.execute(
            text("""
                SELECT c.relname, c.relrowsecurity
                FROM pg_class c
                JOIN pg_namespace n ON n.oid = c.relnamespace
                WHERE n.nspname = 'public'
                  AND c.relkind = 'r'
                  AND c.relname = ANY(:tables);
            """),
            {"tables": app_tables},
        ).fetchall()

        rls_map = {row[0]: row[1] for row in res}
        for tbl in app_tables:
            assert tbl in rls_map, f"Table '{tbl}' was not found in public schema"
            assert rls_map[tbl] is True, f"Table '{tbl}' does not have RLS enabled (relrowsecurity=False)"

@pytest.mark.skipif(not test_db_configured, reason="TEST_DATABASE_URL is not configured")
def test_anon_and_authenticated_have_no_table_privileges():
    """Verifies that all privileges on application tables have been revoked from anon and authenticated roles."""
    settings.validate_isolation()
    engine = get_engine(settings.TEST_DATABASE_URL)

    with engine.connect() as conn:
        for role in ["anon", "authenticated"]:
            # Check has_table_privilege for key operations
            res = conn.execute(
                text("""
                    SELECT has_table_privilege(:role, 'users', 'SELECT'),
                           has_table_privilege(:role, 'evidence', 'INSERT'),
                           has_table_privilege(:role, 'audit_events', 'SELECT');
                """),
                {"role": role},
            ).fetchone()

            has_select_users, has_insert_ev, has_select_audit = res
            assert has_select_users is False, f"Role '{role}' should NOT have SELECT on users"
            assert has_insert_ev is False, f"Role '{role}' should NOT have INSERT on evidence"
            assert has_select_audit is False, f"Role '{role}' should NOT have SELECT on audit_events"
