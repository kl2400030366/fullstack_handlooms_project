import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";

export default function ArtisanOrders() {
  const [orders, setOrders] = useState([]);

  const load = () => api.get("/artisan/orders").then((r) => setOrders(r.data));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/artisan/orders/${id}/status`, { status });
    toast.success("Order updated"); load();
  };

  return (
    <div style={styles.container}>
      <h2>Incoming Orders</h2>
      <table style={styles.table}>
        <thead>
          <tr>{["Order ID", "Buyer", "Product", "Qty", "Amount", "Status", "Action"].map((h) => (
            <th key={h} style={styles.th}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td style={styles.td}>#{o.id}</td>
              <td style={styles.td}>{o.buyerName}</td>
              <td style={styles.td}>{o.productName}</td>
              <td style={styles.td}>{o.quantity}</td>
              <td style={styles.td}>₹{o.totalAmount}</td>
              <td style={styles.td}>{o.status}</td>
              <td style={styles.td}>
                {o.status === "PENDING" && (
                  <>
                    <button style={styles.btnSuccess} onClick={() => updateStatus(o.id, "CONFIRMED")}>Confirm</button>
                    <button style={styles.btnDanger} onClick={() => updateStatus(o.id, "CANCELLED")}>Cancel</button>
                  </>
                )}
                {o.status === "CONFIRMED" && (
                  <button style={styles.btnShip} onClick={() => updateStatus(o.id, "SHIPPED")}>Mark Shipped</button>
                )}
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
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  th: { background: "#2c3e50", color: "#fff", padding: "10px 14px", textAlign: "left", fontSize: 13 },
  td: { padding: "10px 14px", borderBottom: "1px solid #f0f0f0", fontSize: 13 },
  btnSuccess: { background: "#2ecc71", color: "#fff", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12, marginRight: 6 },
  btnDanger: { background: "#e74c3c", color: "#fff", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12 },
  btnShip: { background: "#9b59b6", color: "#fff", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12 },
};
