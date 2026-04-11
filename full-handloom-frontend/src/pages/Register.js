import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "BUYER", phone: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🧵 Create Account</h2>
        <form onSubmit={handleSubmit}>
          {["name", "email", "phone"].map((field) => (
            <input key={field} style={styles.input} type={field === "email" ? "email" : "text"}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} required />
          ))}
          <input style={styles.input} type="password" placeholder="Password"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <select style={styles.input} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="BUYER">Buyer</option>
            <option value="ARTISAN">Artisan</option>
            <option value="MARKETING">Marketing Specialist</option>
          </select>
          <button style={styles.btn} type="submit">Register</button>
        </form>
        <p style={styles.link}>Already have an account? <Link to="/login">Login</Link></p>
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
