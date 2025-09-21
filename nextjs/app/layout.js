"use client";

import { AuthContext, AuthProvider } from "@/contexts/AuthContext";
import { GlobalProvider, GlobalContext } from "@/contexts/GlobalContext";

import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import { ThemeProvider, CssBaseline } from "@mui/material";

import TopAppBar from "@/components/AppBar/AppBar";
import BottomNav from "@/components/BottomNavigation";
import Footer from "@/components/Footer";

const SansPro = localFont({
  src: [{ path: "./fonts/sans_pro.ttf", style: "normal" }],
});

const Sagar = localFont({
  src: [{ path: "./fonts/sagar.ttf", style: "normal" }],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${SansPro.className} ${Sagar.className}`}
      >
        <GlobalProvider>
          <AuthProvider>
            <AuthContext.Consumer>
              {({ isLoggedIn }) => (
                <GlobalContext.Consumer>
                  {({ isSmall, theme }) => (
                    <ThemeProvider theme={theme}>
                      <TopAppBar />
                      {children}
                      <Footer />
                      {!!isLoggedIn && isSmall && <BottomNav />}
                      <CssBaseline />
                    </ThemeProvider>
                  )}
                </GlobalContext.Consumer>
              )}
            </AuthContext.Consumer>
          </AuthProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}
