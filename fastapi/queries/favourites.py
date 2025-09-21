# -------------------
# User-specific Favourites
# -------------------
from typing import Any, List
from database import database


async def add_favourite(user_id: int, book_id: int) -> None:
    query = """
    INSERT INTO favourites (user_id, book_id)
    VALUES (:user_id, :book_id)
    ON CONFLICT (user_id, book_id) DO NOTHING
    """
    await database.execute(query=query, values={"user_id": user_id, "book_id": book_id})


async def remove_favourite(user_id: int, book_id: int) -> None:
    query = "DELETE FROM favourites WHERE user_id = :user_id AND book_id = :book_id"
    await database.execute(query=query, values={"user_id": user_id, "book_id": book_id})


async def remove_all_favourites(user_id: int) -> None:
    query = "DELETE FROM favourites WHERE user_id = :user_id"
    await database.execute(query=query, values={"user_id": user_id})


async def get_favourite_books(user_id: int) -> List[dict[str, Any]]:
    query = """
    SELECT b.id, b.title, b.author, b.image_path
    FROM books b
    JOIN favourites f ON b.id = f.book_id
    WHERE f.user_id = :user_id
    ORDER BY f.book_id DESC
    """
    return await database.fetch_all(query=query, values={"user_id": user_id})


async def is_favourite(user_id: int, book_id: int) -> bool:
    query = "SELECT 1 FROM favourites WHERE user_id = :user_id AND book_id = :book_id"
    result = await database.fetch_one(
        query=query, values={"user_id": user_id, "book_id": book_id}
    )
    return result is not None


#####

# from typing import Any, Optional
# from database import database


# # Add a book to favourites (ignore duplicates)
# async def add_favourite(book_id: int) -> None:
#     query = """
#     INSERT INTO favourites (book_id)
#     VALUES (:book_id)
#     ON CONFLICT (book_id) DO NOTHING
#     """
#     await database.execute(query=query, values={"book_id": book_id})


# # Remove a book from favourites
# async def remove_favourite(book_id: int) -> None:
#     query = """
#     DELETE FROM favourites
#     WHERE book_id = :book_id
#     """
#     await database.execute(query=query, values={"book_id": book_id})


# # Remove all favourite books
# async def remove_all_favourites() -> None:
#     query = """
#     TRUNCATE TABLE favourites
#     RESTART IDENTITY CASCADE
#     """
#     await database.execute(query=query)


# # Get the list of favourite books (joined with books table)
# async def get_favourite_books() -> list[dict[str, Any]]:
#     query = """
#     SELECT b.id, b.title, b.author, b.image_path
#     FROM books b
#     JOIN favourites f ON b.id = f.book_id
#     ORDER BY f.id DESC
#     """
#     return await database.fetch_all(query)


# # Check if a book is in favourites
# async def is_favourite(book_id: int) -> bool:
#     query = "SELECT 1 FROM favourites WHERE book_id = :book_id"
#     result: Optional[dict[str, Any]] = await database.fetch_one(
#         query=query, values={"book_id": book_id}
#     )
#     return result is not None
