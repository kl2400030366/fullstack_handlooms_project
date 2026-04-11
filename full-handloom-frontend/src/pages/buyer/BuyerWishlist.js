import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";

export default function BuyerWishlist() {
  const [wishlist, setWishlist] = useState([]);

  const load = () => api.get("/buyer/wishlist").then((r) => setWishlist(r.data));
  useEffect(() => { load(); }, []);

  const removeFromWishlist = async (id) => {
    await api.delete(`/buyer/wishlist/${id}`);
    toast.info("Removed from wishlist"); load();
  };

  const moveToCart = async (productId, wishlistId) => {
    await api.post("/buyer/cart", { productId, quantity: 1 });
    await api.delete(`/buyer/wishlist/${wishlistId}`);
    toast.success("Moved to cart!"); load();
  };

  return (
    <div style={styles.container}>
      <h2>My Wishlist</h2>
      {wishlist.length === 0 ? <p>Your wishlist is empty.</p> : (
        <div style={styles.grid}>
          {wishlist.map((item) => (
            <div key={item.id} style={styles.card}>
              <img src={item.imageUrl || "https://via.placeholder.com/200x140"} alt={item.productName} style={styles.img} />
              <div style={styles.body}>
                <h4 style={styles.name}>{item.productName}</h4>
                <p style={styles.price}>₹{item.price}</p>
                <div style={styles.actions}>
                  <button style={styles.btnCart} onClick={() => moveToCart(item.productId, item.id)}>Add to Cart</button>
                  <button style={styles.btnRemove} onClick={() => removeFromWishlist(item.id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: 24 },
  grid: { display: "flex", flexWrap: "wrap", gap: 20 },
  card: { border: "1px solid #ddd", borderRadius: 8, overflow: "hidden", width: 220, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  img: { width: "100%", height: 140, objectFit: "cover" },
  body: { padding: 12 },
  name: { margin: "0 0 6px", fontSize: 14 },
  price: { color: "#e67e22", fontWeight: "bold", margin: "0 0 10px" },
  actions: { display: "flex", gap: 6 },
  btnCart: { flex: 1, background: "#2c3e50", color: "#fff", border: "none", padding: "6px 0", borderRadius: 4, cursor: "pointer", fontSize: 12 },
  btnRemove: { flex: 1, background: "#e74c3c", color: "#fff", border: "none", padding: "6px 0", borderRadius: 4, cursor: "pointer", fontSize: 12 },
};
