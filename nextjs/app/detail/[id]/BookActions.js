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
      <ButtonGroup
        variant="contained"
        aria-label="read and favourite"
        fullWidth
        disableElevation
        sx={{
          width: "100%",
          "& .MuiButtonGroup-grouped": {
            flex: "unset",
          },
        }}
      >
        <Button sx={{ flex: "0 0 80%" }} onClick={handleReadClick}>
          Read
        </Button>
        <IconButton
          variant="outlined"
          sx={{ flex: "0 0 20%" }}
          color={favourite ? "error" : "primary"}
          onClick={onFavouriteClick}
          aria-label={
            favourite ? "Remove from favourites" : "Add to favourites"
          }
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
      </ButtonGroup>
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        startIcon={<EditNoteOutlinedIcon />}
        onClick={onEditClick}
      >
        Edit
      </Button>
    </Box>
  );
}
