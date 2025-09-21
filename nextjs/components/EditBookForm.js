// components/EditBookForm.js
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Stack,
  TextField,
} from "@mui/material";

export default function EditBookForm({ book, open, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: book.title || "",
    author: book.author || "",
    year: book.year || "",
    image_path: book.image_path || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="edit-book-dialog-title"
    >
      <DialogTitle id="edit-book-dialog-title" sx={{ pt: 3, pb: 2 }}>
        Edit Book Details
      </DialogTitle>

      <DialogContent dividers>
        <form id="edit-book-form" onSubmit={handleSave}>
          <Stack spacing={2}>
            <TextField
              label="Title"
              name="title"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={handleChange}
              required
              autoFocus
            />
            <TextField
              label="Author"
              name="author"
              fullWidth
              variant="outlined"
              value={formData.author}
              onChange={handleChange}
              required
            />
            <TextField
              label="Year"
              name="year"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.year}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Image Path"
              name="image_path"
              fullWidth
              variant="outlined"
              value={formData.image_path}
              onChange={handleChange}
            />
          </Stack>
        </form>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", pt: 2, pb: 3, px: 3 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={onClose}
          sx={{ width: 100 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ width: 100 }}
          type="submit"
          form="edit-book-form"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
