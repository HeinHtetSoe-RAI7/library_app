// components/BottomNavigation.js
import { usePathname, useRouter } from "next/navigation";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { navItems } from "./AppBar/AppBarNavigation";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  // Determine selected index
  const selectedIndex = navItems.findIndex(
    (item) =>
      // pathname.startsWith(item.href)
      pathname === item.href
  );

  const handleChange = (event, newValue) => {
    router.push(navItems[newValue].href);
  };

  return (
    <BottomNavigation
      value={selectedIndex >= 0 ? selectedIndex : 0}
      onChange={handleChange}
      showLabels
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        boxShadow: 4,
      }}
    >
      {navItems.map((item, index) => (
        <BottomNavigationAction
          key={item.label}
          label={item.label}
          showLabel={selectedIndex === index}
          icon={item.icon}
          sx={{
            color:
              pathname === item.href
                ? "primary.main" // active color
                : "text.secondary", // inactive color
          }}
        />
      ))}
    </BottomNavigation>
  );
}
