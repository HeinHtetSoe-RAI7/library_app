from typing import Any, Optional, List
from databases import Database
import logging
import os

# -------------------
# Database connection
# -------------------
POSTGRES_USER = os.getenv("POSTGRES_USER", "abcd")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "abcd")
POSTGRES_DB = os.getenv("POSTGRES_DB", "library")
POSTGRES_HOST = os.getenv(
    "POSTGRES_HOST", "postgresql"
)  # `postgresql` service name in Docker Compose
POSTGRES_PORT = os.getenv("POSTGRES_PORT", 5432)

DATABASE_URL = f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

database = Database(DATABASE_URL)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("DATABASE")


async def connect_db() -> None:
    await database.connect()
    logger.info("Database connected")


async def disconnect_db() -> None:
    await database.disconnect()
    logger.info("Database disconnected")


# -------------------
# Table creation
# -------------------
async def init_db() -> None:
    await _create_books_table()
    await _create_users_table()
    await _create_recents_table()
    await _create_favourites_table()
    await _create_notes_table()
    logger.info("Database initialized successfully.")


async def _create_books_table() -> None:
    query = """
    CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        year INTEGER,
        pages INTEGER,
        image_path TEXT,
        book_link TEXT
    )
    """
    await database.execute(query=query)
    logger.info("Books table created (or already exists).")


async def _create_users_table() -> None:
    query = """
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    """
    await database.execute(query=query)
    logger.info("Users table created (or already exists).")


async def _create_recents_table() -> None:
    query = """
    CREATE TABLE IF NOT EXISTS recents (
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        book_id INT REFERENCES books(id) ON DELETE CASCADE,
        opened_at TIMESTAMP NOT NULL DEFAULT NOW(),
        PRIMARY KEY(user_id, book_id)
    )
    """
    await database.execute(query=query)
    logger.info("Recents table created (or already exists).")


async def _create_favourites_table() -> None:
    query = """
    CREATE TABLE IF NOT EXISTS favourites (
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        book_id INT REFERENCES books(id) ON DELETE CASCADE,
        PRIMARY KEY(user_id, book_id)
    )
    """
    await database.execute(query=query)
    logger.info("Favourites table created (or already exists.)")


# async def _create_notes_table() -> None:
#     query = """
#     CREATE TABLE IF NOT EXISTS notes (
#         user_id INT REFERENCES users(id) ON DELETE CASCADE,
#         book_id INT REFERENCES books(id) ON DELETE CASCADE,
#         note TEXT,
#         PRIMARY KEY(user_id, book_id)
#     )
#     """
#     await database.execute(query=query)
#     logger.info("Notes table created (or already exists.)")


async def _create_notes_table() -> None:
    query = """
    CREATE TABLE IF NOT EXISTS notes (
    book_id INT PRIMARY KEY,
    note TEXT
);
    """
    await database.execute(query=query)
    logger.info("Notes table created (or already exists.)")
