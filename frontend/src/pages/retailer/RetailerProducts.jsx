import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import API from "../../api/axios";
import {
  Box, Card, CardContent, Typography, Grid, Chip,
  Alert, CircularProgress, TextField, InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CategoryIcon from "@mui/icons-material/Category";

const RetailerProducts = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get("/products");
        setProducts(data.products);
        setFiltered(data.products);
      } catch {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setSearch(val);
    setFiltered(products.filter(
      (p) => p.name.toLowerCase().includes(val) || p.category.toLowerCase().includes(val)
    ));
  };

  const categoryColors = {
    Electronics: "#4fc3f7", Fashion: "#ce93d8", Food: "#81c784",
    Pharmaceutical: "#ffb74d", Furniture: "#4db6ac", Other: "#90a4ae",
  };

  return (
    <Layout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="#1a1a2e">Products</Typography>
        <Typography variant="body2" color="text.secondary">Browse available products</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        fullWidth placeholder="Search products by name or category..."
        size="small" value={search} onChange={handleSearch}
        sx={{ mb: 3, backgroundColor: "#fff", borderRadius: 2 }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          {filtered.length === 0 ? (
            <Grid item xs={12}>
              <Typography color="text.secondary" textAlign="center" py={4}>
                No products found.
              </Typography>
            </Grid>
          ) : (
            filtered.map((p) => (
              <Grid item xs={12} sm={6} md={4} key={p._id}>
                <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", height: "100%",
                  "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.15)", transform: "translateY(-2px)" },
                  transition: "all 0.2s ease" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Box sx={{ p: 1, borderRadius: 2,
                        backgroundColor: `${categoryColors[p.category] || "#90a4ae"}20` }}>
                        <CategoryIcon sx={{ color: categoryColors[p.category] || "#90a4ae" }} />
                      </Box>
                      <Chip label={p.category} size="small"
                        sx={{ backgroundColor: `${categoryColors[p.category] || "#90a4ae"}20`,
                          color: categoryColors[p.category] || "#90a4ae" }} />
                    </Box>
                    <Typography variant="h6" fontWeight={600} mb={0.5}>{p.name}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                      SKU: {p.sku} • Unit: {p.unit}
                    </Typography>
                    {p.description && (
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {p.description}
                      </Typography>
                    )}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                      pt: 2, borderTop: "1px solid #f0f0f0" }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Price</Typography>
                        <Typography variant="h6" fontWeight="bold" color="#1a1a2e">
                          ₹{p.sellingPrice?.toLocaleString()}
                        </Typography>
                      </Box>
                      {p.supplier && (
                        <Box sx={{ textAlign: "right" }}>
                          <Typography variant="caption" color="text.secondary">Supplier</Typography>
                          <Typography variant="body2" fontWeight={500}>{p.supplier?.name}</Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Layout>
  );
};

export default RetailerProducts;
