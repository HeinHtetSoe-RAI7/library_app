"use client";

import { createTheme } from "@mui/material/styles";

// const lightTheme = createTheme({
//   palette: {
//     mode: "light",
//     primary: {
//       main: "#000000", // primary color: black
//       light: "#333333", // lighter shade of black (gray)
//       dark: "#000000", // darker shade of black (still black)
//       contrastText: "#ffffff", // text on primary background (white)
//     },
//     secondary: {
//       main: "#ffffff", // secondary color: white
//       contrastText: "#000000", // text on secondary background (black)
//     },
//     background: {
//       default: "#ffffff", // general page background (white)
//       paper: "#f5f5f5", // surfaces: cards, dialogs, sheets (light gray)
//     },
//     text: {
//       primary: "#000000", // primary text color: black
//       secondary: "#444444", // secondary text color: dark gray
//     },
//     typography: {
//       fontFamily: "SansPro",
//       h4: { fontWeight: "bold" },
//       h5: { fontWeight: "bold" },
//       h6: { fontWeight: "bold" },
//     },
//   },
// });

// const darkTheme = createTheme({
//   palette: {
//     mode: "dark",
//     primary: {
//       main: "#635985", // Light gray shade
//       light: "#9e9e9e", // Slightly lighter gray
//       dark: "#3c3c3c", // Darker gray, almost charcoal
//       contrastText: "#ffffff", // White for text contrast
//     },
//     secondary: {
//       main: "#393053", // Medium gray as the accent color
//       contrastText: "#ffffff", // White for contrast
//     },
//     background: {
//       default: "#121212", // Main background (dark gray)
//       paper: "#1e1e1e", // Darker background for paper/elements
//     },
//     text: {
//       primary: "#ffffffff", // Primary text in white for contrast
//       secondary: "#b0b0b0", // Slightly lighter gray for secondary text
//     },
//     // typography,
//   },
// });

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000000",
      light: "#333333",
      dark: "#000000",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ffffff",
      contrastText: "#000000",
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
    text: {
      primary: "#000000",
      secondary: "#444444",
    },
  },
  typography: {
    fontFamily: "Roboto, SansPro",
    h1: { fontWeight: 700, fontSize: "6rem", lineHeight: 1.167 },
    h2: { fontWeight: 700, fontSize: "3.75rem", lineHeight: 1.2 },
    h3: { fontWeight: 700, fontSize: "3rem", lineHeight: 1.167 },
    h4: { fontWeight: "bold", fontSize: "2.125rem", lineHeight: 1.235 },
    h5: { fontWeight: "bold", fontSize: "1.5rem", lineHeight: 1.334 },
    h6: { fontWeight: "bold", fontSize: "1.25rem", lineHeight: 1.6 },
    subtitle1: { fontSize: "1rem", lineHeight: 1.75 },
    subtitle2: { fontSize: "0.875rem", lineHeight: 1.57 },
    body1: { fontSize: "1rem", lineHeight: 1.5 },
    body2: { fontSize: "0.875rem", lineHeight: 1.43 },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      textTransform: "uppercase",
    },
    caption: { fontSize: "0.75rem", lineHeight: 1.66 },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 400,
      textTransform: "uppercase",
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
  zIndex: {
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#635985",
      light: "#9e9e9e",
      dark: "#3c3c3c",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#393053",
      contrastText: "#ffffff",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
  },
  typography: {
    fontFamily: "Roboto, SansPro",
    h1: { fontWeight: 700, fontSize: "6rem", lineHeight: 1.167 },
    h2: { fontWeight: 700, fontSize: "3.75rem", lineHeight: 1.2 },
    h3: { fontWeight: 700, fontSize: "3rem", lineHeight: 1.167 },
    h4: { fontWeight: "bold", fontSize: "2.125rem", lineHeight: 1.235 },
    h5: { fontWeight: "bold", fontSize: "1.5rem", lineHeight: 1.334 },
    h6: { fontWeight: "bold", fontSize: "1.25rem", lineHeight: 1.6 },
    subtitle1: { fontSize: "1rem", lineHeight: 1.75 },
    subtitle2: { fontSize: "0.875rem", lineHeight: 1.57 },
    body1: { fontSize: "1rem", lineHeight: 1.5 },
    body2: { fontSize: "0.875rem", lineHeight: 1.43 },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      textTransform: "uppercase",
    },
    caption: { fontSize: "0.75rem", lineHeight: 1.66 },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 400,
      textTransform: "uppercase",
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
  zIndex: {
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
  },
});

export { lightTheme, darkTheme };
