import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import ProductCard from "../../components/ProductCard";
import { toast } from "react-toastify";

export default function BuyerHome() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    api.get("/products/public").then((r) => {
      setProducts(r.data);
      setCategories([...new Set(r.data.map((p) => p.category))]);
    });
  }, []);

  const addToCart = async (product) => {
    try {
      await api.post("/buyer/cart", { productId: product.id, quantity: 1 });
      toast.success(`${product.name} added to cart!`);
    } catch { toast.error("Failed to add to cart"); }
  };

  const addToWishlist = async (product) => {
    try {
      await api.post("/buyer/wishlist", { productId: product.id });
      toast.success(`${product.name} added to wishlist!`);
    } catch { toast.error("Failed to add to wishlist"); }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === "" || p.category === category) &&
    (minPrice === "" || p.price >= parseFloat(minPrice)) &&
    (maxPrice === "" || p.price <= parseFloat(maxPrice))
  );

  return (
    <div style={styles.container}>
      <h2>Browse Handloom Products</h2>
      <div style={styles.filters}>
        <input style={styles.input} placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select style={styles.input} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input style={{ ...styles.input, width: 100 }} type="number" placeholder="Min ₹" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <input style={{ ...styles.input, width: 100 }} type="number" placeholder="Max ₹" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
      </div>
      <p style={{ color: "#666", fontSize: 13 }}>{filtered.length} products found</p>
      <div style={styles.grid}>
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} onAddToCart={addToCart} onAddToWishlist={addToWishlist} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: 24 },
  filters: { display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" },
  input: { padding: "8px 12px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 },
  grid: { display: "flex", flexWrap: "wrap", gap: 20 },
};
