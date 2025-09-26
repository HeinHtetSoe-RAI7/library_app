// detail/[id]/DetailPage.js
"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import api from "@/lib/axios";
import axios from "axios";

import { Box, Typography, Grow } from "@mui/material";
import BookCardList from "@/components/BookCardList/BookCardList";
import EditBookForm from "@/components/EditBookForm";
import BookImage from "./BookImage";
import BookActions from "./BookActions";
import BookSummary from "./BookSummary";
import EditNoteForm from "@/components/EditNoteForm";

const NOTE_PLACEHOLDER = "No note available";

export default function BookDetail({ book }) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

  const [currentBook, setCurrentBook] = useState(book);
  const [books, setBooks] = useState([]);
  const [favourite, setFavourite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Debounce helper
  const saveNoteTimeout = useRef(null);
  const debouncedUpsertNote = useCallback((bookId, note, delay = 3000) => {
    if (saveNoteTimeout.current) {
      clearTimeout(saveNoteTimeout.current);
    }
    saveNoteTimeout.current = setTimeout(async () => {
      try {
        const { upsertNote } = await import("@/lib/detailActions");
        await upsertNote(bookId, note);
        console.log("Note saved after debounce:", note);
      } catch (err) {
        console.error("Failed to save note:", err);
      }
    }, delay);
  }, []);

  // Combined effect for favourite, author books, and summary
  useEffect(() => {
    if (!book?.id || !book?.title) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Requests in parallel
        const favReq = api.get(`/is_favourite/${book.id}`);

        const authorReq = book.author
          ? api.get(`/filter?author=${encodeURIComponent(book.author)}`)
          : Promise.resolve({ data: { books: [] } });

        const noteReq = api.get(`/notes/${book.id}`).catch((err) => {
          if (err.response?.status === 404) return { data: { note: "" } };
          throw err;
        });

        const [favRes, authorRes, noteRes] = await Promise.all([
          favReq,
          authorReq,
          noteReq,
        ]);

        setFavourite(favRes.data.is_favourite);
        setBooks(authorRes.data.books || []);

        let note = noteRes.data?.note ?? "";
        if (note.trim() !== "") {
          setSummary(note);
        } else {
          // Google Books fallback
          const query = `intitle:${book.title
            .toLowerCase()
            .split(" ")
            .join("+")}`;

          const googleRes = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`
          );

          const firstBook = googleRes.data.items?.[0];
          const description =
            firstBook?.volumeInfo?.description ||
            firstBook?.searchInfo?.textSnippet ||
            "";

          setSummary(description || NOTE_PLACEHOLDER);

          // Save Google summary locally if found (debounced)
          if (description.trim() !== "") {
            debouncedUpsertNote(book.id, description);
          }
        }
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Failed to fetch book details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [book?.id, book?.title, book?.author, debouncedUpsertNote]);

  // Lazy load toggleFavourite only when needed
  const handleFavouriteClick = useCallback(async () => {
    setFavLoading(true);
    try {
      const { toggleFavourite } = await import("@/lib/detailActions");
      const newStatus = await toggleFavourite(book.id, favourite);
      setFavourite(newStatus);
    } catch (error) {
      alert(error.response?.data?.detail || error.message);
    } finally {
      setFavLoading(false);
    }
  }, [book.id, favourite]);

  // Lazy load updateBook only when editing
  const handleEditSubmit = useCallback(
    async (formData) => {
      try {
        const { updateBook } = await import("@/lib/detailActions");
        await updateBook(book, formData);
        alert("Book updated successfully!");
        setCurrentBook((prev) => ({ ...prev, ...formData }));
        setEditOpen(false);
      } catch (error) {
        alert(
          "Update failed: " + (error.response?.data?.detail || error.message)
        );
      }
    },
    [book]
  );

  // Lazy load upsertNote only when editing note (debounced)
  const handleNoteEdit = useCallback(
    async (noteText) => {
      try {
        if (!noteText.trim()) {
          // Delete empty note immediately
          await api.delete(`/notes/${currentBook.id}`);
          setSummary(NOTE_PLACEHOLDER);
        } else {
          // Save note with debounce
          setSummary(noteText);
          debouncedUpsertNote(currentBook.id, noteText);
        }
        setNoteOpen(false);
      } catch (err) {
        console.error("Error updating/deleting note: ", err);
      }
    },
    [currentBook.id, debouncedUpsertNote]
  );

  // Memoize "More books by this author"
  const moreBooksByAuthor = useMemo(() => {
    return books.filter((b) => b.id !== book.id);
  }, [books, book.id]);

  return (
    <Box
      sx={{
        width: { xs: "90%", sm: "85%", md: "80%", lg: "70%" },
        mx: "auto",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "flex-start",
        alignItems: { xs: "center", md: "flex-start" },
        gap: { xs: 2, md: 6 },
        py: "2rem",
      }}
    >
      {/* Left Box: Image + buttons */}
      <Box
        sx={{
          flex: { xs: "0 0 auto", md: "0 0 25%" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "sm",
          gap: 2,
        }}
      >
        <Grow
          in={Boolean(currentBook.image_path)}
          timeout={1000}
          style={{ transformOrigin: "center" }}
        >
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <BookImage
              apiUrl={apiUrl}
              image_path={currentBook.image_path}
              title={currentBook.title}
            />
          </Box>
        </Grow>

        {/* Two buttons stacked vertically */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mb: 2,
            width: "100%",
          }}
        >
          <BookActions
            book={currentBook}
            apiUrl={apiUrl}
            favourite={favourite}
            favLoading={favLoading}
            onFavouriteClick={handleFavouriteClick}
            onEditClick={() => setEditOpen(true)}
          />
        </Box>
      </Box>

      {/* Right Box: Title, author, summary + More books */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box>
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <BookSummary
              book={currentBook}
              summary={summary}
              onEditClicked={() => setNoteOpen(true)}
            />
          )}
        </Box>

        <Box>
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <BookCardList
              book_list={moreBooksByAuthor}
              section={[`More by ${currentBook.author}`, ""]}
              loading={loading}
            />
          )}
        </Box>
      </Box>

      {/* Edit Dialogs */}
      <EditBookForm
        book={currentBook}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSubmit}
      />

      <EditNoteForm
        note={summary ?? ""}
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        onSubmit={handleNoteEdit}
      />
    </Box>
  );
}
