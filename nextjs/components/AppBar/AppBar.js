import { useContext } from "react";
import { AppBar, Toolbar, Divider, Typography } from "@mui/material";

import ImportContacts from "@mui/icons-material/ImportContacts";
import DarkModeSwitch from "./DarkModeSwitch";
import ProfileMenu from "@/components/AppBar/ProfileMenu";
import NavigationButtons from "@/components/AppBar/AppBarNavigation";

import { AuthContext } from "@/contexts/AuthContext";
import { GlobalContext } from "@/contexts/GlobalContext";

export default function TopAppBar() {
  const { isLoggedIn, username, logout } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode, isSmall } = useContext(GlobalContext);

  return (
    <AppBar position="sticky" elevation={1} color="secondary">
      <Toolbar>
        {/* Logo */}
        <ImportContacts sx={{ mr: 2 }} />

        {/* Title */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          စာအုပ်စင်
        </Typography>

        {/* Show navigation buttons for large screens */}
        {!isSmall && (
          <>
            <NavigationButtons />
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ mx: 1, my: 2 }}
            />
          </>
        )}

        {/* DarkMode Switch */}
        <DarkModeSwitch checked={isDarkMode} onChange={toggleDarkMode} />

        {/* Profile menu for logged-in users */}
        {!!isLoggedIn && <ProfileMenu username={username} logout={logout} />}
      </Toolbar>
    </AppBar>
  );
}
