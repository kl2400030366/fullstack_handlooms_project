import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";

const EMPTY = { code: "", discountType: "PERCENTAGE", discountValue: "", minOrderAmount: "", maxUsage: "", expiryDate: "" };

export default function MarketingPromotions() {
  const [promotions, setPromotions] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get("/marketing/promotions").then((r) => setPromotions(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/marketing/promotions", form);
      toast.success("Promotion created"); setForm(EMPTY); setShowForm(false); load();
    } catch { toast.error("Failed to create promotion"); }
  };

  const togglePromotion = async (id, active) => {
    await api.put(`/marketing/promotions/${id}/toggle`, { active: !active });
    toast.success("Promotion updated"); load();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Promotions & Discount Codes</h2>
        <button style={styles.btnPrimary} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ New Promotion"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3>Create Promotion</h3>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Promo Code</label>
              <input style={styles.input} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
            </div>
            <div>
              <label style={styles.label}>Discount Type</label>
              <select style={styles.input} value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FLAT">Flat Amount (₹)</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Discount Value</label>
              <input style={styles.input} type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} required />
            </div>
            <div>
              <label style={styles.label}>Min Order Amount (₹)</label>
              <input style={styles.input} type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} />
            </div>
            <div>
              <label style={styles.label}>Max Usage</label>
              <input style={styles.input} type="number" value={form.maxUsage} onChange={(e) => setForm({ ...form, maxUsage: e.target.value })} />
            </div>
            <div>
              <label style={styles.label}>Expiry Date</label>
              <input style={styles.input} type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} required />
            </div>
          </div>
          <button style={styles.btnPrimary} type="submit">Create Promotion</button>
        </form>
      )}

      <table style={styles.table}>
        <thead>
          <tr>{["Code", "Type", "Value", "Min Order", "Usage", "Expiry", "Status", "Action"].map((h) => (
            <th key={h} style={styles.th}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {promotions.map((p) => (
            <tr key={p.id}>
              <td style={styles.td}><strong>{p.code}</strong></td>
              <td style={styles.td}>{p.discountType}</td>
              <td style={styles.td}>{p.discountType === "PERCENTAGE" ? `${p.discountValue}%` : `₹${p.discountValue}`}</td>
              <td style={styles.td}>₹{p.minOrderAmount || 0}</td>
              <td style={styles.td}>{p.usedCount}/{p.maxUsage || "∞"}</td>
              <td style={styles.td}>{p.expiryDate?.split("T")[0]}</td>
              <td style={styles.td}><span style={{ color: p.active ? "#2ecc71" : "#e74c3c" }}>{p.active ? "Active" : "Inactive"}</span></td>
              <td style={styles.td}>
                <button style={p.active ? styles.btnWarn : styles.btnSuccess} onClick={() => togglePromotion(p.id, p.active)}>
                  {p.active ? "Deactivate" : "Activate"}
                </button>
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
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 },
  label: { display: "block", fontSize: 12, color: "#666", marginBottom: 4 },
  input: { width: "100%", padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13, boxSizing: "border-box" },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  th: { background: "#2c3e50", color: "#fff", padding: "10px 14px", textAlign: "left", fontSize: 13 },
  td: { padding: "10px 14px", borderBottom: "1px solid #f0f0f0", fontSize: 13 },
  btnPrimary: { background: "#2c3e50", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13 },
  btnSuccess: { background: "#2ecc71", color: "#fff", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12 },
  btnWarn: { background: "#f39c12", color: "#fff", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12 },
};
