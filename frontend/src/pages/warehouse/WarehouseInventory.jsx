import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import API from "../../api/axios";
import {
  Box, Card, CardContent, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  Chip, Alert, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField, IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import WarningIcon from "@mui/icons-material/Warning";

const WarehouseInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState({ availableStock: 0, minimumStockLevel: 0, warehouseLocation: "" });

  const fetchInventory = async () => {
    try {
      const { data } = await API.get("/inventory");
      setInventory(data.inventory);
    } catch {
      setError("Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setForm({
      availableStock: item.availableStock,
      minimumStockLevel: item.minimumStockLevel,
      warehouseLocation: item.warehouseLocation,
    });
    setOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/inventory/${selectedItem._id}`, {
        availableStock: Number(form.availableStock),
        minimumStockLevel: Number(form.minimumStockLevel),
        warehouseLocation: form.warehouseLocation,
      });
      setSuccess("Inventory updated successfully!");
      setOpen(false);
      fetchInventory();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update inventory.");
    }
  };

  return (
    <Layout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="#1a1a2e">Inventory</Typography>
        <Typography variant="body2" color="text.secondary">Monitor and update stock levels</Typography>
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
                    {["Product", "SKU", "Available", "Reserved", "In Transit", "Location", "Status", "Actions"].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 600, color: "#1a1a2e" }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4, color: "text.secondary" }}>
                        No inventory data found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    inventory.map((item) => {
                      const isLow = item.availableStock <= item.minimumStockLevel;
                      return (
                        <TableRow key={item._id} hover sx={{ backgroundColor: isLow ? "#fff3e0" : "inherit" }}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              {isLow && <WarningIcon fontSize="small" color="warning" />}
                              {item.product?.name}
                            </Box>
                          </TableCell>
                          <TableCell><Chip label={item.product?.sku} size="small" /></TableCell>
                          <TableCell><Typography fontWeight={600} color={isLow ? "error" : "inherit"}>{item.availableStock}</Typography></TableCell>
                          <TableCell>{item.reservedStock}</TableCell>
                          <TableCell>{item.inTransitStock}</TableCell>
                          <TableCell>{item.warehouseLocation}</TableCell>
                          <TableCell>
                            <Chip label={isLow ? "Low Stock" : "In Stock"} size="small" color={isLow ? "error" : "success"} />
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" color="primary" onClick={() => handleEdit(item)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={600}>Update Stock</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField label="Available Stock" size="small" fullWidth type="number"
              value={form.availableStock}
              onChange={(e) => setForm({ ...form, availableStock: e.target.value })} />
            <TextField label="Minimum Stock Level" size="small" fullWidth type="number"
              value={form.minimumStockLevel}
              onChange={(e) => setForm({ ...form, minimumStockLevel: e.target.value })} />
            <TextField label="Warehouse Location" size="small" fullWidth
              value={form.warehouseLocation}
              onChange={(e) => setForm({ ...form, warehouseLocation: e.target.value })} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}
            sx={{ backgroundColor: "#1a1a2e", "&:hover": { backgroundColor: "#0f3460" } }}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default WarehouseInventory;
