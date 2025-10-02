// BookActions.js
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  CircularProgress,
} from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";

export default function BookActions({
  book,
  apiUrl,
  favourite,
  favLoading,
  onFavouriteClick,
  onEditClick,
}) {
  const handleReadClick = async () => {
    try {
      const { addToRecent } = await import("@/lib/detailActions");
      await addToRecent(book.id);

      window.open(
        `${apiUrl}${book.book_link}`,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (err) {
      console.error("Error handling read click:", err);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        // maxWidth: 280,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Read + Favourite row */}
      <Box sx={{ display: "flex", width: "100%" }}>
        <Button
          variant="contained"
          sx={{ flex: 1, mr: 1 }}
          onClick={handleReadClick}
        >
          Read
        </Button>
        <IconButton
          // sx={{ flex: "0 0 20%" }}
          color={favourite ? "error" : "primary"}
          onClick={onFavouriteClick}
          disabled={favLoading}
        >
          {favLoading ? (
            <CircularProgress size={24} />
          ) : favourite ? (
            <FavoriteOutlinedIcon />
          ) : (
            <FavoriteBorderOutlinedIcon />
          )}
        </IconButton>
      </Box>

      {/* Edit button below, full width */}
      <Button
        fullWidth
        variant="outlined"
        color="primary"
        startIcon={<EditNoteOutlinedIcon />}
        onClick={onEditClick}
      >
        Edit
      </Button>
    </Box>
  );
}
