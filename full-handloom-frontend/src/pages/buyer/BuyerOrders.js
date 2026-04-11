import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [reviewForm, setReviewForm] = useState({ orderId: null, rating: 5, comment: "" });

  const load = () => api.get("/buyer/orders").then((r) => setOrders(r.data));
  useEffect(() => { load(); }, []);

  const cancelOrder = async (id) => {
    await api.put(`/buyer/orders/${id}/cancel`);
    toast.success("Order cancelled"); load();
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/buyer/orders/${reviewForm.orderId}/review`, {
        rating: reviewForm.rating, comment: reviewForm.comment,
      });
      toast.success("Review submitted!"); setReviewForm({ orderId: null, rating: 5, comment: "" }); load();
    } catch { toast.error("Failed to submit review"); }
  };

  const statusColor = { PENDING: "#f39c12", CONFIRMED: "#3498db", SHIPPED: "#9b59b6", DELIVERED: "#2ecc71", CANCELLED: "#e74c3c" };

  return (
    <div style={styles.container}>
      <h2>My Orders</h2>
      {orders.length === 0 ? <p>No orders yet.</p> : orders.map((o) => (
        <div key={o.id} style={styles.card}>
          <div style={styles.cardHeader}>
            <span>Order #{o.id} — {new Date(o.createdAt).toLocaleDateString()}</span>
            <span style={{ ...styles.badge, background: statusColor[o.status] || "#ddd" }}>{o.status}</span>
          </div>
          <div style={styles.items}>
            {(o.items || []).map((item) => (
              <div key={item.id} style={styles.item}>
                <span>{item.productName}</span>
                <span>x{item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div style={styles.cardFooter}>
            <strong>Total: ₹{o.totalAmount}</strong>
            <div style={styles.actions}>
              {o.status === "PENDING" && (
                <button style={styles.btnDanger} onClick={() => cancelOrder(o.id)}>Cancel</button>
              )}
              {o.status === "DELIVERED" && !o.reviewed && (
                <button style={styles.btnReview} onClick={() => setReviewForm({ ...reviewForm, orderId: o.id })}>
                  Write Review
                </button>
              )}
            </div>
          </div>
          {reviewForm.orderId === o.id && (
            <form onSubmit={submitReview} style={styles.reviewForm}>
              <label>Rating: </label>
              <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}>
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{"⭐".repeat(r)}</option>)}
              </select>
              <textarea style={styles.textarea} placeholder="Your review..." value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} required />
              <button style={styles.btnPrimary} type="submit">Submit Review</button>
              <button type="button" style={styles.btnCancel} onClick={() => setReviewForm({ orderId: null, rating: 5, comment: "" })}>Cancel</button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { padding: 24 },
  card: { background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: 16, overflow: "hidden" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#f8f9fa", borderBottom: "1px solid #eee" },
  badge: { padding: "3px 10px", borderRadius: 12, color: "#fff", fontSize: 12, fontWeight: "bold" },
  items: { padding: "12px 16px" },
  item: { display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13, borderBottom: "1px solid #f5f5f5" },
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderTop: "1px solid #eee" },
  actions: { display: "flex", gap: 8 },
  btnDanger: { background: "#e74c3c", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: 12 },
  btnReview: { background: "#f39c12", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: 12 },
  reviewForm: { padding: "12px 16px", background: "#f8f9fa", borderTop: "1px solid #eee" },
  textarea: { display: "block", width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 6, margin: "8px 0", fontSize: 13, boxSizing: "border-box" },
  btnPrimary: { background: "#2c3e50", color: "#fff", border: "none", padding: "6px 14px", borderRadius: 4, cursor: "pointer", fontSize: 12, marginRight: 8 },
  btnCancel: { background: "#95a5a6", color: "#fff", border: "none", padding: "6px 14px", borderRadius: 4, cursor: "pointer", fontSize: 12 },
};
