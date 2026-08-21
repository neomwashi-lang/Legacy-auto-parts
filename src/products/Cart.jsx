{/* Neo Mwashi */}
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import {
  getCart,
  updateCartItemQuantity,
  removeFromCart,
  getCartTotal,
} from "../cart/cartStorage.js";

function Cart() {
  const [cart, setCart] = useState(getCart());
  const navigate = useNavigate();

  const handleQuantityChange = (productId, quantity) => {
    const updated = updateCartItemQuantity(productId, Math.max(1, quantity));
    setCart(updated);
  };

  const handleRemove = (productId) => {
    const updated = removeFromCart(productId);
    setCart(updated);
  };

  return (
    <div className="min-h-screen bg-admin-900 px-4 py-10 text-admin-ink sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-black tracking-[-0.06em]">Your Cart</h1>
          <Link to="/shop" className="btn btn-accent">
            Continue shopping
          </Link>
        </header>

        {cart.length === 0 ? (
          <p className="rounded-2xl border border-admin-accent/15 bg-admin-surface p-8 text-center text-admin-muted">
            Your cart is empty.
          </p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 rounded-2xl border border-admin-accent/15 bg-admin-surface p-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-sm text-admin-muted">{item.brand}</p>
                    <p className="text-admin-pink font-bold">KSh {item.price}</p>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.productId, Number(e.target.value) || 1)
                    }
                    className="w-20 rounded-lg border border-admin-accent/30 bg-admin-900 px-3 py-2 text-center text-admin-ink outline-none"
                  />
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="text-red-300 hover:text-red-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between rounded-2xl border border-admin-accent/15 bg-admin-surface p-6">
              <p className="text-xl font-bold">
                Total: <span className="text-admin-pink">KSh {getCartTotal(cart)}</span>
              </p>
              <button
                onClick={() => navigate("/checkout")}
                className="btn btn-accent"
              >
                Proceed to checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;