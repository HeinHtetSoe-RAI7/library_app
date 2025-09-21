"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { Box } from "@mui/material";
import BookCardList from "@/components/BookCardList/BookCardList";
import ErrorDialog from "@/components/ErrorDialog";

function FavouriteBookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch favourite books on mount
  useEffect(() => {
    const fetchFavourites = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const res = await api.get("/favourite_books");
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
      const result = await clearFavourites();
      if (result) setBooks([]);
    } catch (err) {
      console.error(err);
      setError("Failed to clear favourite books.");
    }
  }, []);

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        px: {
          xs: "1rem", // mobile
          sm: "2rem", // tablet
          md: "2rem", // laptop
          lg: "4rem", // large desktop
          xl: "5rem", // extra wide screens
        },
        py: "1rem",
      }}
    >
      {error && <ErrorDialog errorMessage={error}></ErrorDialog>}
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
