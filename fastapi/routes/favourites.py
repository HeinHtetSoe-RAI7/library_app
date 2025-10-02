from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.exceptions import RequestValidationError
import logging
from functools import wraps

from queries.favourites import *
from models.favourites import *
from auth.auth import get_current_user

router = APIRouter(tags=["Favourites"], prefix="/favourites")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("FAVOURITES ROUTE")


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


# ----------------------------
# Routes
# ----------------------------
@router.post("", response_model=FavouriteResponse)
@handle_route_errors("Adding favourite book")
async def add_favourite_route(
    book: FavouriteBookAdd, current_user: str = Depends(get_current_user)
):
    await add_favourite(int(current_user), book.book_id)
    return FavouriteResponse(
        message="Book has been added to favourites or updated.",
        book_id=book.book_id,
    )


@router.get("", response_model=FavouriteBookListResponse)
@handle_route_errors("Fetching favourite books")
async def get_favourite_books_route(current_user: str = Depends(get_current_user)):
    books = await get_favourite_books(int(current_user))
    return FavouriteBookListResponse(
        favourite_books=(
            [FavouriteBookListItem(**book) for book in books] if books else []
        )
    )


@router.delete("", response_model=FavouriteResponse)
@handle_route_errors("Removing all favourite books")
async def remove_all_favourites_route(current_user: str = Depends(get_current_user)):
    await remove_all_favourites(int(current_user))
    return FavouriteResponse(message="All favourite books have been removed.")


@router.delete("/{book_id}", response_model=FavouriteResponse)
@handle_route_errors("Removing favourite book")
async def remove_favourite_route(
    book_id: int, current_user: str = Depends(get_current_user)
):
    await remove_favourite(int(current_user), book_id)
    return FavouriteResponse(
        message="Book has been removed from favourites.", book_id=book_id
    )


@router.get("/{book_id}", response_model=IsFavouriteResponse)
@handle_route_errors("Checking if book is favourite")
async def is_favourite_route(
    book_id: int, current_user: str = Depends(get_current_user)
):
    favourite = await is_favourite(int(current_user), book_id)
    return IsFavouriteResponse(is_favourite=favourite)
