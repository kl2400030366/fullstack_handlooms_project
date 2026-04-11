import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function AdminReports() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    api.get("/admin/reports").then((r) => setReport(r.data));
  }, []);

  if (!report) return <div style={{ padding: 24 }}>Loading reports...</div>;

  return (
    <div style={styles.container}>
      <h2>Platform Reports</h2>
      <div style={styles.section}>
        <h3>Revenue Summary</h3>
        <div style={styles.grid}>
          {[
            { label: "Today's Revenue", value: `₹${report.todayRevenue}` },
            { label: "Monthly Revenue", value: `₹${report.monthlyRevenue}` },
            { label: "Total Revenue", value: `₹${report.totalRevenue}` },
            { label: "Avg Order Value", value: `₹${report.avgOrderValue}` },
          ].map((s) => (
            <div key={s.label} style={styles.card}>
              <p style={styles.label}>{s.label}</p>
              <h3 style={styles.value}>{s.value}</h3>
            </div>
          ))}
        </div>
      </div>
      <div style={styles.section}>
        <h3>Top Selling Products</h3>
        <table style={styles.table}>
          <thead>
            <tr>{["Product", "Artisan", "Units Sold", "Revenue"].map((h) => (
              <th key={h} style={styles.th}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {(report.topProducts || []).map((p) => (
              <tr key={p.productId}>
                <td style={styles.td}>{p.productName}</td>
                <td style={styles.td}>{p.artisanName}</td>
                <td style={styles.td}>{p.unitsSold}</td>
                <td style={styles.td}>₹{p.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={styles.section}>
        <h3>Orders by Status</h3>
        <div style={styles.grid}>
          {Object.entries(report.ordersByStatus || {}).map(([status, count]) => (
            <div key={status} style={styles.card}>
              <p style={styles.label}>{status}</p>
              <h3 style={styles.value}>{count}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: 24 },
  section: { marginBottom: 32 },
  grid: { display: "flex", flexWrap: "wrap", gap: 16, marginTop: 12 },
  card: { background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", minWidth: 160 },
  label: { margin: 0, color: "#666", fontSize: 12 },
  value: { margin: "6px 0 0", fontSize: 22, color: "#2c3e50" },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  th: { background: "#2c3e50", color: "#fff", padding: "10px 14px", textAlign: "left", fontSize: 13 },
  td: { padding: "10px 14px", borderBottom: "1px solid #f0f0f0", fontSize: 13 },
};
