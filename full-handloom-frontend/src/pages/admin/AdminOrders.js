import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const load = () => api.get("/admin/orders").then((r) => setOrders(r.data));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/admin/orders/${id}/status`, { status });
    toast.success("Order status updated");
    load();
  };

  return (
    <div style={styles.container}>
      <h2>Order Management</h2>
      <table style={styles.table}>
        <thead>
          <tr>{["Order ID", "Buyer", "Total", "Status", "Date", "Update Status"].map((h) => (
            <th key={h} style={styles.th}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td style={styles.td}>#{o.id}</td>
              <td style={styles.td}>{o.buyerName}</td>
              <td style={styles.td}>₹{o.totalAmount}</td>
              <td style={styles.td}><span style={statusStyle(o.status)}>{o.status}</span></td>
              <td style={styles.td}>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td style={styles.td}>
                <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} style={styles.select}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const statusStyle = (s) => ({
  padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: "bold",
  background: { PENDING: "#ffeaa7", CONFIRMED: "#74b9ff", SHIPPED: "#a29bfe", DELIVERED: "#55efc4", CANCELLED: "#fab1a0" }[s] || "#ddd",
});

const styles = {
  container: { padding: 24 },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  th: { background: "#2c3e50", color: "#fff", padding: "10px 14px", textAlign: "left", fontSize: 13 },
  td: { padding: "10px 14px", borderBottom: "1px solid #f0f0f0", fontSize: 13 },
  select: { padding: "4px 8px", border: "1px solid #ddd", borderRadius: 4 },
};
