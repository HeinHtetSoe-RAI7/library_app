// components/BookCardList.js
import { Box, Typography } from "@mui/material";

import BookCard from "@/components/BookCardList/BookCard";
import BookCardSkeleton from "@/components/BookCardList/BookCardSkeleton";

export default function BookCardList({
  book_list,
  section,
  loading,
  onAction,
}) {
  const skeletonCount = 5;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
        <Typography variant="h6" gutterBottom>
          {section[0]}
        </Typography>
        <Typography
          component="span"
          sx={{
            cursor: loading ? "not-allowed" : "pointer",
            color: loading ? "text.disabled" : "primary.main",
          }}
          onClick={() => !loading && onAction?.()}
        >
          {section[1]}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {loading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <BookCardSkeleton key={index} />
            ))
          : book_list.map((book) => <BookCard key={book.id} book={book} />)}
      </Box>
    </Box>
  );
}
