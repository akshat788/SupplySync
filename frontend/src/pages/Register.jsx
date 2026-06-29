import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, CircularProgress, Grid,
} from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import logo from "../assets/logo.png";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    organization: "", phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
        role: "retailer", // Always retailer — no choice
        organization: form.organization,
        phone: form.phone,
      });
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
      p: 2,
    }}>
      <Card sx={{
        width: "100%",
        maxWidth: 480,
        borderRadius: "20px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}>
        <CardContent sx={{ p: { xs: 3.5, sm: 4.5 } }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <img src={logo} alt="SupplySync" style={{ height: 50, marginBottom: 12, filter: "drop-shadow(0 0 10px rgba(99,102,241,0.4))" }} />
            <Typography variant="h5" fontWeight="bold" color="primary.main" sx={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "0.5px" }}>SupplySync</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Supply Made Easy</Typography>
          </Box>

          {/* Retailer Badge */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5,
            mb: 3.5, p: 2, backgroundColor: "#ecfdf5", borderRadius: "12px" }}>
            <StorefrontIcon sx={{ color: "success.main", fontSize: 24 }} />
            <Box>
              <Typography variant="body2" fontWeight={600} color="success.dark">Retailer Registration</Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.2, lineHeight: 1.2 }}>
                For Supplier & Warehouse accounts, contact your administrator
              </Typography>
            </Box>
          </Box>

          <Typography variant="subtitle1" fontWeight={600} mb={3} textAlign="center" color="text.primary">
            Create Retailer Account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2.5 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Full Name *" name="name"
                  value={form.name} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email *" name="email" type="email"
                  value={form.email} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Organization" name="organization"
                  value={form.organization} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone" name="phone"
                  value={form.phone} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Password *" name="password" type="password"
                  value={form.password} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Confirm Password *" name="confirmPassword"
                  type="password"
                  value={form.confirmPassword} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Button type="submit" fullWidth variant="contained" size="large"
                  disabled={loading}
                  sx={{
                    backgroundColor: "secondary.main",
                    "&:hover": { backgroundColor: "secondary.dark" },
                    py: 1.5,
                  }}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Typography variant="body2" textAlign="center" mt={3.5} color="text.secondary">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#4f46e5", fontWeight: 600, textDecoration: "none" }}>
              Sign In
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
