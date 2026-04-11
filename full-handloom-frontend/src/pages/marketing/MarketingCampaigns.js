import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";

const EMPTY = { title: "", description: "", startDate: "", endDate: "", targetAudience: "", budget: "", channel: "EMAIL" };

export default function MarketingCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const load = () => api.get("/marketing/campaigns").then((r) => setCampaigns(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/marketing/campaigns/${editId}`, form);
        toast.success("Campaign updated");
      } else {
        await api.post("/marketing/campaigns", form);
        toast.success("Campaign created");
      }
      setForm(EMPTY); setEditId(null); setShowForm(false); load();
    } catch { toast.error("Failed to save campaign"); }
  };

  const deleteCampaign = async (id) => {
    if (!window.confirm("Delete campaign?")) return;
    await api.delete(`/marketing/campaigns/${id}`);
    toast.success("Campaign deleted"); load();
  };

  const handleEdit = (c) => {
    setForm({ title: c.title, description: c.description, startDate: c.startDate?.split("T")[0] || "", endDate: c.endDate?.split("T")[0] || "", targetAudience: c.targetAudience, budget: c.budget, channel: c.channel });
    setEditId(c.id); setShowForm(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Campaigns</h2>
        <button style={styles.btnPrimary} onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(!showForm); }}>
          {showForm ? "Cancel" : "+ New Campaign"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3>{editId ? "Edit Campaign" : "Create Campaign"}</h3>
          <div style={styles.formGrid}>
            {[
              { key: "title", label: "Campaign Title" },
              { key: "targetAudience", label: "Target Audience" },
              { key: "budget", label: "Budget (₹)", type: "number" },
              { key: "startDate", label: "Start Date", type: "date" },
              { key: "endDate", label: "End Date", type: "date" },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label style={styles.label}>{label}</label>
                <input style={styles.input} type={type || "text"} value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })} required />
              </div>
            ))}
            <div>
              <label style={styles.label}>Channel</label>
              <select style={styles.input} value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}>
                {["EMAIL", "SOCIAL_MEDIA", "SMS", "PUSH_NOTIFICATION"].map((c) => (
                  <option key={c} value={c}>{c.replace("_", " ")}</option>
                ))}
              </select>
            </div>
          </div>
          <label style={styles.label}>Description</label>
          <textarea style={{ ...styles.input, height: 70 }} value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <button style={styles.btnPrimary} type="submit">{editId ? "Update" : "Create"}</button>
        </form>
      )}

      <div style={styles.grid}>
        {campaigns.map((c) => (
          <div key={c.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h4 style={{ margin: 0 }}>{c.title}</h4>
              <span style={{ ...styles.badge, background: c.active ? "#2ecc71" : "#95a5a6" }}>
                {c.active ? "Active" : "Inactive"}
              </span>
            </div>
            <p style={styles.desc}>{c.description}</p>
            <p style={styles.meta}>📢 {c.channel} | 👥 {c.targetAudience} | 💰 ₹{c.budget}</p>
            <p style={styles.meta}>📅 {c.startDate?.split("T")[0]} → {c.endDate?.split("T")[0]}</p>
            <div style={styles.actions}>
              <button style={styles.btnEdit} onClick={() => handleEdit(c)}>Edit</button>
              <button style={styles.btnDanger} onClick={() => deleteCampaign(c.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
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
  grid: { display: "flex", flexWrap: "wrap", gap: 20 },
  card: { background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", width: 300 },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  badge: { padding: "2px 8px", borderRadius: 12, color: "#fff", fontSize: 11 },
  desc: { fontSize: 13, color: "#555", margin: "0 0 8px" },
  meta: { fontSize: 12, color: "#888", margin: "2px 0" },
  actions: { display: "flex", gap: 8, marginTop: 12 },
  btnPrimary: { background: "#2c3e50", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13 },
  btnEdit: { background: "#3498db", color: "#fff", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12 },
  btnDanger: { background: "#e74c3c", color: "#fff", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12 },
};
