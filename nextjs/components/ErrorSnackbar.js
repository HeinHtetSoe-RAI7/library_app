// components/ErrorSnackbar.js
"use client";

import React, { useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";

const ErrorSnackbar = ({ error, setError, isSuccess = false }) => {
  useEffect(() => {
    if (error) {
      // Automatically hide the snackbar after 3 seconds
      const timer = setTimeout(() => {
        setError(""); // Clear the error message after 3 seconds
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  return (
    <Snackbar
      open={Boolean(error)}
      autoHideDuration={3000}
      onClose={() => setError("")}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={() => setError("")}
        severity={isSuccess ? "success" : "error"} // Show success or error
        sx={{ width: "100%" }}
      >
        {error}
      </Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar;
