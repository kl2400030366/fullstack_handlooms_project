import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function ArtisanDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get("/artisan/stats").then((r) => setStats(r.data));
  }, []);

  const cards = [
    { label: "My Products", value: stats.totalProducts, color: "#3498db" },
    { label: "Total Orders", value: stats.totalOrders, color: "#e67e22" },
    { label: "Revenue Earned", value: `₹${stats.revenue || 0}`, color: "#2ecc71" },
    { label: "Pending Orders", value: stats.pendingOrders, color: "#e74c3c" },
    { label: "Low Stock Items", value: stats.lowStock, color: "#f39c12" },
  ];

  return (
    <div style={styles.container}>
      <h2>Artisan Dashboard</h2>
      <div style={styles.grid}>
        {cards.map((c) => (
          <div key={c.label} style={{ ...styles.card, borderLeft: `5px solid ${c.color}` }}>
            <p style={styles.label}>{c.label}</p>
            <h3 style={{ ...styles.value, color: c.color }}>{c.value ?? "—"}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: 24 },
  grid: { display: "flex", flexWrap: "wrap", gap: 20, marginTop: 20 },
  card: { background: "#fff", padding: 20, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", minWidth: 180 },
  label: { margin: 0, color: "#666", fontSize: 13 },
  value: { margin: "8px 0 0", fontSize: 28 },
};
