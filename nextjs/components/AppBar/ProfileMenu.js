// components/ProfileMenu.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

import {
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";

export default function ProfileMenu({ username, logout }) {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
    router.push("/signin");
  };

  const handleDeleteAccount = async () => {
    handleClose();
    if (
      !confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await api.delete("/delete_account");
      logout();
      router.push("/signin");
    } catch (err) {
      console.error("Error deleting account:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="profile-menu"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        disableScrollLock
      >
        {/* Username (non-clickable) */}
        {username && (
          <MenuItem disabled dense sx={{ pointerEvents: "none" }}>
            <ListItemText
              primary={username}
              primaryTypographyProps={{ variant: "subtitle1" }}
            />
          </MenuItem>
        )}

        <Divider />

        {/* Logout */}
        <MenuItem onClick={handleLogout} dense>
          Log Out
        </MenuItem>

        {/* Delete Account */}
        <MenuItem
          onClick={handleDeleteAccount}
          disabled={loading}
          sx={{ color: "error.main" }}
          dense
        >
          {loading ? <CircularProgress size={20} /> : "Delete Account"}
        </MenuItem>
      </Menu>
    </>
  );
}
