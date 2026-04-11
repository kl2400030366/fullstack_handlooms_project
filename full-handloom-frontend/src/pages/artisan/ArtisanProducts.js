import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";

const EMPTY = { name: "", description: "", price: "", quantity: "", category: "", imageUrl: "", material: "", origin: "" };

export default function ArtisanProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get("/artisan/products").then((r) => setProducts(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/artisan/products/${editId}`, form);
        toast.success("Product updated");
      } else {
        await api.post("/artisan/products", form);
        toast.success("Product added");
      }
      setForm(EMPTY); setEditId(null); setShowForm(false); load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving product");
    }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, quantity: p.quantity, category: p.category, imageUrl: p.imageUrl || "", material: p.material || "", origin: p.origin || "" });
    setEditId(p.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/artisan/products/${id}`);
    toast.success("Product deleted"); load();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>My Products</h2>
        <button style={styles.btnPrimary} onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(!showForm); }}>
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3>{editId ? "Edit Product" : "Add New Product"}</h3>
          <div style={styles.formGrid}>
            {[
              { key: "name", label: "Product Name" },
              { key: "price", label: "Price (₹)", type: "number" },
              { key: "quantity", label: "Quantity", type: "number" },
              { key: "category", label: "Category" },
              { key: "material", label: "Material" },
              { key: "origin", label: "Origin/Region" },
              { key: "imageUrl", label: "Image URL" },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label style={styles.label}>{label}</label>
                <input style={styles.input} type={type || "text"} value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })} required={key !== "imageUrl"} />
              </div>
            ))}
          </div>
          <label style={styles.label}>Description</label>
          <textarea style={{ ...styles.input, height: 80 }} value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <button style={styles.btnPrimary} type="submit">{editId ? "Update" : "Add Product"}</button>
        </form>
      )}

      <table style={styles.table}>
        <thead>
          <tr>{["Name", "Category", "Price", "Stock", "Approved", "Actions"].map((h) => (
            <th key={h} style={styles.th}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td style={styles.td}>{p.name}</td>
              <td style={styles.td}>{p.category}</td>
              <td style={styles.td}>₹{p.price}</td>
              <td style={styles.td}>{p.quantity}</td>
              <td style={styles.td}><span style={{ color: p.approved ? "#2ecc71" : "#e74c3c" }}>{p.approved ? "Yes" : "Pending"}</span></td>
              <td style={styles.td}>
                <button style={styles.btnEdit} onClick={() => handleEdit(p)}>Edit</button>
                <button style={styles.btnDanger} onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding: 24 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  form: { background: "#fff", padding: 24, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: 24 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 },
  label: { display: "block", fontSize: 12, color: "#666", marginBottom: 4 },
  input: { width: "100%", padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13, boxSizing: "border-box" },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  th: { background: "#2c3e50", color: "#fff", padding: "10px 14px", textAlign: "left", fontSize: 13 },
  td: { padding: "10px 14px", borderBottom: "1px solid #f0f0f0", fontSize: 13 },
  btnPrimary: { background: "#2c3e50", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13 },
  btnEdit: { background: "#3498db", color: "#fff", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12, marginRight: 6 },
  btnDanger: { background: "#e74c3c", color: "#fff", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12 },
};
