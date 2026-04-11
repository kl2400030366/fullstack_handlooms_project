import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";

export default function BuyerCart() {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const load = () => api.get("/buyer/cart").then((r) => setCart(r.data));
  useEffect(() => { load(); }, []);

  const updateQty = async (id, qty) => {
    if (qty < 1) return;
    await api.put(`/buyer/cart/${id}`, { quantity: qty });
    load();
  };

  const removeItem = async (id) => {
    await api.delete(`/buyer/cart/${id}`);
    toast.info("Item removed"); load();
  };

  const checkout = async () => {
    if (!address.trim()) { toast.error("Please enter delivery address"); return; }
    try {
      await api.post("/buyer/orders", { address });
      toast.success("Order placed successfully!");
      navigate("/buyer/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout failed");
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={styles.container}>
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty. <a href="/buyer/home">Continue shopping</a></p>
      ) : (
        <div style={styles.layout}>
          <div style={styles.items}>
            {cart.map((item) => (
              <div key={item.id} style={styles.item}>
                <img src={item.imageUrl || "https://via.placeholder.com/80"} alt={item.productName} style={styles.img} />
                <div style={styles.info}>
                  <h4 style={{ margin: 0 }}>{item.productName}</h4>
                  <p style={styles.price}>₹{item.price} each</p>
                </div>
                <div style={styles.qtyControl}>
                  <button style={styles.qtyBtn} onClick={() => updateQty(item.id, item.quantity - 1)}>-</button>
                  <span style={styles.qty}>{item.quantity}</span>
                  <button style={styles.qtyBtn} onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                </div>
                <p style={styles.subtotal}>₹{item.price * item.quantity}</p>
                <button style={styles.remove} onClick={() => removeItem(item.id)}>✕</button>
              </div>
            ))}
          </div>
          <div style={styles.summary}>
            <h3>Order Summary</h3>
            <p>Items: {cart.length}</p>
            <p style={styles.total}>Total: ₹{total}</p>
            <textarea style={styles.address} placeholder="Delivery address..." value={address}
              onChange={(e) => setAddress(e.target.value)} rows={3} />
            <button style={styles.checkoutBtn} onClick={checkout}>Place Order</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: 24 },
  layout: { display: "flex", gap: 24 },
  items: { flex: 1 },
  item: { display: "flex", alignItems: "center", gap: 16, background: "#fff", padding: 16, borderRadius: 8, marginBottom: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.06)" },
  img: { width: 80, height: 60, objectFit: "cover", borderRadius: 6 },
  info: { flex: 1 },
  price: { color: "#e67e22", margin: "4px 0 0", fontSize: 13 },
  qtyControl: { display: "flex", alignItems: "center", gap: 8 },
  qtyBtn: { width: 28, height: 28, border: "1px solid #ddd", background: "#f5f5f5", cursor: "pointer", borderRadius: 4, fontSize: 16 },
  qty: { fontSize: 15, fontWeight: "bold", minWidth: 24, textAlign: "center" },
  subtotal: { fontWeight: "bold", minWidth: 70, textAlign: "right" },
  remove: { background: "none", border: "none", color: "#e74c3c", cursor: "pointer", fontSize: 16 },
  summary: { width: 260, background: "#fff", padding: 20, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", height: "fit-content" },
  total: { fontSize: 20, fontWeight: "bold", color: "#2c3e50" },
  address: { width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 6, fontSize: 13, boxSizing: "border-box", marginTop: 8 },
  checkoutBtn: { width: "100%", padding: 12, background: "#e67e22", color: "#fff", border: "none", borderRadius: 6, fontSize: 15, cursor: "pointer", marginTop: 12 },
};
