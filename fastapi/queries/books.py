from typing import Any, Optional, List
from database import database


# Add a new book
async def add_book(
    title: str, author: str, year: int, pages: int, image_path: str, book_link: str
) -> Optional[dict[str, Any]]:
    query = """
    INSERT INTO books (title, author, year, pages, image_path, book_link)
    VALUES (:title, :author, :year, :pages, :image_path, :book_link)
    RETURNING *
    """
    values = {
        "title": title,
        "author": author,
        "year": year,
        "pages": pages,
        "image_path": image_path,
        "book_link": book_link,
    }
    return await database.fetch_one(query=query, values=values)


# Add multiple books in bulk
async def add_books_bulk(books: List[dict[str, Any]]) -> None:
    query = """
    INSERT INTO books (title, author, year, pages, image_path, book_link)
    VALUES (:title, :author, :year, :pages, :image_path, :book_link)
    """
    await database.execute_many(query=query, values=books)


# Get all books (basic info only)
async def get_all_books() -> list[dict[str, Any]]:
    query = "SELECT id, title, author, image_path FROM books"
    return await database.fetch_all(query=query)


# Get book details by ID
async def get_book_by_id(book_id: int) -> Optional[dict[str, Any]]:
    query = "SELECT * FROM books WHERE id = :book_id"
    return await database.fetch_one(query=query, values={"book_id": book_id})


# Find books by title (partial match)
async def find_books_by_title(title: str) -> list[dict[str, Any]]:
    query = "SELECT * FROM books WHERE title ILIKE :title"
    return await database.fetch_all(query=query, values={"title": f"%{title}%"})


# Find books by author (partial match)
async def find_books_by_author(author: str) -> list[dict[str, Any]]:
    query = "SELECT * FROM books WHERE author ILIKE :author"
    return await database.fetch_all(query=query, values={"author": f"%{author}%"})


# Update book by ID
async def update_book(
    book_id: int,
    title: Optional[str] = None,
    author: Optional[str] = None,
    year: Optional[int] = None,
    image_path: Optional[str] = None,
) -> Optional[dict[str, Any]]:
    updates: list[str] = []
    values: dict[str, Any] = {"book_id": book_id}

    if title is not None:
        updates.append("title = :title")
        values["title"] = title
    if author is not None:
        updates.append("author = :author")
        values["author"] = author
    if year is not None:
        updates.append("year = :year")
        values["year"] = year
    if image_path is not None:
        updates.append("image_path = :image_path")
        values["image_path"] = image_path

    if not updates:
        return None  # Nothing to update

    set_clause = ", ".join(updates)
    query = f"""
    UPDATE books
    SET {set_clause}
    WHERE id = :book_id
    RETURNING *
    """
    return await database.fetch_one(query=query, values=values)


# Delete a book by ID
async def delete_book(book_id: int) -> Optional[dict[str, Any]]:
    query = "DELETE FROM books WHERE id = :book_id RETURNING *"
    return await database.fetch_one(query=query, values={"book_id": book_id})


# Truncate the books table
async def truncate_books_table() -> None:
    query = "TRUNCATE TABLE books RESTART IDENTITY CASCADE"
    await database.execute(query=query)


# Check if book exists by link
async def book_exists(book_link: str) -> bool:
    query = "SELECT 1 FROM books WHERE book_link = :book_link"
    result = await database.fetch_one(query=query, values={"book_link": book_link})
    return result is not None
