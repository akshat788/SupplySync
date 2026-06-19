import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import API from "../../api/axios";
import {
  Box, Card, CardContent, Typography, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
  Alert, CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Select, FormControl,
  InputLabel, IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const statusColors = {
  Pending: "warning", Approved: "info", Allocated: "secondary",
  Dispatched: "primary", Delivered: "success", Cancelled: "error",
};

const RetailerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    shippingAddress: "",
    notes: "",
    items: [{ product: "", quantity: 1, unitPrice: 0 }],
  });

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        API.get("/orders/my-orders"),
        API.get("/products"),
      ]);
      setOrders(ordersRes.data.orders);
      setProducts(productsRes.data.products);
    } catch {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { product: "", quantity: 1, unitPrice: 0 }] });
  };

  const removeItem = (index) => {
    const items = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items });
  };

  const updateItem = (index, field, value) => {
    const items = [...form.items];
    items[index][field] = value;
    // Auto fill unit price when product is selected
    if (field === "product") {
      const selectedProduct = products.find((p) => p._id === value);
      if (selectedProduct) items[index].unitPrice = selectedProduct.sellingPrice;
    }
    setForm({ ...form, items });
  };

  const calculateTotal = () => {
    return form.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  const handleSubmit = async () => {
    try {
      if (!form.shippingAddress) {
        setError("Please enter shipping address.");
        return;
      }
      if (form.items.some((i) => !i.product)) {
        setError("Please select a product for all items.");
        return;
      }
      await API.post("/orders", form);
      setSuccess("Order placed successfully!");
      setOpen(false);
      setForm({ shippingAddress: "", notes: "", items: [{ product: "", quantity: 1, unitPrice: 0 }] });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order.");
    }
  };

  return (
    <Layout>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="#1a1a2e">My Orders</Typography>
          <Typography variant="body2" color="text.secondary">Place and track your orders</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}
          sx={{ backgroundColor: "#1a1a2e", "&:hover": { backgroundColor: "#0f3460" }, borderRadius: 2 }}>
          Place Order
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>{success}</Alert>}

      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
                  <TableRow>
                    {["Order #", "Items", "Total Amount", "Status", "Shipping Address", "Date"].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 600, color: "#1a1a2e" }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.secondary" }}>
                        No orders yet. Place your first order!
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((o) => (
                      <TableRow key={o._id} hover>
                        <TableCell><Chip label={o.orderNumber} size="small" /></TableCell>
                        <TableCell>{o.items?.length} item(s)</TableCell>
                        <TableCell>₹{o.totalAmount?.toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip label={o.status} size="small" color={statusColors[o.status] || "default"} />
                        </TableCell>
                        <TableCell>{o.shippingAddress || "—"}</TableCell>
                        <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Place Order Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle fontWeight={600}>Place New Order</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField label="Shipping Address *" size="small" fullWidth
              value={form.shippingAddress}
              onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })} />

            <Typography variant="subtitle2" fontWeight={600}>Order Items</Typography>

            {form.items.map((item, index) => (
              <Box key={index} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <FormControl size="small" sx={{ flex: 2 }}>
                  <InputLabel>Product *</InputLabel>
                  <Select value={item.product} label="Product *"
                    onChange={(e) => updateItem(index, "product", e.target.value)}>
                    {products.map((p) => (
                      <MenuItem key={p._id} value={p._id}>
                        {p.name} — ₹{p.sellingPrice?.toLocaleString()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField label="Qty" size="small" type="number" sx={{ flex: 1 }}
                  value={item.quantity}
                  onChange={(e) => updateItem(index, "quantity", Number(e.target.value))} />
                <TextField label="Unit Price" size="small" type="number" sx={{ flex: 1 }}
                  value={item.unitPrice}
                  onChange={(e) => updateItem(index, "unitPrice", Number(e.target.value))} />
                <IconButton size="small" color="error" onClick={() => removeItem(index)}
                  disabled={form.items.length === 1}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}

            <Button onClick={addItem} size="small" sx={{ alignSelf: "flex-start" }}>
              + Add Item
            </Button>

            <Box sx={{ p: 2, backgroundColor: "#f8f9fa", borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Total: ₹{calculateTotal().toLocaleString()}
              </Typography>
            </Box>

            <TextField label="Notes (optional)" size="small" fullWidth multiline rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}
            sx={{ backgroundColor: "#1a1a2e", "&:hover": { backgroundColor: "#0f3460" } }}>
            Place Order
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default RetailerOrders;
