import os
import sys
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# Ensure backend package is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.app.core.config import settings
from backend.app.db.base import Base
import backend.app.db.models  # Ensure all models are registered with Base.metadata

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def get_target_url() -> str:
    """Resolves target database URL with strict isolation and production safety guards."""
    x_args = context.get_x_argument(as_dictionary=True)
    target_env = x_args.get("target", "test").lower()

    prod_url = settings.DATABASE_URL
    test_url = settings.TEST_DATABASE_URL

    # Safety Rail 2: Isolation check
    settings.validate_isolation()

    if target_env == "production" or target_env == "prod":
        # Safety Rail 4: Code-level production guard
        confirm = os.getenv("CONFIRM_PRODUCTION_WRITE", "")
        if confirm != "I_APPROVE_PRODUCTION_WRITE":
            raise RuntimeError(
                "SAFETY GUARD TRIGGERED: Refusing write to PRODUCTION database without "
                "CONFIRM_PRODUCTION_WRITE='I_APPROVE_PRODUCTION_WRITE'."
            )
        if not prod_url:
            raise ValueError("DATABASE_URL is not configured for production migration.")
        settings.validate_database_url(prod_url, label="DATABASE_URL")
        return prod_url

    # Default: Always target the TEST database
    if not test_url:
        raise ValueError("TEST_DATABASE_URL is not configured for test migration.")
    settings.validate_database_url(test_url, label="TEST_DATABASE_URL")
    return test_url

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = get_target_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        include_schemas=True,
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    db_url = get_target_url()
    
    # Configure engine directly to guarantee connection arguments
    from sqlalchemy import create_engine
    connectable = create_engine(
        db_url,
        poolclass=pool.NullPool,
        connect_args={"options": "-c search_path=public,extensions"},
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            include_schemas=True,
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
