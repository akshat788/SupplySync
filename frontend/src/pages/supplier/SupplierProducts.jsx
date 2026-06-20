import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import API from "../../api/axios";
import {
  Box, Card, CardContent, Typography, Button, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert, CircularProgress, MenuItem, Select,
  FormControl, InputLabel, IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

const categories = ["Electronics", "Fashion", "Food", "Pharmaceutical", "Furniture", "Other"];

const SupplierProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "", category: "Electronics", description: "",
    costPrice: "", sellingPrice: "", unit: "pcs",
  });

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data.products);
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleOpen = (product = null) => {
    if (product) {
      setEditId(product._id);
      setForm({
        name: product.name || "",
        category: product.category || "Electronics",
        description: product.description || "",
        costPrice: product.costPrice || "",
        sellingPrice: product.sellingPrice || "",
        unit: product.unit || "pcs",
      });
    } else {
      setEditId(null);
      setForm({ name: "", category: "Electronics", description: "", costPrice: "", sellingPrice: "", unit: "pcs" });
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        costPrice: Number(form.costPrice),
        sellingPrice: Number(form.sellingPrice),
      };
      if (editId) {
        await API.put(`/products/${editId}`, payload);
        setSuccess("Product updated successfully!");
      } else {
        await API.post("/products", payload);
        setSuccess("Product added successfully!");
      }
      setOpen(false);
      setEditId(null);
      setForm({ name: "", category: "Electronics", description: "", costPrice: "", sellingPrice: "", unit: "pcs" });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product.");
    }
  };

  return (
    <Layout>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="#1a1a2e">Products</Typography>
          <Typography variant="body2" color="text.secondary">Manage your product catalogue</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}
          sx={{ backgroundColor: "#1a1a2e", "&:hover": { backgroundColor: "#0f3460" }, borderRadius: 2 }}>
          Add Product
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
                    {["SKU", "Name", "Category", "Cost Price", "Selling Price", "Unit", "Actions"].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 600, color: "#1a1a2e" }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.secondary" }}>
                        No products found. Add your first product.
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((p) => (
                      <TableRow key={p._id} hover>
                        <TableCell><Chip label={p.sku} size="small" /></TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{p.name}</TableCell>
                        <TableCell><Chip label={p.category} size="small" variant="outlined" /></TableCell>
                        <TableCell>₹{p.costPrice?.toLocaleString()}</TableCell>
                        <TableCell>₹{p.sellingPrice?.toLocaleString()}</TableCell>
                        <TableCell>{p.unit}</TableCell>
                        <TableCell>
                          <IconButton size="small" color="primary" onClick={() => handleOpen(p)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Product Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>{editId ? "Edit Product" : "Add New Product"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField label="Product Name *" size="small" fullWidth
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

            <FormControl size="small" fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={form.category} label="Category"
                onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>

            <TextField label="Description" size="small" fullWidth multiline rows={2}
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField label="Cost Price *" size="small" fullWidth type="number"
                value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} />
              <TextField label="Selling Price *" size="small" fullWidth type="number"
                value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} />
            </Box>

            <TextField label="Unit (pcs/kg/litre)" size="small" fullWidth
              value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}
            sx={{ backgroundColor: "#1a1a2e", "&:hover": { backgroundColor: "#0f3460" } }}>
            {editId ? "Update Product" : "Add Product"}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default SupplierProducts;
