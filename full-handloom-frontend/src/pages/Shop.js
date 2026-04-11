import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/products/public").then((res) => {
      setProducts(res.data);
      const cats = [...new Set(res.data.map((p) => p.category))];
      setCategories(cats);
    });
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "" || p.category === category)
  );

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1>Discover Authentic Handloom</h1>
        <p>Handcrafted with love by artisans across India. Shop unique, sustainable fashion.</p>
        <button style={styles.heroBtn} onClick={() => navigate("/register")}>Join as Buyer</button>
      </div>
      <div style={styles.filters}>
        <input style={styles.search} placeholder="Search products..." value={search}
          onChange={(e) => setSearch(e.target.value)} />
        <select style={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div style={styles.grid}>
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} showActions={false} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "0 24px 40px" },
  hero: { background: "linear-gradient(135deg,#2c3e50,#f39c12)", color: "#fff", padding: "60px 40px", textAlign: "center", borderRadius: 12, margin: "24px 0" },
  heroBtn: { marginTop: 16, padding: "12px 28px", background: "#fff", color: "#2c3e50", border: "none", borderRadius: 6, fontWeight: "bold", cursor: "pointer", fontSize: 15 },
  filters: { display: "flex", gap: 12, marginBottom: 24 },
  search: { flex: 1, padding: "10px 14px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14 },
  select: { padding: "10px 14px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14 },
  grid: { display: "flex", flexWrap: "wrap", gap: 20 },
};
