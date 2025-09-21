from fastapi import APIRouter, Depends, HTTPException, status
import logging

from queries.favourites import *
from models.favourites import *

from auth.auth import get_current_user

router = APIRouter(tags=["Favourites"])
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(" FAVOURITES ROUTE ")


@router.post("/add_favourite")
async def add_favourite_route(
    book: FavouriteBookAdd, current_user: str = Depends(get_current_user)
):
    try:
        logger.info("Adding a book to favourite books")
        await add_favourite(int(current_user), book.book_id)
        return {"message": "Book has been added to favourites or updated."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Error occurred: {str(e)}"
        )


@router.get("/favourite_books", response_model=FavouriteBookListResponse)
async def get_favourite_books_route(current_user: str = Depends(get_current_user)):
    try:
        books = await get_favourite_books(int(current_user))
        if not books:
            return FavouriteBookListResponse(favourite_books=[])
        return FavouriteBookListResponse(
            favourite_books=[FavouriteBookListItem(**book) for book in books]
        )
    except Exception as e:
        logger.error(f"Error fetching favourite books: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching favourite books.",
        )


@router.delete("/remove_favourite/{book_id}")
async def remove_favourite_route(
    book_id: int, current_user: str = Depends(get_current_user)
):
    try:
        logger.info(f"Removing book ID {book_id} from favourites")
        await remove_favourite(int(current_user), book_id)
        return {"detail": "Book has been removed from favourites."}
    except Exception as e:
        logger.error(f"Error removing favourite book: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error removing favourite book.",
        )


@router.delete("/remove_all_favourites")
async def remove_all_favourites_route(current_user: str = Depends(get_current_user)):
    try:
        logger.info("Removing all favourite books")
        await remove_all_favourites(int(current_user))
        return {"detail": "All favourite books have been removed."}
    except Exception as e:
        logger.error(f"Error removing all favourite books: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error removing all favourite books.",
        )


@router.get("/is_favourite/{book_id}", response_model=IsFavouriteResponse)
async def is_favourite_route(
    book_id: int, current_user: str = Depends(get_current_user)
):
    try:
        logger.info(f"Checking if book ID {book_id} is a favourite")
        favourite = await is_favourite(int(current_user), book_id)
        return IsFavouriteResponse(is_favourite=favourite)
    except Exception as e:
        logger.error(f"Error checking if book is favourite: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error checking if book is favourite.",
        )
