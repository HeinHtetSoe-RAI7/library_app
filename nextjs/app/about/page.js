"use client";

import {
  Container,
  Typography,
  Grow,
  Paper,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Grow in={true} timeout={1000} style={{ transformOrigin: "center" }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 1 }}>
          <Stack spacing={2}>
            {/* Title */}
            <Typography variant="h3" component="h1">
              About This Project
            </Typography>

            {/* Description */}
            <Typography variant="body1" color="text.secondary">
              This project is a modern library management system built with
              Next.js and Material-UI. It allows users to browse, search, and
              manage a collection of books in a clean and responsive interface.
            </Typography>

            <Divider />

            {/* Features */}
            <Typography variant="h5" component="h2">
              Features
            </Typography>
            <List disablePadding>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText primary="Browse a list of books with details such as title, author, and description." />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText primary="Search for books by title or author." />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText primary="View detailed information about each book." />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText primary="Responsive design for optimal viewing on all devices." />
              </ListItem>
            </List>

            <Divider />

            {/* Technologies */}
            <Typography variant="h5" component="h2">
              Technologies Used
            </Typography>
            <List disablePadding>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText primary="Next.js - React framework for SSR and static sites." />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText primary="Material-UI - Modern React UI framework." />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText primary="React - JavaScript library for building UI." />
              </ListItem>
            </List>
          </Stack>
        </Paper>
      </Grow>
    </Container>
  );
}
