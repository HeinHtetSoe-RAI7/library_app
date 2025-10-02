// home/page.js
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import api from "@/lib/axios";

import { Box } from "@mui/material";

import BookCardList from "@/components/BookCardList/BookCardList";
import SearchBar from "@/components/SearchBar";
import ErrorDialog from "@/components/ErrorDialog";
import ToggleButtons from "@/components/ToggleButtons";
import ErrorSnackbar from "@/components/ErrorSnackbar";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [recents, setRecents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanLoading, setScanLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const showRecents = useMemo(
    () => searchTerm === "" && recents.length > 0,
    [searchTerm, recents]
  );

  // Fetch books
  const fetchBooks = async (title = "") => {
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // delay
      if (title) {
        // Only search books when searching
        const res = await api.get(
          // `/books/search?title=${encodeURIComponent(title)}`
          "/books/search",
          { params: { title } }
        );
        setBooks(res.data.books || []);
      } else {
        // Fetch both books & recents on initial load
        const [booksRes, recentsRes] = await Promise.allSettled([
          api.get("/books/search"),
          api.get("/recents"),
        ]);

        const unauthorized =
          (booksRes.status === "rejected" &&
            booksRes.reason.response?.status === 401) ||
          (recentsRes.status === "rejected" &&
            recentsRes.reason.response?.status === 401);

        if (unauthorized) {
          setError("Unauthorized. Please sign in.");
        } else {
          // Books (required)
          if (booksRes.status === "fulfilled") {
            setBooks(booksRes.value.data.books || []);
          } else {
            setError("Failed to fetch books.");
            setBooks([]); // clears book list on error
          }

          // Recents (optional)
          if (recentsRes.status === "fulfilled") {
            setRecents(recentsRes.value.data.recent_books || []);
          } else {
            setRecents([]); // Just clear recents on failure
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all books on mount
  useEffect(() => {
    fetchBooks(""); // empty search to get all
  }, []);

  // Handle search submit
  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchBooks(term);
  };

  const handleScanBooks = useCallback(async () => {
    if (scanLoading) return;
    setScanLoading(true);

    try {
      const { scanBooks } = await import("@/lib/bookActions");
      const message = await scanBooks();
      setSnackbarMessage(message);
      fetchBooks(""); // refresh books
    } catch (err) {
      setError("Failed to scan books: " + err);
    } finally {
      setScanLoading(false);
    }
  }, [scanLoading]);

  const handleClearRecents = useCallback(async () => {
    try {
      const { clearAllRecents } = await import("@/lib/bookActions");
      const message = await clearAllRecents();
      if (message) {
        setRecents([]);
        setSnackbarMessage(message);
      }
    } catch (err) {
      setError("Failed to clear recent books: " + err);
    }
  }, []);

  if (error) {
    return <ErrorDialog errorMessage={error}></ErrorDialog>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        minHeight: "100vh",
        gap: 2,
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <SearchBar onSearch={handleSearch} />
        <ToggleButtons />
      </Box>

      {/* Hide recents while searching or if recents is empty */}
      {/* {searchTerm === "" && recents.length > 0 && ( */}
      {showRecents && (
        <BookCardList
          section={["Recents", "Clear all"]}
          book_list={recents}
          loading={loading}
          onAction={handleClearRecents}
        />
      )}

      {/* My books list */}
      <BookCardList
        section={["My Books", scanLoading ? "Scanning..." : "Scan books"]}
        book_list={books}
        loading={loading}
        onAction={() => {
          if (!scanLoading) handleScanBooks();
        }}
      />
    </Box>
  );
}
