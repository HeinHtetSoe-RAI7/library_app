// components/ErrorDialog.js
"use client";

import React from "react";
import { Box, Paper, Alert, AlertTitle, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Link from "next/link";

export default function ErrorDialog({ errorMessage }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: `calc(100vh - 64px)`,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: "sm",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Alert
          severity="error"
          icon={<ErrorOutlineIcon fontSize="inherit" />}
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <AlertTitle sx={{ mb: 1 }}>Something went wrong</AlertTitle>
          <Box sx={{ mb: 3 }}>{errorMessage}</Box>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            href="/signin"
          >
            Sign In
          </Button>
        </Alert>
      </Paper>
    </Box>
  );
}
