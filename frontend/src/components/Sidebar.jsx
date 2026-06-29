import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { getCleanName } from "../utils/sanitize";
import logo from "../assets/logo.png";
import {
  List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, Box, Divider, Avatar,
  useMediaQuery, useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CategoryIcon from "@mui/icons-material/Category";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

const menuItems = {
  admin: [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Suppliers", icon: <LocalShippingIcon />, path: "/admin/suppliers" },
    { text: "Products", icon: <CategoryIcon />, path: "/admin/products" },
    { text: "Inventory", icon: <InventoryIcon />, path: "/admin/inventory" },
    { text: "Purchase Orders", icon: <ShoppingCartIcon />, path: "/admin/purchase-orders" },
    { text: "Orders", icon: <StorefrontIcon />, path: "/admin/orders" },
    { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "Analytics", icon: <BarChartIcon />, path: "/admin/analytics" },
    { text: "SC Tracking", icon: <TrackChangesIcon />, path: "/admin/tracking" },
  ],
  supplier: [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/supplier/dashboard" },
    { text: "Products", icon: <CategoryIcon />, path: "/supplier/products" },
    { text: "Purchase Orders", icon: <ShoppingCartIcon />, path: "/supplier/purchase-orders" },
  ],
  warehouse_manager: [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/warehouse/dashboard" },
    { text: "Products", icon: <CategoryIcon />, path: "/warehouse/products" },
    { text: "Inventory", icon: <InventoryIcon />, path: "/warehouse/inventory" },
    { text: "Purchase Orders", icon: <ShoppingCartIcon />, path: "/warehouse/purchase-orders" },
    { text: "Orders", icon: <StorefrontIcon />, path: "/warehouse/orders" },
    { text: "Transactions", icon: <ReceiptLongIcon />, path: "/warehouse/transactions" },
  ],
  retailer: [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/retailer/dashboard" },
    { text: "Products", icon: <CategoryIcon />, path: "/retailer/products" },
    { text: "My Orders", icon: <ShoppingCartIcon />, path: "/retailer/orders" },
  ],
};

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const items = menuItems[user?.role] || [];

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile && onClose) onClose();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Box sx={{
      width: 240, height: "100vh",
      background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)",
      color: "#fff", display: "flex", flexDirection: "column",
      borderRight: "1px solid rgba(255, 255, 255, 0.08)",
    }}>
      {/* Logo */}
      <Box sx={{ p: 2.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 1, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <img src={logo} alt="SupplySync" style={{ height: 28, filter: "drop-shadow(0 0 6px rgba(99,102,241,0.4))" }} />
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="h6" fontWeight="bold" color="secondary.light" sx={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "0.5px", lineHeight: 1.2 }}>
            SupplySync
          </Typography>
          <Typography variant="caption" color="rgba(255, 255, 255, 0.5)" sx={{ display: "block", fontSize: "10px" }}>Supply Made Easy</Typography>
        </Box>
      </Box>

      {/* User Info */}
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <Avatar sx={{ bgcolor: "secondary.main", color: "#fff", width: 38, height: 38, fontSize: 15, fontWeight: "bold" }}>
          {getCleanName(user)?.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography variant="body2" fontWeight="bold" color="#fff" sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
            {getCleanName(user)}
          </Typography>
          <Typography variant="caption" color="rgba(255, 255, 255, 0.5)" sx={{ textTransform: "capitalize", display: "block" }}>
            {user?.role?.replace("_", " ")}
          </Typography>
        </Box>
      </Box>

      {/* Menu Items */}
      <List sx={{ flexGrow: 1, pt: 2, px: 1, overflowY: "auto" }}>
        {items.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: "8px",
                  py: 1, px: 1.5,
                  backgroundColor: isActive ? "rgba(99, 102, 241, 0.15)" : "transparent",
                  borderLeft: isActive ? "3px solid #818cf8" : "3px solid transparent",
                  transition: "all 0.2s ease",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.05)" },
                }}>
                <ListItemIcon sx={{ color: isActive ? "#a5b4fc" : "rgba(255, 255, 255, 0.5)", minWidth: 32 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text}
                  primaryTypographyProps={{
                    fontSize: 13.5,
                    color: isActive ? "#a5b4fc" : "rgba(255, 255, 255, 0.8)",
                    fontWeight: isActive ? 600 : 400,
                  }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />

      {/* Logout */}
      <List sx={{ px: 1, py: 1.5 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}
            sx={{ borderRadius: "8px", py: 1, px: 1.5, "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.15)" } }}>
            <ListItemIcon sx={{ color: "#f87171", minWidth: 32 }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 13.5, color: "#f87171", fontWeight: 500 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
