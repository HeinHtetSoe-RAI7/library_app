"use client";

import React, { createContext, useState, useEffect, useMemo } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { lightTheme, darkTheme } from "@/app/theme";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(null); // Initial state null
  const [isLoaded, setIsLoaded] = useState(false); // Track if state is loaded from localStorage
  const isSmall = useMediaQuery("(max-width:600px)");

  // Fetch the dark mode preference from localStorage only once
  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) {
      setIsDarkMode(stored === "true");
    } else {
      // Default to dark mode if no value exists
      setIsDarkMode(true); 
    }
    setIsLoaded(true); // Once the check is done, set the state to loaded
  }, []);

  // Save the dark mode preference to localStorage whenever it changes
  useEffect(() => {
    if (isDarkMode !== null) {
      localStorage.setItem("darkMode", isDarkMode);
    }
  }, [isDarkMode]);

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Memoized theme based on dark mode state
  const theme = useMemo(
    () => (isDarkMode ? darkTheme : lightTheme),
    [isDarkMode]
  );

  // Prevent rendering before state is loaded (avoid flicker)
  if (!isLoaded) {
    return null; // Or a loading spinner if you prefer
  }

  return (
    <GlobalContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        isSmall,
        theme,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
