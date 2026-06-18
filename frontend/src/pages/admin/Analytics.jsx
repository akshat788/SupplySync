import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import API from "../../api/axios";
import {
  Box, Card, CardContent, Typography, Grid,
  CircularProgress, Alert,
} from "@mui/material";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Analytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [orderAnalytics, setOrderAnalytics] = useState(null);
  const [inventoryAnalytics, setInventoryAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dashRes, orderRes, invRes] = await Promise.all([
          API.get("/analytics/dashboard"),
          API.get("/analytics/orders"),
          API.get("/analytics/inventory"),
        ]);
        setDashboard(dashRes.data);
        setOrderAnalytics(orderRes.data);
        setInventoryAnalytics(invRes.data);
      } catch {
        setError("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <Layout><Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress /></Box></Layout>;

  // Order status pie chart data
  const orderPieData = {
    labels: dashboard?.orderStatusBreakdown?.map((o) => o._id) || [],
    datasets: [{
      data: dashboard?.orderStatusBreakdown?.map((o) => o.count) || [],
      backgroundColor: ["#ffb74d", "#4fc3f7", "#ce93d8", "#81c784", "#ef5350", "#90a4ae"],
      borderWidth: 0,
    }],
  };

  // Purchase order status pie chart
  const poPieData = {
    labels: dashboard?.poStatusBreakdown?.map((o) => o._id) || [],
    datasets: [{
      data: dashboard?.poStatusBreakdown?.map((o) => o.count) || [],
      backgroundColor: ["#ffb74d", "#4fc3f7", "#81c784", "#ef5350", "#ce93d8"],
      borderWidth: 0,
    }],
  };

  // Inventory category bar chart
  const categoryBarData = {
    labels: inventoryAnalytics?.categoryBreakdown?.map((c) => c.category) || [],
    datasets: [
      {
        label: "Available Stock",
        data: inventoryAnalytics?.categoryBreakdown?.map((c) => c.totalAvailable) || [],
        backgroundColor: "#4fc3f7",
        borderRadius: 6,
      },
      {
        label: "Reserved Stock",
        data: inventoryAnalytics?.categoryBreakdown?.map((c) => c.totalReserved) || [],
        backgroundColor: "#ce93d8",
        borderRadius: 6,
      },
    ],
  };

  // Monthly orders bar chart
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyBarData = {
    labels: orderAnalytics?.monthlyOrders?.map((m) => `${monthNames[m._id.month - 1]} ${m._id.year}`) || [],
    datasets: [{
      label: "Orders",
      data: orderAnalytics?.monthlyOrders?.map((m) => m.count) || [],
      backgroundColor: "#81c784",
      borderRadius: 6,
    }],
  };

  const chartOptions = { responsive: true, plugins: { legend: { position: "bottom" } } };

  return (
    <Layout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="#1a1a2e">Analytics</Typography>
        <Typography variant="body2" color="text.secondary">Visual insights across your supply chain</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Order Status Pie */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>Order Status Breakdown</Typography>
              {dashboard?.orderStatusBreakdown?.length > 0 ? (
                <Box sx={{ maxWidth: 300, mx: "auto" }}>
                  <Pie data={orderPieData} options={chartOptions} />
                </Box>
              ) : (
                <Typography color="text.secondary" textAlign="center" py={4}>No order data yet.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Purchase Order Status Pie */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>Purchase Order Status</Typography>
              {dashboard?.poStatusBreakdown?.length > 0 ? (
                <Box sx={{ maxWidth: 300, mx: "auto" }}>
                  <Pie data={poPieData} options={chartOptions} />
                </Box>
              ) : (
                <Typography color="text.secondary" textAlign="center" py={4}>No purchase order data yet.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Inventory by Category Bar */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>Inventory by Category</Typography>
              {inventoryAnalytics?.categoryBreakdown?.length > 0 ? (
                <Bar data={categoryBarData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: false } } }} />
              ) : (
                <Typography color="text.secondary" textAlign="center" py={4}>No inventory data yet.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Orders Bar */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>Monthly Orders (Last 6 Months)</Typography>
              {orderAnalytics?.monthlyOrders?.length > 0 ? (
                <Bar data={monthlyBarData} options={chartOptions} />
              ) : (
                <Typography color="text.secondary" textAlign="center" py={4}>No monthly data yet.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Summary stats */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>Supply Chain Summary</Typography>
              <Grid container spacing={2}>
                {[
                  { label: "Total Suppliers", value: dashboard?.counts?.totalSuppliers, color: "#4fc3f7" },
                  { label: "Total Products", value: dashboard?.counts?.totalProducts, color: "#81c784" },
                  { label: "Total Orders", value: dashboard?.counts?.totalOrders, color: "#ce93d8" },
                  { label: "Low Stock Items", value: dashboard?.counts?.lowStockItems, color: "#ef5350" },
                  { label: "Total Revenue", value: `₹${(dashboard?.financials?.totalRevenue || 0).toLocaleString()}`, color: "#66bb6a" },
                  { label: "Inventory Value", value: `₹${(dashboard?.financials?.totalInventoryValue || 0).toLocaleString()}`, color: "#42a5f5" },
                ].map((item) => (
                  <Grid item xs={6} md={2} key={item.label}>
                    <Box sx={{ textAlign: "center", p: 2, borderRadius: 2, backgroundColor: `${item.color}15` }}>
                      <Typography variant="h5" fontWeight="bold" color={item.color}>{item.value}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Analytics;
