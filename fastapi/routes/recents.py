from fastapi import APIRouter, HTTPException, status, Depends
import logging
from functools import wraps

from queries.recents import *
from models.recents import *
from auth.auth import get_current_user

router = APIRouter(tags=["Recents"])
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("RECENTS ROUTE")


# ----------------------------
# Error handling decorator
# ----------------------------
def handle_route_errors(action: str):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            try:
                return await func(*args, **kwargs)
            except HTTPException as e:
                logger.warning(f"{action} - HTTP error: {e.detail}")
                raise
            except ValueError as e:
                logger.warning(f"{action} - Validation error: {e}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid input: {e}",
                )
            except Exception as e:
                logger.error(f"{action} - Unexpected error: {e}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Error while {action.lower()}.",
                )

        return wrapper

    return decorator


# ----------------------------
# Routes
# ----------------------------
@router.post("/add_recent", response_model=RecentBookResponse)
@handle_route_errors("Adding recent book")
async def insert_recent_route(
    book: RecentBookAdd, current_user: str = Depends(get_current_user)
):
    logger.info(f"Adding book {book.book_id} to recents for user {current_user}")
    await add_recent(int(current_user), book.book_id)
    return RecentBookResponse(
        message="Book has been added to recents or updated.", book_id=book.book_id
    )


@router.get("/recent_books", response_model=RecentBookListResponse)
@handle_route_errors("Fetching recent books")
async def get_recents_route(current_user: str = Depends(get_current_user)):
    books = await get_recent_books(int(current_user))
    if not books:
        return RecentBookListResponse(recent_books=[])
    return RecentBookListResponse(
        recent_books=[RecentBookListItem(**book) for book in books]
    )


@router.delete("/clear_all", response_model=RecentBookResponse)
@handle_route_errors("Clearing recent books")
async def clear_all_route(current_user: str = Depends(get_current_user)):
    logger.info(f"Clearing all recents for user {current_user}")
    await delete_all_recents(int(current_user))
    return RecentBookResponse(message="All recent books have been cleared.")
