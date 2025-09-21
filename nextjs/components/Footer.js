import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ width: "100%", py: 2, display: "flex", justifyContent: "center" }}>
      <Typography variant="body2" align="center">
        © {new Date().getFullYear()} My Book App. All rights reserved.
      </Typography>
    </Box>
  );
}