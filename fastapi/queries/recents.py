# -------------------
# User-specific Recents
# -------------------

from typing import Any, List
from database import database


async def add_recent(user_id: int, book_id: int) -> None:
    query = """
    INSERT INTO recents (user_id, book_id, opened_at)
    VALUES (:user_id, :book_id, now())
    ON CONFLICT (user_id, book_id) DO UPDATE SET opened_at = EXCLUDED.opened_at
    """
    await database.execute(query=query, values={"user_id": user_id, "book_id": book_id})


async def get_recent_books(user_id: int) -> List[dict[str, Any]]:
    query = """
    SELECT b.id, b.title, b.author, b.image_path
    FROM books b
    JOIN recents r ON b.id = r.book_id
    WHERE r.user_id = :user_id
    ORDER BY r.opened_at DESC
    """
    return await database.fetch_all(query=query, values={"user_id": user_id})


async def delete_recent(user_id: int, book_id: int) -> None:
    query = "DELETE FROM recents WHERE user_id = :user_id AND book_id = :book_id"
    await database.execute(query=query, values={"user_id": user_id, "book_id": book_id})


async def delete_all_recents(user_id: int) -> None:
    query = "DELETE FROM recents WHERE user_id = :user_id"
    await database.execute(query=query, values={"user_id": user_id})


#####

# from typing import Any, List
# from database import database


# # Add or update a book in recent books
# async def add_recent(book_id: int) -> None:
#     query = """
#     INSERT INTO recents (book_id, opened_at)
#     VALUES (:book_id, now())
#     ON CONFLICT (book_id)
#     DO UPDATE SET opened_at = EXCLUDED.opened_at
#     """
#     await database.execute(query=query, values={"book_id": book_id})


# # Get the list of recent books (joined with books table)
# async def get_recent_books() -> List[dict[str, Any]]:
#     query = """
#     SELECT b.id, b.title, b.author, b.image_path, r.opened_at
#     FROM books b
#     JOIN recents r ON b.id = r.book_id
#     ORDER BY r.opened_at DESC
#     """
#     return await database.fetch_all(query)


# # Delete a single book from recents
# async def delete_recent(book_id: int) -> None:
#     query = """
#     DELETE FROM recents
#     WHERE book_id = :book_id
#     """
#     await database.execute(query=query, values={"book_id": book_id})


# # Delete all recent books
# async def delete_all_recents() -> None:
#     query = "TRUNCATE TABLE recents RESTART IDENTITY CASCADE"
#     await database.execute(query=query)
