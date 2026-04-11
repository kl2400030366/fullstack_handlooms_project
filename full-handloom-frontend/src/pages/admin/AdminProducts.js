import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  const load = () => api.get("/admin/products").then((r) => setProducts(r.data));
  useEffect(() => { load(); }, []);

  const toggleApproval = async (id, approved) => {
    await api.put(`/admin/products/${id}/approve`, { approved: !approved });
    toast.success("Product status updated");
    load();
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/admin/products/${id}`);
    toast.success("Product deleted");
    load();
  };

  return (
    <div style={styles.container}>
      <h2>Product Management</h2>
      <table style={styles.table}>
        <thead>
          <tr>{["ID", "Name", "Artisan", "Category", "Price", "Approved", "Actions"].map((h) => (
            <th key={h} style={styles.th}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td style={styles.td}>{p.id}</td>
              <td style={styles.td}>{p.name}</td>
              <td style={styles.td}>{p.artisanName}</td>
              <td style={styles.td}>{p.category}</td>
              <td style={styles.td}>₹{p.price}</td>
              <td style={styles.td}>
                <span style={{ color: p.approved ? "#2ecc71" : "#e74c3c" }}>
                  {p.approved ? "Yes" : "No"}
                </span>
              </td>
              <td style={styles.td}>
                <button style={p.approved ? styles.btnWarn : styles.btnSuccess}
                  onClick={() => toggleApproval(p.id, p.approved)}>
                  {p.approved ? "Revoke" : "Approve"}
                </button>
                <button style={styles.btnDanger} onClick={() => deleteProduct(p.id)}>Delete</button>
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
  btnWarn: { background: "#f39c12", color: "#fff", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12, marginRight: 6 },
  btnDanger: { background: "#e74c3c", color: "#fff", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12 },
};
