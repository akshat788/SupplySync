import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Suppliers from "./pages/admin/Suppliers";
import Inventory from "./pages/admin/Inventory";
import Products from "./pages/admin/Products";
import PurchaseOrders from "./pages/admin/PurchaseOrders";
import Orders from "./pages/admin/Orders";
import Analytics from "./pages/admin/Analytics";
import Users from "./pages/admin/Users";

// Retailer pages
import RetailerDashboard from "./pages/retailer/RetailerDashboard";
import RetailerOrders from "./pages/retailer/RetailerOrders";
import RetailerProducts from "./pages/retailer/RetailerProducts";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute roles={["admin"]}><AdminDashboard /></PrivateRoute>
          } />
          <Route path="/admin/suppliers" element={
            <PrivateRoute roles={["admin"]}><Suppliers /></PrivateRoute>
          } />
          <Route path="/admin/products" element={
            <PrivateRoute roles={["admin"]}><Products /></PrivateRoute>
          } />
          <Route path="/admin/inventory" element={
            <PrivateRoute roles={["admin", "warehouse_manager"]}><Inventory /></PrivateRoute>
          } />
          <Route path="/admin/purchase-orders" element={
            <PrivateRoute roles={["admin", "warehouse_manager"]}><PurchaseOrders /></PrivateRoute>
          } />
          <Route path="/admin/orders" element={
            <PrivateRoute roles={["admin", "warehouse_manager"]}><Orders /></PrivateRoute>
          } />
          <Route path="/admin/analytics" element={
            <PrivateRoute roles={["admin"]}><Analytics /></PrivateRoute>
          } />
          <Route path="/admin/users" element={
            <PrivateRoute roles={["admin"]}><Users /></PrivateRoute>
          } />

          {/* Retailer routes */}
          <Route path="/retailer/dashboard" element={
            <PrivateRoute roles={["retailer"]}><RetailerDashboard /></PrivateRoute>
          } />
          <Route path="/retailer/products" element={
            <PrivateRoute roles={["retailer"]}><RetailerProducts /></PrivateRoute>
          } />
          <Route path="/retailer/orders" element={
            <PrivateRoute roles={["retailer"]}><RetailerOrders /></PrivateRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
