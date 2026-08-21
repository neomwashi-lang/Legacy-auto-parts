{/* Neo Mwashi */}
import { Link } from "react-router";

function OrderConfirmation() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-900 px-4 text-admin-ink">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-admin-accent/15 bg-admin-surface p-8 text-center shadow-admin">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-admin-accent/15">
          <span className="text-3xl text-admin-accent">✓</span>
        </div>

        <h1 className="text-2xl font-black">Order placed!</h1>

        <p className="mt-3 text-sm leading-6 text-admin-muted">
          Thank you for your order. Our team will review it and contact you
          shortly to confirm availability and delivery details.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link to="/shop" className="btn btn-accent">
            Continue shopping
          </Link>
          <Link to="/" className="btn btn-outline">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;