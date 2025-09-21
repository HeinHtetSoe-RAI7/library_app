// detail/[id]/DetailPage.js
"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";

import api from "@/lib/axios";
import axios from "axios";

import { Box, Collapse, Typography, Grow } from "@mui/material";
import BookCardList from "@/components/BookCardList/BookCardList";
import EditBookForm from "@/components/EditBookForm";
import BookImage from "./BookImage";
import BookActions from "./BookActions";
import BookSummary from "./BookSummary";

export default function BookDetail({ book }) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`;
  const [currentBook, setCurrentBook] = useState(book);
  const [books, setBooks] = useState([]);
  const [authorLoading, setAuthorLoading] = useState(true);
  const [authorError, setAuthorError] = useState(null);
  const [favourite, setFavourite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [summary, setSummary] = useState(null);
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

  useEffect(() => {
    async function fetchSummary() {
      try {
        const query = `intitle:${book.title
          .toLowerCase()
          .split(" ")
          .join("+")}`;
        const res = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`
        );

        const firstBook = res.data.items?.[0];
        const description =
          firstBook?.volumeInfo?.description ||
          firstBook?.searchInfo?.textSnippet ||
          "No summary available";

        setSummary(description);
      } catch (err) {
        setSummary("Error fetching summary");
      }
    }

    if (book.title) {
      fetchSummary();
    }
  }, [book.title]);

  // 🔹 Lazy load toggleFavourite only when needed
  const handleFavouriteClick = useCallback(async () => {
    setFavLoading(true);
    try {
      const { toggleFavourite } = await import("@/lib/detailActions");
      const newStatus = await toggleFavourite(book.id, favourite);
      setFavourite(newStatus);
    } catch (error) {
      alert(
        "Favourite failed: " + (error.response?.data?.detail || error.message)
      );
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

  // // Handle favourite button click
  // const handleFavouriteClick = async () => {
  //   setFavLoading(true);
  //   try {
  //     if (!favourite) {
  //       await api.post("/add_favourite", { book_id: book.id });
  //       setFavourite(true);
  //     } else {
  //       await api.delete(`/remove_favourite/${book.id}`);
  //       setFavourite(false);
  //     }
  //   } catch (error) {
  //     alert(
  //       "Favourite failed: " + (error.response?.data?.detail || error.message)
  //     );
  //   } finally {
  //     setFavLoading(false);
  //   }
  // };

  // const handleEditSubmit = async (formData) => {
  //   const payload = {
  //     book_id: book.id,
  //     book_link: book.book_link,
  //     title: formData.title,
  //     author: formData.author,
  //     year: formData.year ? Number(formData.year) : undefined,
  //     image_path: formData.image_path,
  //   };
  //   try {
  //     const res = await api.post("/update", payload, {
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     alert("Book updated successfully!");
  //     setCurrentBook((prev) => ({ ...prev, ...formData }));
  //     setEditOpen(false);
  //   } catch (error) {
  //     alert(
  //       "Update failed: " + (error.response?.data?.detail || error.message)
  //     );
  //   }
  // };

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
        <Collapse in={Boolean(summary)} timeout={1500}>
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
      <EditBookForm
        book={currentBook}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSubmit}
      />
    </Box>
  );
}
