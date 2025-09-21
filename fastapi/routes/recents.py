from fastapi import APIRouter, HTTPException, status, Depends
import logging

from queries.recents import *
from models.recents import *

from auth.auth import get_current_user

router = APIRouter(tags=["Recents"])
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(" RECENTS ROUTE ")


@router.post("/add_recent")
async def insert_recent_route(
    book: RecentBookAdd, current_user: str = Depends(get_current_user)
):
    try:
        logger.info("Adding a book to recent books")
        await add_recent(int(current_user), book.book_id)
        return {"message": "Book has been added to recents or updated."}
    except ValueError as e:
        # For validation errors
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid input: {e}"
        )
    except Exception as e:
        logger.error(f"Error occurred: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error.",
        )


@router.get("/recent_books", response_model=RecentBookListResponse)
async def get_recents_route(current_user: str = Depends(get_current_user)):
    try:
        books = await get_recent_books(int(current_user))
        if not books:
            return RecentBookListResponse(recent_books=[])
        return RecentBookListResponse(
            recent_books=[RecentBookListItem(**book) for book in books]
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching books: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching books.",
        )


@router.delete("/clear_all")
async def clear_all_route(current_user: str = Depends(get_current_user)):
    try:
        logger.info("Deleting recent books")
        await delete_all_recents(int(current_user))
        return {"message": "All recent books have been cleared."}
    except Exception as e:
        logger.error(f"Error clearing recent books: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error clearing recent books.",
        )
