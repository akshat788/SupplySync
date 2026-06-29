import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box, IconButton, AppBar, Toolbar, Typography,
  useMediaQuery, useTheme, Drawer, Avatar, Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import { getCleanName } from "../utils/sanitize";
import logo from "../assets/logo.png";

const DRAWER_WIDTH = 240;

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const rolePathMap = {
    admin: "/admin",
    supplier: "/supplier",
    warehouse_manager: "/warehouse",
    retailer: "/retailer",
  };

  const handleProfileClick = () => {
    const base = rolePathMap[user?.role] || "";
    navigate(`${base}/profile`);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "background.default" }}>
      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar position="fixed" sx={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          boxShadow: "none",
          borderBottom: "1px solid #e2e8f0",
        }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton color="default" edge="start" onClick={handleDrawerToggle} sx={{ mr: 1, color: "text.primary" }}>
                <MenuIcon />
              </IconButton>
              <img src={logo} alt="SupplySync" style={{ height: 26, marginRight: 8, filter: "drop-shadow(0 0 6px rgba(99,102,241,0.3))" }} />
              <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ fontFamily: "'Outfit', sans-serif" }}>
                SupplySync
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <NotificationBell />
              <Tooltip title="My Profile">
                <IconButton onClick={handleProfileClick}>
                  <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: "secondary.main", color: "#fff", fontWeight: "bold" }}>
                    {getCleanName(user)?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Desktop top bar (slim) */}
      {!isMobile && (
        <AppBar position="fixed" sx={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          zIndex: theme.zIndex.drawer + 1,
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          ml: `${DRAWER_WIDTH}px`,
          boxShadow: "none",
          borderBottom: "1px solid #e2e8f0",
        }}>
          <Toolbar sx={{ justifyContent: "flex-end", minHeight: "56px !important" }}>
            <NotificationBell />
            <Tooltip title="My Profile">
              <IconButton onClick={handleProfileClick} sx={{ ml: 1 }}>
                <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: "secondary.main", color: "#fff", fontWeight: "bold" }}>
                  {getCleanName(user)?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" } }}
        >
          <Sidebar onClose={handleDrawerToggle} />
        </Drawer>
      ) : (
        <Box sx={{ width: DRAWER_WIDTH, flexShrink: 0 }}>
          <Box sx={{ position: "fixed", top: 0, left: 0, width: DRAWER_WIDTH, height: "100vh", zIndex: theme.zIndex.drawer }}>
            <Sidebar />
          </Box>
        </Box>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 3, sm: 4, md: 5 },
          mt: isMobile ? 8 : 7,
          overflow: "auto",
          minWidth: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
