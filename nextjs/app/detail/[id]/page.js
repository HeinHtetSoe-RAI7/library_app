// detail/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BookDetail from "./DetailPage";
import api from "@/lib/axios";
import { CircularProgress, Typography, Box } from "@mui/material";

export default function BookDetailPage() {
  const params = useParams();
  const id = params.id;

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const response = await api.get(`/book/${id}`);
        setBook(response.data.book_detail);
      } catch (err) {
        setError("Failed to fetch book");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  if (loading || error || !book) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading && <CircularProgress size={64} />}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && !book && (
          <Typography color="text.secondary">Book not found.</Typography>
        )}
      </Box>
    );
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
        py: "2rem",
      }}
    >
      <BookDetail book={book} />
    </Box>
  );
}
