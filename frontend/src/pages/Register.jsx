import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, CircularProgress, MenuItem,
  Select, FormControl, InputLabel,
} from "@mui/material";

const roles = [
  { value: "retailer", label: "Retailer" },
  { value: "supplier", label: "Supplier" },
  { value: "warehouse_manager", label: "Warehouse Manager" },
];

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    role: "retailer", organization: "", phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        organization: form.organization,
        phone: form.phone,
      });
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        py: 4,
      }}
    >
      <Card sx={{ width: 440, borderRadius: 3, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" color="#1a1a2e">
              SCM System
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Supply Chain Management
            </Typography>
          </Box>

          <Typography variant="h6" fontWeight={600} mb={3} textAlign="center">
            Create an Account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth label="Full Name *" name="name" size="small"
                value={form.name} onChange={handleChange} required
              />
              <TextField
                fullWidth label="Email *" name="email" type="email" size="small"
                value={form.email} onChange={handleChange} required
              />

              <FormControl size="small" fullWidth>
                <InputLabel>Role *</InputLabel>
                <Select name="role" value={form.role} label="Role *"
                  onChange={handleChange}>
                  {roles.map((r) => (
                    <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth label="Organization" name="organization" size="small"
                value={form.organization} onChange={handleChange}
              />
              <TextField
                fullWidth label="Phone" name="phone" size="small"
                value={form.phone} onChange={handleChange}
              />
              <TextField
                fullWidth label="Password *" name="password" type="password" size="small"
                value={form.password} onChange={handleChange} required
              />
              <TextField
                fullWidth label="Confirm Password *" name="confirmPassword"
                type="password" size="small"
                value={form.confirmPassword} onChange={handleChange} required
              />

              <Button
                type="submit" fullWidth variant="contained" size="large"
                disabled={loading}
                sx={{
                  backgroundColor: "#1a1a2e",
                  "&:hover": { backgroundColor: "#0f3460" },
                  borderRadius: 2, py: 1.5, mt: 1,
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
              </Button>
            </Box>
          </form>

          <Typography variant="body2" textAlign="center" mt={3} color="text.secondary">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#0f3460", fontWeight: 600, textDecoration: "none" }}>
              Sign In
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
