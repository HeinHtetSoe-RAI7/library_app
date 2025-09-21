from pydantic import BaseModel
from typing import Optional, List


class FavouriteBookAdd(BaseModel):
    book_id: int


class FavouriteBookListItem(BaseModel):
    id: int
    title: Optional[str] = None
    author: Optional[str] = None
    image_path: Optional[str] = None


# Response Models
class FavouriteBookListResponse(BaseModel):
    favourite_books: List[FavouriteBookListItem]


class IsFavouriteResponse(BaseModel):
    is_favourite: bool
