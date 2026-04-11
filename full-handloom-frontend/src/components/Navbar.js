import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleLinks = {
  ADMIN: [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/orders", label: "Orders" },
    { to: "/admin/reports", label: "Reports" },
  ],
  ARTISAN: [
    { to: "/artisan/dashboard", label: "Dashboard" },
    { to: "/artisan/products", label: "My Products" },
    { to: "/artisan/orders", label: "Orders" },
    { to: "/artisan/inventory", label: "Inventory" },
  ],
  BUYER: [
    { to: "/buyer/home", label: "Shop" },
    { to: "/buyer/cart", label: "Cart" },
    { to: "/buyer/orders", label: "My Orders" },
    { to: "/buyer/wishlist", label: "Wishlist" },
  ],
  MARKETING: [
    { to: "/marketing/dashboard", label: "Dashboard" },
    { to: "/marketing/campaigns", label: "Campaigns" },
    { to: "/marketing/promotions", label: "Promotions" },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🧵 HandloomHub</Link>
      <div style={styles.links}>
        {user &&
          (roleLinks[user.role] || []).map((l) => (
            <Link key={l.to} to={l.to} style={styles.link}>{l.label}</Link>
          ))}
        {!user && <Link to="/shop" style={styles.link}>Shop</Link>}
      </div>
      <div>
        {user ? (
          <span style={styles.userInfo}>
            {user.name} ({user.role})&nbsp;
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </span>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", background: "#2c3e50", color: "#fff" },
  brand: { color: "#f39c12", fontWeight: "bold", fontSize: 20, textDecoration: "none" },
  links: { display: "flex", gap: 16 },
  link: { color: "#ecf0f1", textDecoration: "none", fontSize: 14 },
  btn: { background: "#e74c3c", color: "#fff", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer" },
  userInfo: { color: "#ecf0f1", fontSize: 13 },
};
