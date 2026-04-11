import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      const role = res.data.user.role;
      const redirects = { ADMIN: "/admin/dashboard", ARTISAN: "/artisan/dashboard", BUYER: "/buyer/home", MARKETING: "/marketing/dashboard" };
      navigate(redirects[role] || "/");
    } catch {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🧵 HandloomHub Login</h2>
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input style={styles.input} type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button style={styles.btn} type="submit">Login</button>
        </form>
        <p style={styles.link}>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", background: "#f5f5f5" },
  card: { background: "#fff", padding: 32, borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.1)", width: 360 },
  title: { textAlign: "center", color: "#2c3e50", marginBottom: 24 },
  input: { width: "100%", padding: "10px 12px", marginBottom: 14, border: "1px solid #ddd", borderRadius: 6, fontSize: 14, boxSizing: "border-box" },
  btn: { width: "100%", padding: 12, background: "#2c3e50", color: "#fff", border: "none", borderRadius: 6, fontSize: 15, cursor: "pointer" },
  link: { textAlign: "center", marginTop: 16, fontSize: 13 },
};
