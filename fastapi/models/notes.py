from pydantic import BaseModel
from typing import Optional


class NoteCreate(BaseModel):
    book_id: int
    note: str


# Responses
class NoteOut(BaseModel):
    book_id: int
    note: Optional[str] = None
