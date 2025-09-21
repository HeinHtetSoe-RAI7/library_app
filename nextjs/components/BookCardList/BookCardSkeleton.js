import React from "react";
import { Card, CardContent, Skeleton, Box } from "@mui/material";
import { CARD_WIDTH, CARD_HEIGHT, IMAGE_HEIGHT } from "./BookCard";

const BookCardSkeleton = () => (
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
    <Skeleton
      variant="rectangular"
      sx={{
        height: IMAGE_HEIGHT,
        borderRadius: 0,
        width: "100%",
      }}
    />
    <CardContent sx={{ p: 1 }}>
      <Skeleton variant="text" sx={{ width: "80%", mb: 1 }} />
      <Skeleton variant="text" sx={{ width: "60%" }} />
    </CardContent>
  </Card>
);

export default BookCardSkeleton;