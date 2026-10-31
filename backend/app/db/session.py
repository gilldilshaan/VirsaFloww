import os
import sys
from contextlib import contextmanager
from typing import Generator, Optional
from sqlalchemy import create_engine, Engine
from sqlalchemy.orm import sessionmaker, Session
from backend.app.core.config import settings

_engine: Optional[Engine] = None
_session_factory: Optional[sessionmaker] = None

def get_engine(url: Optional[str] = None) -> Engine:
    """Creates or returns the configured SQLAlchemy engine for PostgreSQL.
    
    Enforces pool_pre_ping=True, pool_size<=5, and search_path including 'public,extensions'.
    Defaults to TEST_DATABASE_URL if executing within pytest or APP_ENV=testing.
    """
    global _engine
    is_testing = (
        settings.APP_ENV == "testing"
        or "pytest" in sys.modules
        or bool(os.getenv("PYTEST_CURRENT_TEST"))
    )
    target_url = url or (
        settings.TEST_DATABASE_URL if is_testing else settings.DATABASE_URL
    )
    if not target_url:
        raise ValueError("Database URL is not configured.")

    # Validate URL against port 6543
    settings.validate_database_url(target_url, label="Engine URL")

    if _engine is None or url is not None:
        engine = create_engine(
            target_url,
            pool_pre_ping=True,
            pool_size=5,
            max_overflow=5,
            connect_args={"options": "-c search_path=public,extensions"},
        )
        if url is None:
            _engine = engine
        return engine
    return _engine

def get_session_factory(engine: Optional[Engine] = None) -> sessionmaker:
    """Returns the thread-safe sessionmaker bound to the engine."""
    global _session_factory
    eng = engine or get_engine()
    if _session_factory is None or engine is not None:
        factory = sessionmaker(autocommit=False, autoflush=False, bind=eng)
        if engine is None:
            _session_factory = factory
        return factory
    return _session_factory

@contextmanager
def db_session(engine: Optional[Engine] = None) -> Generator[Session, None, None]:
    """Context manager for transactional database operations."""
    factory = get_session_factory(engine)
    session: Session = factory()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()

def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency for obtaining a database session."""
    factory = get_session_factory()
    session = factory()
    try:
        yield session
    finally:
        session.close()
