import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginSuccess } from "../redux/authSlice";
import API from "../api/axios";
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, CircularProgress, Divider,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import StorefrontIcon from "@mui/icons-material/Storefront";
import logo from "../assets/logo.png";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/auth/login", form);
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      const role = data.user.role;
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "supplier") navigate("/supplier/dashboard");
      else if (role === "warehouse_manager") navigate("/warehouse/dashboard");
      else if (role === "retailer") navigate("/retailer/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
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
        maxWidth: 420,
        borderRadius: "20px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}>
        <CardContent sx={{ p: { xs: 3.5, sm: 4.5 } }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 3.5 }}>
            <img src={logo} alt="SupplySync" style={{ height: 50, marginBottom: 12, filter: "drop-shadow(0 0 10px rgba(99,102,241,0.4))" }} />
            <Typography variant="h5" fontWeight="bold" color="primary.main" sx={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "0.5px" }}>SupplySync</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Supply Made Easy</Typography>
          </Box>

          <Typography variant="subtitle1" fontWeight={600} mb={3} textAlign="center" color="text.primary">
            Sign in to your account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Email" name="email" type="email"
              value={form.email} onChange={handleChange}
              required sx={{ mb: 2 }} />
            <TextField fullWidth label="Password" name="password" type="password"
              value={form.password} onChange={handleChange}
              required sx={{ mb: 3 }} />
            <Button type="submit" fullWidth variant="contained" size="large"
              disabled={loading}
              sx={{
                backgroundColor: "secondary.main",
                "&:hover": { backgroundColor: "secondary.dark" },
                py: 1.5,
              }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>
          </form>

          <Divider sx={{ my: 3.5 }} />

          {/* Retailer signup */}
          <Box sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1.5 }}>
              <StorefrontIcon sx={{ fontSize: 18, color: "success.main" }} />
              <Typography variant="body2" fontWeight={600} color="success.main">New Retailer?</Typography>
            </Box>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <Button fullWidth variant="outlined" color="success"
                sx={{
                  borderColor: "success.main",
                  borderRadius: "10px",
                  "&:hover": { borderColor: "success.dark", backgroundColor: "#ecfdf5" }
                }}>
                Register as Retailer
              </Button>
            </Link>
            <Typography variant="caption" color="text.secondary" display="block" mt={2}>
              Supplier & Warehouse accounts are created by Admin
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
