from fastapi import APIRouter, HTTPException, status, Depends
import logging
import re

from queries.notes import *
from models.notes import *

from auth.auth import get_current_user

router = APIRouter(tags=["Notes"])
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(" NOTES ROUTE ")


def sanitize_note(note: str) -> str:
    if not note:
        return ""
    # normalize line breaks and remove control characters
    note = note.replace("\r\n", "\n").replace("\r", "\n")
    note = re.sub(r"[\x00-\x1F]+", "", note)
    return note.strip()


@router.post("/notes", response_model=NoteOut)
async def create_or_update_note_route(note: NoteCreate):
    try:
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
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating/updating note: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error.",
        )


@router.get("/notes/{book_id}", response_model=NoteOut)
async def read_note_route(book_id: int):
    try:
        note = await get_note_by_book(book_id)
        if not note:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Note not found"
            )
        return note
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching note for book {book_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error.",
        )


@router.delete("/notes/{book_id}")
async def delete_note_route(book_id: int):
    try:
        note = await get_note_by_book(book_id)
        if not note:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Note not found"
            )
        await delete_note_by_book(book_id)
        logger.info(f"Deleted note for book {book_id}")
        return {"message": "Note deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting note for book {book_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error.",
        )
