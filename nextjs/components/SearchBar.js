"use client";

import React, { useState } from "react";
import { Paper, InputBase, IconButton } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(input.trim());
  };

  const handleClear = () => {
    setInput("");
    if (onSearch) onSearch(""); // Show all books
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      variant="outlined"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: { xs: 225, sm: 300, md: 400 },
        my: 2,
      }}
    >
      <InputBase
        id="search-input"
        name="search"
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search"
        inputProps={{ "aria-label": "search books" }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {input && (
        <IconButton
          id="clear-search"
          name="clear-search"
          sx={{ p: "10px" }}
          aria-label="clear"
          onClick={handleClear}
        >
          <ClearIcon />
        </IconButton>
      )}
      <IconButton
        id="submit-search"
        name="submit-search"
        type="submit"
        sx={{ p: "10px" }}
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
