# # -------------------
# # User-specific Notes
# # -------------------

# from typing import Any, Optional
# from database import database


# async def add_note(user_id: int, book_id: int, note: str) -> None:
#     query = """
#     INSERT INTO notes (user_id, book_id, note)
#     VALUES (:user_id, :book_id, :note)
#     ON CONFLICT (user_id, book_id) DO UPDATE SET note = EXCLUDED.note
#     """
#     await database.execute(
#         query=query, values={"user_id": user_id, "book_id": book_id, "note": note}
#     )


# async def get_note_by_book(user_id: int, book_id: int) -> Optional[dict[str, Any]]:
#     query = "SELECT user_id, book_id, note FROM notes WHERE user_id = :user_id AND book_id = :book_id"
#     return await database.fetch_one(
#         query=query, values={"user_id": user_id, "book_id": book_id}
#     )


# async def update_note(user_id: int, book_id: int, note: str) -> None:
#     query = (
#         "UPDATE notes SET note = :note WHERE user_id = :user_id AND book_id = :book_id"
#     )
#     await database.execute(
#         query=query, values={"user_id": user_id, "book_id": book_id, "note": note}
#     )


# async def delete_note_by_book(user_id: int, book_id: int) -> None:
#     query = "DELETE FROM notes WHERE user_id = :user_id AND book_id = :book_id"
#     await database.execute(query=query, values={"user_id": user_id, "book_id": book_id})


#####

from typing import Any, Optional
from database import database


# Upsert (insert or update) a note for a book
async def upsert_note(book_id: int, note: str) -> None:
    query = """
    INSERT INTO notes (book_id, note)
    VALUES (:book_id, :note)
    ON CONFLICT (book_id) DO UPDATE
    SET note = EXCLUDED.note
    """
    await database.execute(query=query, values={"book_id": book_id, "note": note})


# Get the note for a specific book
async def get_note_by_book(book_id: int) -> Optional[dict[str, Any]]:
    query = """
    SELECT book_id, note
    FROM notes
    WHERE book_id = :book_id
    """
    return await database.fetch_one(query=query, values={"book_id": book_id})


# Delete a note by book ID
async def delete_note_by_book(book_id: int) -> None:
    query = """
    DELETE FROM notes
    WHERE book_id = :book_id
    """
    await database.execute(query=query, values={"book_id": book_id})
