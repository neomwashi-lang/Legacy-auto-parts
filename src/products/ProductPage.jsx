{/* Neo Mwashi */}
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import useFetch from "../hooks/useFetch";
import { API_BASE, getSession, userSessionKey } from "../auth/adminAuth.js";

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: product,
    loading,
    error,
  } = useFetch(`${API_BASE}/products/${id}`);

  const [quantity, setQuantity] = useState(1);
  const [orderStatus, setOrderStatus] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  const handleOrder = () => {
    const session = getSession(userSessionKey);

    if (!session) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }

    if (!session.verified) {
      setOrderStatus({
        type: "error",
        message: "Your account must be verified by an administrator before you can order parts.",
      });
      return;
    }

    setPlacingOrder(true);
    setOrderStatus(null);

    fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: id,
        productName: product.name,
        price: product.price,
        quantity,
        userId: session.id,
        userEmail: session.email,
        status: "pending",
        createdAt: new Date().toISOString(),
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Order request failed.");
        return response.json();
      })
      .then(() => {
        setOrderStatus({ type: "success", message: "Your order has been placed. Our team will contact you shortly." });
      })
      .catch(() => {
        setOrderStatus({ type: "error", message: "Unable to place your order right now. Please try again." });
      })
      .finally(() => setPlacingOrder(false));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-admin-900 via-[#102330] to-[#050a0f] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-5xl rounded-[2rem] bg-admin-panel/95 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.45)] sm:p-6 lg:p-8">
        {loading ? (
          <p className="text-admin-muted">Loading...</p>
        ) : error ? (
          <p className="text-red-300">Error: {error}</p>
        ) : product ? (
          <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="overflow-hidden rounded-[2rem] bg-[#0f2438] p-3 shadow-[0_18px_34px_rgba(0,0,0,0.35)]">
              <img
                src={product.image}
                alt={product.name}
                className="h-[360px] w-full rounded-[1.5rem] object-cover sm:h-[390px]"
              />
            </div>

            <div className="flex flex-col justify-center px-2 py-4">
              <p className="label">only the best</p>

              <h2 className="mt-4 text-5xl font-black leading-none tracking-[-0.07em] text-admin-ink sm:text-6xl">
                {product.name}
              </h2>

              <p className="mt-3 text-4xl font-bold leading-none tracking-[-0.05em] text-admin-accentSoft sm:text-5xl">
                {product.brand}
              </p>

              <p className="mt-8 text-lg font-medium text-admin-muted">
                <span className="text-admin-ink">
                  Only the best in all of kenya
                </span>
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/shop" className="btn btn-accent">
                  Back to shop
                </Link>
              </div>

              <div className="card mt-6">
                <p className="label">Product details</p>
                <p className="mt-3 text-base leading-7 text-admin-muted">
                  {product.description}
                </p>
                <p className="mt-4 text-2xl font-bold text-admin-pink">
                  KSh {product.price}
                </p>
              </div>

              <div className="card mt-6">
                <p className="label">Order this part</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label className="text-sm text-admin-muted">
                    Quantity
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                      className="mt-1 w-24 rounded-lg border border-admin-accent/30 bg-admin-900 px-3 py-2 text-admin-ink outline-none focus:border-admin-accent"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleOrder}
                    disabled={placingOrder}
                    className="btn btn-accent disabled:opacity-60"
                  >
                    {placingOrder ? "Placing order..." : "Order part"}
                  </button>
                </div>
                <p className="mt-3 text-xs text-admin-muted">
                  Only verified customer accounts can order parts.{" "}
                  <Link to="/login" className="font-semibold text-admin-accentSoft hover:underline">Sign in</Link>{" "}
                  or <Link to="/register" className="font-semibold text-admin-accentSoft hover:underline">register</Link>.
                </p>
                {orderStatus && (
                  <p
                    className={`mt-3 rounded-lg px-4 py-3 text-sm ${
                      orderStatus.type === "success"
                        ? "border border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                        : "border border-red-400/30 bg-red-500/10 text-red-200"
                    }`}
                  >
                    {orderStatus.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ProductPage;
