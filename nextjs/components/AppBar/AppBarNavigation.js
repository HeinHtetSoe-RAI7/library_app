import { useRouter, usePathname } from "next/navigation";
import { Box, Button, useTheme } from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InfoIcon from "@mui/icons-material/Info";

// Navigation items
const navItems = [
  { label: "HOME", href: "/home", icon: <HomeIcon /> },
  { label: "FAVOURITES", href: "/favourites", icon: <FavoriteIcon /> },
  { label: "ABOUT", href: "/about", icon: <InfoIcon /> },
];

export default function NavigationButtons() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href; // current route
          return (
            <Button
              key={item.label}
              color={isActive ? "primary" : "inherit"} // highlight active
              onClick={() => router.push(item.href)}
              sx={{
                ml: 1,
                borderBottom: isActive
                  ? `2px solid ${theme.palette.primary.main}`
                  : "2px solid transparent",
                borderRadius: 0,
                textTransform: "none",
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </Box>
    </>
  );
}

export { navItems };
