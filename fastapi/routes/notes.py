from fastapi import APIRouter, HTTPException, status
from fastapi.exceptions import RequestValidationError
import logging
import re
from functools import wraps

from queries.notes import *
from models.notes import *
from auth.auth import get_current_user

router = APIRouter(tags=["Notes"], prefix="/notes")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("NOTES ROUTE")


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


def sanitize_note(note: str) -> str:
    if not note:
        return ""
    # normalize line breaks and remove control characters
    note = note.replace("\r\n", "\n").replace("\r", "\n")
    note = re.sub(r"[\x00-\x1F]+", "", note)
    return note.strip()


# ----------------------------
# Routes
# ----------------------------
@router.post("", response_model=NoteOut)
@handle_route_errors("Creating or updating note")
async def create_or_update_note_route(note: NoteCreate):
    logger.info(f"Upserting note for book {note.book_id}")
    sanitized = sanitize_note(note.note)
    await upsert_note(note.book_id, sanitized)
    saved = await get_note_by_book(note.book_id)
    if not saved:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save note.",
        )
    return saved


@router.get("/{book_id}", response_model=NoteOut)
@handle_route_errors("Fetching note")
async def read_note_route(book_id: int):
    note = await get_note_by_book(book_id)
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Note not found"
        )
    return note


@router.delete("/{book_id}", response_model=NoteResponse)
@handle_route_errors("Deleting note")
async def delete_note_route(book_id: int):
    note = await get_note_by_book(book_id)
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Note not found"
        )
    await delete_note_by_book(book_id)
    logger.info(f"Deleted note for book {book_id}")
    return NoteResponse(message="Note deleted successfully", book_id=book_id)
