import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Shop from "./pages/Shop";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminReports from "./pages/admin/AdminReports";

import ArtisanDashboard from "./pages/artisan/ArtisanDashboard";
import ArtisanProducts from "./pages/artisan/ArtisanProducts";
import ArtisanOrders from "./pages/artisan/ArtisanOrders";
import ArtisanInventory from "./pages/artisan/ArtisanInventory";

import BuyerHome from "./pages/buyer/BuyerHome";
import BuyerCart from "./pages/buyer/BuyerCart";
import BuyerOrders from "./pages/buyer/BuyerOrders";
import BuyerWishlist from "./pages/buyer/BuyerWishlist";

import MarketingDashboard from "./pages/marketing/MarketingDashboard";
import MarketingCampaigns from "./pages/marketing/MarketingCampaigns";
import MarketingPromotions from "./pages/marketing/MarketingPromotions";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: "100vh", background: "#f5f6fa", fontFamily: "Segoe UI, sans-serif" }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/shop" />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<div style={{ padding: 40, textAlign: "center" }}><h2>403 - Unauthorized</h2><p>You don't have permission to access this page.</p></div>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute role="ADMIN"><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute role="ADMIN"><AdminProducts /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute role="ADMIN"><AdminOrders /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute role="ADMIN"><AdminReports /></ProtectedRoute>} />

            {/* Artisan Routes */}
            <Route path="/artisan/dashboard" element={<ProtectedRoute role="ARTISAN"><ArtisanDashboard /></ProtectedRoute>} />
            <Route path="/artisan/products" element={<ProtectedRoute role="ARTISAN"><ArtisanProducts /></ProtectedRoute>} />
            <Route path="/artisan/orders" element={<ProtectedRoute role="ARTISAN"><ArtisanOrders /></ProtectedRoute>} />
            <Route path="/artisan/inventory" element={<ProtectedRoute role="ARTISAN"><ArtisanInventory /></ProtectedRoute>} />

            {/* Buyer Routes */}
            <Route path="/buyer/home" element={<ProtectedRoute role="BUYER"><BuyerHome /></ProtectedRoute>} />
            <Route path="/buyer/cart" element={<ProtectedRoute role="BUYER"><BuyerCart /></ProtectedRoute>} />
            <Route path="/buyer/orders" element={<ProtectedRoute role="BUYER"><BuyerOrders /></ProtectedRoute>} />
            <Route path="/buyer/wishlist" element={<ProtectedRoute role="BUYER"><BuyerWishlist /></ProtectedRoute>} />

            {/* Marketing Routes */}
            <Route path="/marketing/dashboard" element={<ProtectedRoute role="MARKETING"><MarketingDashboard /></ProtectedRoute>} />
            <Route path="/marketing/campaigns" element={<ProtectedRoute role="MARKETING"><MarketingCampaigns /></ProtectedRoute>} />
            <Route path="/marketing/promotions" element={<ProtectedRoute role="MARKETING"><MarketingPromotions /></ProtectedRoute>} />
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
