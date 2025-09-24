// detail/[id]/DetailPage.js
"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";

import api from "@/lib/axios";

import { Box, Collapse, Typography, Grow } from "@mui/material";
import BookCardList from "@/components/BookCardList/BookCardList";
import EditBookForm from "@/components/EditBookForm";
import BookImage from "./BookImage";
import BookActions from "./BookActions";
import BookSummary from "./BookSummary";
import EditNoteForm from "@/components/EditNoteForm";

export default function BookDetail({ book }) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

  const [currentBook, setCurrentBook] = useState(book);
  const [books, setBooks] = useState([]);
  const [authorLoading, setAuthorLoading] = useState(true);
  const [authorError, setAuthorError] = useState(null);
  const [favourite, setFavourite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [editOpen, setEditOpen] = useState(false);

  // Check favourite status
  useEffect(() => {
    if (!book?.id) return;
    const checkFavourite = async () => {
      try {
        const response = await api.get(`/is_favourite/${book.id}`);
        setFavourite(response.data.is_favourite);
      } catch (err) {
        console.error("Error checking favourite status", err);
      }
    };
    checkFavourite();
  }, [book?.id]);

  // Fetch books by author
  useEffect(() => {
    if (!book?.author) return;
    setAuthorLoading(true);
    const fetchBooksByAuthor = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const response = await api.get(
          `/filter?author=${encodeURIComponent(book.author)}`
        );
        setBooks(response.data.books || []);
      } catch (err) {
        setAuthorError("Error fetching books by author");
      } finally {
        setAuthorLoading(false);
      }
    };
    fetchBooksByAuthor();
  }, [book?.author]);

  // Memoize more books by author (excluding current book)
  const moreBooksByAuthor = useMemo(() => {
    return books.filter((b) => b.id !== book.id);
  }, [books, book.id]);

  // useEffect(() => {
  //   async function fetchSummary() {
  //     try {
  //       const query = `intitle:${book.title
  //         .toLowerCase()
  //         .split(" ")
  //         .join("+")}`;
  //       const res = await axios.get(
  //         `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`
  //       );

  //       const firstBook = res.data.items?.[0];
  //       const description =
  //         firstBook?.volumeInfo?.description ||
  //         firstBook?.searchInfo?.textSnippet ||
  //         "No summary available";

  //       setSummary(description);
  //     } catch (err) {
  //       setSummary("Error fetching summary");
  //     }
  //   }

  //   if (book.title) {
  //     fetchSummary();
  //   }
  // }, [book.title]);

  useEffect(() => {
    async function fetchNote() {
      if (!book?.id) return;

      const NOTE_PLACEHOLDER = "No note available";

      try {
        const res = await api.get(`/notes/${book.id}`);
        setSummary(res.data.note ?? "");
      } catch (err) {
        if (err.response?.status === 404) {
          setSummary(NOTE_PLACEHOLDER);
        } else {
          setSummary(NOTE_PLACEHOLDER);
          console.error("Error fetching note:", err);
        }
      }
    }

    fetchNote();
  }, [book?.id]);

  // 🔹 Lazy load toggleFavourite only when needed
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

  // 🔹 Lazy load updateBook only when editing
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

  // 🔹 Lazy load upsertNote only when editing note
  const handleNoteEdit = useCallback(
    async (noteText) => {
      try {
        if (!noteText.trim()) {
          // If note is empty or only spaces, delete it
          await api.delete(`/notes/${currentBook.id}`);
          setSummary(""); // clear local state
          alert("Note deleted successfully!");
        } else {
          // Otherwise upsert
          const { upsertNote } = await import("@/lib/detailActions");
          const savedNote = await upsertNote(currentBook.id, noteText);
          setSummary(savedNote.note); // update local state
          alert("Note saved successfully!");
        }
        setEditOpen(false); // close dialog
      } catch (err) {
        console.error("Error updating/deleting note:", err);
        alert("Failed to update or delete note.");
      }
    },
    [currentBook.id]
  );

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
        {/* Title, Author, Summary */}
        <Collapse in={summary != ""} timeout={1500}>
          <Box>
            <BookSummary book={currentBook} summary={summary} />
          </Box>
        </Collapse>
        <Box>
          {authorError ? (
            <Typography color="error">{authorError}</Typography>
          ) : (
            <BookCardList
              book_list={moreBooksByAuthor}
              section={[`More by ${currentBook.author}`, ""]}
              loading={authorLoading}
            />
          )}
        </Box>
      </Box>

      {/* Edit Dialog */}
      {/* <EditBookForm
        book={currentBook}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSubmit}
      /> */}

      <EditNoteForm
        note={summary ?? ""}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleNoteEdit}
      />
    </Box>
  );
}
