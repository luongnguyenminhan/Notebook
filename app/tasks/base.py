"""
Base classes and helper functions for Celery tasks.

This module contains common functionality used across all Celery tasks,
including database connection management and base task classes.
"""

import logging
import time

from celery import Task
from sqlalchemy import text
from sqlalchemy.exc import DisconnectionError, SQLAlchemyError

from app.core.database import SessionLocal, engine

logger = logging.getLogger(__name__)

# Database Connection Management for Long-Running Celery Tasks
# These helper functions ensure robust DB connection handling for tasks that may
# run for extended periods or experience connection timeouts.

def get_db_session():
    """Get a fresh database session with connection retry

    This function ensures we get a working database connection by testing
    it immediately after creation and retrying if needed.
    """
    max_retries = 3
    for attempt in range(max_retries):
        try:
            session = SessionLocal()
            # Test the connection
            session.execute(text('SELECT 1'))
            return session
        except (SQLAlchemyError, DisconnectionError) as e:
            logger.warning(f'Database connection attempt {attempt + 1} failed: {e}')
            if attempt < max_retries - 1:
                time.sleep(1)  # Wait 1 second before retry
            else:
                logger.error('Failed to establish database connection after all retries')
                raise

def refresh_db_session(session):
    """Refresh database session if connection is lost

    This function tests if the current session is still active and
    creates a new one if the connection has been lost.
    """
    try:
        # Test if connection is still alive
        session.execute(text('SELECT 1'))
        return session
    except (SQLAlchemyError, DisconnectionError) as e:
        logger.warning(f'Database connection lost, refreshing: {e}')
        try:
            session.close()
        except Exception:
            pass
        return get_db_session()

def safe_db_operation(session, operation_func, *args, **kwargs):
    """Safely execute database operation with connection retry

    This function wraps database operations to handle connection failures
    by automatically refreshing the session and retrying the operation.
    """
    max_retries = 3
    for attempt in range(max_retries):
        try:
            return operation_func(session, *args, **kwargs)
        except (SQLAlchemyError, DisconnectionError) as e:
            logger.warning(f'Database operation attempt {attempt + 1} failed: {e}')
            if attempt < max_retries - 1:
                session = refresh_db_session(session)
                kwargs['session'] = session if 'session' in kwargs else None
            else:
                logger.error('Database operation failed after all retries')
                raise

def dispose_db_connections():
    """Dispose all database connections

    This function should be called before long-running operations
    to prevent connection timeouts.
    """
    try:
        engine.dispose()
    except Exception:
        pass

class CallbackTask(Task):
    """Base task class with success/failure callbacks"""

    def on_success(self, retval, task_id, args, kwargs):
        """
        retval - The return value of the task.
        task_id - Unique id of the executed task.
        args - Original arguments for the executed task.
        kwargs - Original keyword arguments for the executed task.
        """
        logger.debug(f'Task {task_id} succeeded with result: {retval}')
        pass

    def on_failure(self, exc, task_id, args, kwargs, einfo):
        """
        exc - The exception raised by the task.
        task_id - Unique id of the failed task.
        args - Original arguments for the task that failed.
        kwargs - Original keyword arguments for the task that failed.
        """
        logger.debug(f'Task {task_id} failed with exception: {exc}')
        pass
