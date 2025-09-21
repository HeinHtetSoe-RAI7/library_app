from fastapi import APIRouter, HTTPException, status, Body, Depends
from typing import Optional
import logging
from pathlib import Path

from models.books import *

from queries.books import *
from utilities import *

from auth.auth import get_current_user

router = APIRouter(tags=["Books"])
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(" BOOKS ROUTE ")


def format_book(row) -> dict:
    return {
        "id": row["id"],
        "image_path": row["image_path"],
        "title": row["title"],
        "author": row["author"],
    }


@router.get("/books", response_model=BookListResponse)
async def show_all_books_route(current_user: str = Depends(get_current_user)):
    logger.info("Fetching all books")
    try:
        data = await get_all_books()
        books = [format_book(row) for row in data]
        return BookListResponse(books=[BookListItem(**book) for book in books])
    except Exception as e:
        logger.error(f"Error fetching books: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching books",
        )


@router.get("/book/{book_id}", response_model=BookDetailResponse)
async def get_book_details_route(
    book_id: int, current_user: str = Depends(get_current_user)
):
    logger.info(f"Fetching details for book ID: {book_id}")
    try:
        book = await get_book_by_id(book_id)
        if not book:
            logger.warning(f"Book with ID {book_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
            )
        return BookDetailResponse(book_detail=BookOut(**dict(book)))
    except Exception as e:
        logger.error(f"Error fetching book details: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching book details",
        )


@router.get("/search", response_model=BookListResponse)
async def filter_books_by_title_route(
    title: Optional[str] = None, current_user: str = Depends(get_current_user)
):
    logger.info(f"Filtering books by title: {title}")
    try:
        data = await find_books_by_title(title) if title else await get_all_books()
        books = [format_book(row) for row in data]
        return BookListResponse(books=[BookListItem(**book) for book in books])
    except Exception as e:
        logger.error(f"Error filtering books: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error filtering books",
        )


@router.get("/filter", response_model=BookListResponse)
async def filter_books_by_author_route(
    author: Optional[str] = None, current_user: str = Depends(get_current_user)
):
    logger.info(f"Filtering books by author: {author}")
    try:
        data = await find_books_by_author(author) if author else await get_all_books()
        books = [format_book(row) for row in data]
        return BookListResponse(books=[BookListItem(**book) for book in books])
    except Exception as e:
        logger.error(f"Error filtering books: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error filtering books",
        )


@router.get("/scan_books", response_model=BookResponse)
async def scan_books_route(folder: str = "/books"):
    logger.info(f"Scanning books...")
    try:
        scanned_books = await scan_books(folder)
        if scanned_books is None:
            logger.error(f"Failed to scan books in folder {folder}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to scan books",
            )
        return BookResponse(
            message=f"Scanned {scanned_books['added']} new books", book=scanned_books
        )
    except Exception as e:
        logger.error(f"Error scanning books: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error scanning books",
        )


@router.post("/update", response_model=BookResponse)
async def update_book_route(
    update: BookUpdate = Body(...), current_user: str = Depends(get_current_user)
):
    logger.info(f"Updating book ID: {update.book_id}")
    try:
        if not update.book_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="book_id is required"
            )
        updated_book = await update_book(
            update.book_id, update.title, update.author, update.year, update.image_path
        )
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
            message="Book updated successfully", book=dict(updated_book)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating book: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating book",
        )


@router.delete("/remove", response_model=BookResponse)
async def remove_book_route(
    delete: BookDelete = Body(...), current_user: str = Depends(get_current_user)
):
    logger.info(f"Deleting book ID: {delete.book_id}")
    try:
        deleted_book = await delete_book(delete.book_id)
        if not deleted_book:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Book not found"
            )
        return BookResponse(
            message="Book deleted successfully", book=dict(deleted_book)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting book: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting book",
        )


@router.delete("/remove_all", response_model=dict)
async def remove_all_books_route():
    logger.info("Deleting all books from the database")
    try:
        truncated = await truncate_books_table()
        if truncated is None:
            return {"message": f"Deleted {truncated or 0} books successfully"}
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete all books",
        )
    except Exception as e:
        logger.error(f"Error deleting all books: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting all books",
        )
