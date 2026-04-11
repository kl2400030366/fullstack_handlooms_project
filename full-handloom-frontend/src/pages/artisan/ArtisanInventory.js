import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";

export default function ArtisanInventory() {
  const [inventory, setInventory] = useState([]);
  const [updates, setUpdates] = useState({});

  const load = () => api.get("/artisan/inventory").then((r) => setInventory(r.data));
  useEffect(() => { load(); }, []);

  const updateStock = async (id) => {
    const qty = updates[id];
    if (!qty) return;
    await api.put(`/artisan/inventory/${id}`, { quantity: parseInt(qty) });
    toast.success("Stock updated");
    setUpdates({ ...updates, [id]: "" });
    load();
  };

  return (
    <div style={styles.container}>
      <h2>Inventory Management</h2>
      <table style={styles.table}>
        <thead>
          <tr>{["Product", "Category", "Current Stock", "Status", "Update Stock"].map((h) => (
            <th key={h} style={styles.th}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td style={styles.td}>{item.productName}</td>
              <td style={styles.td}>{item.category}</td>
              <td style={styles.td}>{item.quantity}</td>
              <td style={styles.td}>
                <span style={{ color: item.quantity < 5 ? "#e74c3c" : item.quantity < 20 ? "#f39c12" : "#2ecc71" }}>
                  {item.quantity < 5 ? "⚠ Low Stock" : item.quantity < 20 ? "Medium" : "In Stock"}
                </span>
              </td>
              <td style={styles.td}>
                <input style={styles.input} type="number" placeholder="New qty"
                  value={updates[item.id] || ""}
                  onChange={(e) => setUpdates({ ...updates, [item.id]: e.target.value })} />
                <button style={styles.btn} onClick={() => updateStock(item.id)}>Update</button>
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
  input: { padding: "4px 8px", border: "1px solid #ddd", borderRadius: 4, width: 80, marginRight: 8 },
  btn: { background: "#3498db", color: "#fff", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12 },
};
