import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../../components/Layout";
import API from "../../api/axios";
import {
  Box, Grid, Card, CardContent, Typography,
  Chip, CircularProgress, Alert, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningIcon from "@mui/icons-material/Warning";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const WarehouseDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get("/analytics/dashboard");
        setStats(data);
      } catch {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statusColors = {
    Pending: "warning", Approved: "info", Allocated: "secondary",
    Dispatched: "primary", Delivered: "success", Cancelled: "error",
  };

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" color="#1a1a2e">
          Welcome, {user?.name} 👋
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage inventory, purchase orders and order fulfillment.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress /></Box>
      ) : stats && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Total Products</Typography>
                      <Typography variant="h4" fontWeight="bold" color="#81c784">{stats.counts.totalProducts}</Typography>
                    </Box>
                    <InventoryIcon sx={{ fontSize: 40, color: "#81c784" }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Low Stock Items</Typography>
                      <Typography variant="h4" fontWeight="bold" color="#ef5350">{stats.counts.lowStockItems}</Typography>
                    </Box>
                    <WarningIcon sx={{ fontSize: 40, color: "#ef5350" }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Total Orders</Typography>
                      <Typography variant="h4" fontWeight="bold" color="#ce93d8">{stats.counts.totalOrders}</Typography>
                    </Box>
                    <ShoppingCartIcon sx={{ fontSize: 40, color: "#ce93d8" }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Purchase Orders</Typography>
                      <Typography variant="h4" fontWeight="bold" color="#4fc3f7">{stats.counts.totalPurchaseOrders}</Typography>
                    </Box>
                    <LocalShippingIcon sx={{ fontSize: 40, color: "#4fc3f7" }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>Recent Orders</Typography>
                  {stats.recentOrders.length === 0 ? (
                    <Typography color="text.secondary">No orders yet.</Typography>
                  ) : (
                    stats.recentOrders.map((order) => (
                      <Box key={order._id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1, borderBottom: "1px solid #f0f0f0" }}>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>{order.orderNumber}</Typography>
                          <Typography variant="caption" color="text.secondary">{order.retailer?.name}</Typography>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Chip label={order.status} size="small" color={statusColors[order.status] || "default"} />
                          <Typography variant="caption" display="block" color="text.secondary">
                            ₹{order.totalAmount?.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>Recent Purchase Orders</Typography>
                  {stats.recentPurchaseOrders.length === 0 ? (
                    <Typography color="text.secondary">No purchase orders yet.</Typography>
                  ) : (
                    stats.recentPurchaseOrders.map((po) => (
                      <Box key={po._id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1, borderBottom: "1px solid #f0f0f0" }}>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>{po.poNumber}</Typography>
                          <Typography variant="caption" color="text.secondary">{po.supplier?.name}</Typography>
                        </Box>
                        <Chip label={po.status} size="small" color={statusColors[po.status] || "default"} />
                      </Box>
                    ))
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Layout>
  );
};

export default WarehouseDashboard;
