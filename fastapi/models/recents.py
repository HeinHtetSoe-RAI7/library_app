from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class RecentBookAdd(BaseModel):
    book_id: int


# Responses
class RecentBookResponse(BaseModel):
    message: str
    book_id: Optional[int] = None


class RecentBookListItem(BaseModel):
    id: int
    title: Optional[str] = None
    author: Optional[str] = None
    image_path: Optional[str] = None


class RecentBookListResponse(BaseModel):
    recent_books: List[RecentBookListItem]
