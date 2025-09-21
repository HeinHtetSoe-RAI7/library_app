// components/BookCard.js
import React from "react";
import Link from "next/link";

import { Card, CardMedia, CardContent, Box, Typography } from "@mui/material";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Responsive size constants
const CARD_WIDTH = { xs: 110, sm: 120, md: 140, lg: 160 };
const CARD_HEIGHT = { xs: 220, sm: 240, md: 265, lg: 300 };
const IMAGE_HEIGHT = { xs: 145, sm: 165, md: 190, lg: 225 };

const BookCard = ({ book }) => {
  return (
    <Link href={`/detail/${book.id}`} passHref>
      <Card
        variant="outlined"
        sx={{
          cursor: "pointer",
          flexShrink: 0,
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Book Cover */}
        {book.image_path ? (
          <CardMedia
            component="img"
            sx={{
              height: IMAGE_HEIGHT,
              objectFit: "cover",
            }}
            image={
              book.image_path.startsWith("http")
                ? book.image_path
                : `${apiUrl}${book.image_path}`
            }
            alt={book.title || "Book image"}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "";
            }}
          />
        ) : (
          <Box
            sx={{
              height: IMAGE_HEIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "background.paper",
            }}
          >
            <ImageNotSupportedIcon sx={{ fontSize: 48, color: "grey.800" }} />
          </Box>
        )}

        {/* Title + Author */}
        <CardContent sx={{ p: 1 }}>
          <Typography
            variant="subtitle1"
            noWrap
            gutterBottom
            title={book.title}
          >
            {book.title}
          </Typography>
          {book.author && (
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              gutterBottom
              title={book.author}
            >
              {book.author}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export { CARD_WIDTH, CARD_HEIGHT, IMAGE_HEIGHT };
export default BookCard;
