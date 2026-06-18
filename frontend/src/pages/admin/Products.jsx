import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import API from "../../api/axios";
import {
  Box, Card, CardContent, Typography, Button, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert, CircularProgress, MenuItem, Select,
  FormControl, InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const categories = ["Electronics", "Fashion", "Food", "Pharmaceutical", "Furniture", "Other"];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", category: "Electronics", description: "",
    costPrice: "", sellingPrice: "", unit: "pcs", supplier: "",
  });

  const fetchData = async () => {
    try {
      const [prodRes, supRes] = await Promise.all([
        API.get("/products"),
        API.get("/suppliers"),
      ]);
      setProducts(prodRes.data.products);
      setSuppliers(supRes.data.suppliers);
    } catch {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    try {
      await API.post("/products", {
        ...form,
        costPrice: Number(form.costPrice),
        sellingPrice: Number(form.sellingPrice),
      });
      setSuccess("Product added successfully!");
      setOpen(false);
      setForm({ name: "", category: "Electronics", description: "", costPrice: "", sellingPrice: "", unit: "pcs", supplier: "" });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product.");
    }
  };

  return (
    <Layout>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="#1a1a2e">Products</Typography>
          <Typography variant="body2" color="text.secondary">Manage all products in the supply chain</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}
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
                    {["SKU", "Name", "Category", "Cost Price", "Selling Price", "Unit", "Supplier"].map((h) => (
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
                        <TableCell fontWeight={500}>{p.name}</TableCell>
                        <TableCell><Chip label={p.category} size="small" variant="outlined" /></TableCell>
                        <TableCell>₹{p.costPrice?.toLocaleString()}</TableCell>
                        <TableCell>₹{p.sellingPrice?.toLocaleString()}</TableCell>
                        <TableCell>{p.unit}</TableCell>
                        <TableCell>{p.supplier?.name || "—"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>Add New Product</DialogTitle>
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

            <FormControl size="small" fullWidth>
              <InputLabel>Supplier (optional)</InputLabel>
              <Select value={form.supplier} label="Supplier (optional)"
                onChange={(e) => setForm({ ...form, supplier: e.target.value })}>
                <MenuItem value="">None</MenuItem>
                {suppliers.map((s) => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}
            sx={{ backgroundColor: "#1a1a2e", "&:hover": { backgroundColor: "#0f3460" } }}>
            Add Product
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Products;
