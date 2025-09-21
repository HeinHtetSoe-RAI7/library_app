from pydantic import BaseModel
from typing import Optional, List


class BookOut(BaseModel):
    id: int
    title: Optional[str] = None
    author: Optional[str] = None
    year: Optional[int] = None
    pages: int
    image_path: str
    book_link: str


class BookListItem(BaseModel):
    id: int
    title: str
    author: str
    image_path: str


# class BookCreate(BaseModel):
#     title: str
#     author: str
#     year: int
#     pages: int
#     image_path: str
#     book_link: str


class BookUpdate(BaseModel):
    book_id: int
    title: Optional[str] = None
    author: Optional[str] = None
    year: Optional[int] = None
    image_path: Optional[str] = None
    book_link: str


class BookDelete(BaseModel):
    book_id: int


# Response Models
class BookListResponse(BaseModel):
    books: List[BookListItem]


class BookDetailResponse(BaseModel):
    book_detail: BookOut


class BookResponse(BaseModel):
    message: str
    book: dict
