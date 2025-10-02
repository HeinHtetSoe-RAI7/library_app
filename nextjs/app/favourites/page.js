"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";

import { Box } from "@mui/material";

import BookCardList from "@/components/BookCardList/BookCardList";
import ErrorDialog from "@/components/ErrorDialog";
import ErrorSnackbar from "@/components/ErrorSnackbar";

function FavouriteBookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Fetch favourite books on mount
  useEffect(() => {
    const fetchFavourites = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const res = await api.get("/favourites");
        setBooks(res.data.favourite_books || []);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Unauthorized. Please sign in.");
        } else {
          setError("Failed to fetch favourite books.");
        }
        setBooks([]); // Clear books on error
      } finally {
        setLoading(false);
      }
    };
    fetchFavourites();
  }, []);

  const handleClearFavourites = useCallback(async () => {
    try {
      const { clearFavourites } = await import("@/lib/bookActions");
      const message = await clearFavourites();
      if (message) {
        setBooks([]);
        setSnackbarMessage(message);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to clear favourite books.");
    }
  }, []);

  if (error) {
    return <ErrorDialog errorMessage={error}></ErrorDialog>;
  }

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        px: {
          xs: "1rem", // mobile
          sm: "2rem", // tablet
          md: "3rem", // laptop
          lg: "4rem", // large desktop
          xl: "5rem", // extra wide screens
        },
        py: "1rem",
      }}
    >
      <ErrorSnackbar
        error={snackbarMessage}
        setError={setSnackbarMessage}
        isSuccess={true}
      ></ErrorSnackbar>
      <Box sx={{ mb: "1rem" }}>
        <BookCardList
          section={["Favourites", "Remove all"]}
          book_list={books}
          loading={loading}
          onAction={handleClearFavourites}
        />
      </Box>
    </Box>
  );
}

export default FavouriteBookList;
