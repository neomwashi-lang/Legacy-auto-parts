{/* Neo Mwashi */}
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { API_BASE, getSession, userSessionKey } from "../auth/adminAuth.js";
import { getCart, getCartTotal, clearCart } from "../cart/cartStorage.js";

function Checkout() {
  const navigate = useNavigate();
  const session = getSession(userSessionKey);
  const [cart] = useState(getCart());
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cardName, setCardName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session) {
      navigate("/login", { state: { from: "/checkout" } });
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  if (cart.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-admin-900 text-admin-ink">
        <p>Your cart is empty. <a href="/shop" className="text-admin-accent underline">Go shopping</a>.</p>
      </div>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!cardNumber.trim() || !expiry.trim() || !cardName.trim()) {
      setError("Please fill in all payment details.");
      return;
    }

    setSubmitting(true);

    const orderRequests = cart.map((item) =>
      fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.productId,
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
          userId: session.id,
          userEmail: session.email,
          status: "pending",
          createdAt: new Date().toISOString(),
        }),
      })
    );

    Promise.all(orderRequests)
      .then(() => {
        clearCart();
        navigate("/order-confirmation");
      })
      .catch(() => {
        setError("Something went wrong placing your order. Please try again.");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="min-h-screen bg-admin-900 px-4 py-10 text-admin-ink sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-4xl font-black tracking-[-0.06em]">Checkout</h1>

        <div className="mb-6 rounded-2xl border border-admin-accent/15 bg-admin-surface p-6">
          <p className="mb-3 label">Order summary</p>
          {cart.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm text-admin-muted">
              <span>{item.name} × {item.quantity}</span>
              <span>KSh {item.price * item.quantity}</span>
            </div>
          ))}
          <div className="mt-3 flex justify-between border-t border-admin-accent/15 pt-3 text-lg font-bold">
            <span>Total</span>
            <span className="text-admin-pink">KSh {getCartTotal(cart)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <p className="label">Payment details (demo — no real charge)</p>

          <label className="block text-sm text-admin-muted">
            Card number
            <input
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              className="mt-1 w-full rounded-lg border border-admin-accent/30 bg-admin-900 px-3 py-2 text-admin-ink outline-none focus:border-admin-accent"
            />
          </label>

          <label className="block text-sm text-admin-muted">
            Expiry
            <input
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM/YY"
              maxLength={5}
              className="mt-1 w-full rounded-lg border border-admin-accent/30 bg-admin-900 px-3 py-2 text-admin-ink outline-none focus:border-admin-accent"
            />
          </label>

          <label className="block text-sm text-admin-muted">
            Name on card
            <input
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-admin-accent/30 bg-admin-900 px-3 py-2 text-admin-ink outline-none focus:border-admin-accent"
            />
          </label>

          {error && (
            <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting} className="btn btn-accent w-full disabled:opacity-60">
            {submitting ? "Placing order..." : `Pay KSh ${getCartTotal(cart)}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;