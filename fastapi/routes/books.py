from fastapi import APIRouter, HTTPException, status, Body, Depends
from fastapi.exceptions import RequestValidationError
from typing import Optional
import logging
from functools import wraps
from pathlib import Path

from models.books import *
from queries.books import *
from utilities import *
from auth.auth import get_current_user

router = APIRouter(tags=["Books"])
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("BOOKS ROUTE")


# ----------------------------
# Error handling decorator
# ----------------------------
def handle_route_errors(action: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            try:
                return await func(*args, **kwargs)
            except (HTTPException, RequestValidationError) as e:
                logger.error(f"{action} - Request/HTTP error: {e}")
                raise
            except Exception as e:
                logger.error(f"{action} - Unexpected error: {e}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Error while {action.lower()}.",
                )

        return wrapper

    return decorator


def format_book(row) -> dict:
    return {
        "id": row["id"],
        "image_path": row["image_path"],
        "title": row["title"],
        "author": row["author"],
    }


# ----------------------------
# Routes
# ----------------------------
@router.get("/books", response_model=BookListResponse)
@handle_route_errors("Fetching all books")
async def show_all_books_route(current_user: str = Depends(get_current_user)):
    data = await get_all_books()
    books = [format_book(row) for row in data]
    return BookListResponse(books=[BookListItem(**book) for book in books])


@router.get("/book/{book_id}", response_model=BookDetailResponse)
@handle_route_errors("Fetching book details")
async def get_book_details_route(
    book_id: int, current_user: str = Depends(get_current_user)
):
    book = await get_book_by_id(book_id)
    if not book:
        logger.warning(f"Book with ID {book_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
        )
    return BookDetailResponse(book_detail=BookOut(**book))


@router.get("/search", response_model=BookListResponse)
@handle_route_errors("Filtering books by title")
async def filter_books_by_title_route(
    title: Optional[str] = None, current_user: str = Depends(get_current_user)
):
    data = await find_books_by_title(title) if title else await get_all_books()
    books = [format_book(row) for row in data]
    return BookListResponse(books=[BookListItem(**book) for book in books])


@router.get("/filter", response_model=BookListResponse)
@handle_route_errors("Filtering books by author")
async def filter_books_by_author_route(
    author: Optional[str] = None, current_user: str = Depends(get_current_user)
):
    data = await find_books_by_author(author) if author else await get_all_books()
    books = [format_book(row) for row in data]
    return BookListResponse(books=[BookListItem(**book) for book in books])


@router.get("/scan", response_model=BooksResponse)
@handle_route_errors("Scanning books")
async def scan_books_route(
    folder: str = "/books", current_user: str = Depends(get_current_user)
):
    scanned_books = await scan_books(folder)
    if scanned_books is None:
        logger.error(f"Failed to scan books in folder {folder}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to scan books",
        )
    return BooksResponse(
        message=f"Scanned {scanned_books['added']} new books", books=scanned_books
    )


@router.post("/update", response_model=BookResponse)
@handle_route_errors("Updating book")
async def update_book_route(
    update: BookUpdate = Body(...), current_user: str = Depends(get_current_user)
):
    if not update.book_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="book_id is required"
        )

    updated_book = await update_book(
        update.book_id, update.title, update.author, update.year, update.image_path
    )

    # If metadata is provided, update the PDF
    if update.book_link and any([update.title, update.author, update.year]):
        metadata = {}
        if update.title:
            metadata["/Title"] = update.title
        if update.author:
            metadata["/Author"] = update.author
        if update.year:
            metadata["/Year"] = str(update.year)
        logger.info("Updating PDF metadata...")
        await update_pdf_metadata(update.book_link, metadata)

    if not updated_book:
        logger.warning(
            f"Book with ID {update.book_id} not found or no fields to update"
        )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found or no fields to update",
        )

    return BookResponse(
        message="Book updated successfully", book=BookOut(**updated_book)
    )


@router.delete("/remove/{book_id}", response_model=BookResponse)
@handle_route_errors("Deleting book")
async def remove_book_route(
    book_id: int, current_user: str = Depends(get_current_user)
):
    deleted_book = await delete_book(book_id)
    if not deleted_book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
        )
    return BookResponse(
        message="Book deleted successfully", book=BookOut(**deleted_book)
    )


@router.delete("/remove_all", response_model=BookResponse)
@handle_route_errors("Deleting all books")
async def remove_all_books_route(current_user: str = Depends(get_current_user)):
    truncated = await truncate_books_table()
    if truncated is not None:
        return BookResponse(message=f"Deleted {truncated} books successfully")
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Failed to delete all books",
    )
