import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const load = () => api.get("/admin/users").then((r) => setUsers(r.data));
  useEffect(() => { load(); }, []);

  const toggleStatus = async (id, active) => {
    await api.put(`/admin/users/${id}/status`, { active: !active });
    toast.success("Status updated");
    load();
  };

  const changeRole = async (id, role) => {
    await api.put(`/admin/users/${id}/role`, { role });
    toast.success("Role updated");
    load();
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h2>User Management</h2>
      <input style={styles.search} placeholder="Search users..." value={search}
        onChange={(e) => setSearch(e.target.value)} />
      <table style={styles.table}>
        <thead>
          <tr>{["ID", "Name", "Email", "Role", "Status", "Actions"].map((h) => (
            <th key={h} style={styles.th}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>
          {filtered.map((u) => (
            <tr key={u.id}>
              <td style={styles.td}>{u.id}</td>
              <td style={styles.td}>{u.name}</td>
              <td style={styles.td}>{u.email}</td>
              <td style={styles.td}>
                <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)} style={styles.select}>
                  {["ADMIN", "ARTISAN", "BUYER", "MARKETING"].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </td>
              <td style={styles.td}>
                <span style={{ color: u.active ? "#2ecc71" : "#e74c3c" }}>
                  {u.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td style={styles.td}>
                <button style={u.active ? styles.btnDanger : styles.btnSuccess}
                  onClick={() => toggleStatus(u.id, u.active)}>
                  {u.active ? "Deactivate" : "Activate"}
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
  search: { padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6, marginBottom: 16, width: 300, fontSize: 14 },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  th: { background: "#2c3e50", color: "#fff", padding: "10px 14px", textAlign: "left", fontSize: 13 },
  td: { padding: "10px 14px", borderBottom: "1px solid #f0f0f0", fontSize: 13 },
  select: { padding: "4px 8px", border: "1px solid #ddd", borderRadius: 4 },
  btnDanger: { background: "#e74c3c", color: "#fff", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12 },
  btnSuccess: { background: "#2ecc71", color: "#fff", border: "none", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12 },
};
