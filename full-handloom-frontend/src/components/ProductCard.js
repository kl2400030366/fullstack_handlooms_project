import React from "react";

export default function ProductCard({ product, onAddToCart, onAddToWishlist, showActions = true }) {
  return (
    <div style={styles.card}>
      <img
        src={product.imageUrl || "https://via.placeholder.com/200x150?text=Handloom"}
        alt={product.name}
        style={styles.img}
      />
      <div style={styles.body}>
        <h4 style={styles.name}>{product.name}</h4>
        <p style={styles.desc}>{product.description?.substring(0, 60)}...</p>
        <p style={styles.price}>₹{product.price}</p>
        <p style={styles.meta}>Category: {product.category} | Stock: {product.quantity}</p>
        {showActions && (
          <div style={styles.actions}>
            {onAddToCart && (
              <button style={styles.btnPrimary} onClick={() => onAddToCart(product)}>Add to Cart</button>
            )}
            {onAddToWishlist && (
              <button style={styles.btnSecondary} onClick={() => onAddToWishlist(product)}>♡ Wishlist</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: { border: "1px solid #ddd", borderRadius: 8, overflow: "hidden", width: 220, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  img: { width: "100%", height: 150, objectFit: "cover" },
  body: { padding: 12 },
  name: { margin: "0 0 4px", fontSize: 15, fontWeight: "bold" },
  desc: { fontSize: 12, color: "#666", margin: "0 0 6px" },
  price: { fontSize: 16, color: "#e67e22", fontWeight: "bold", margin: "0 0 4px" },
  meta: { fontSize: 11, color: "#999", margin: "0 0 8px" },
  actions: { display: "flex", gap: 6 },
  btnPrimary: { flex: 1, background: "#2c3e50", color: "#fff", border: "none", padding: "6px 0", borderRadius: 4, cursor: "pointer", fontSize: 12 },
  btnSecondary: { flex: 1, background: "#f39c12", color: "#fff", border: "none", padding: "6px 0", borderRadius: 4, cursor: "pointer", fontSize: 12 },
};
