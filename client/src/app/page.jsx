import Link from "next/link";
import CheckoutNavbar from "@/components/CheckoutNavbar";
import { getCartData } from "@/lib/cartService";

export const dynamic = "force-dynamic";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-stroke">
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 12h10l1-12" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

export default async function Home() {
  const data = await getCartData();
  const subtotal = data.cartItems.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0
  );
  const grandTotal = subtotal + data.shipping_fee - data.discount_applied;

  return (
    <main className="checkout-shell">
      <CheckoutNavbar activeStep="Cart" />

      <section className="hero-copy">
        <p className="eyebrow">The Conscious Choice</p>
        <h1>Your Selection</h1>
      </section>

      <section className="cart-layout">
        <div className="cart-items-column">
          {data.cartItems.map((item) => (
            <article key={item.product_id} className="cart-item-card">
              <div
                className="cart-item-image"
                role="img"
                aria-label={item.product_name}
                style={{ backgroundImage: `url(${item.image})` }}
              />

              <div className="cart-item-body">
                <div className="cart-item-head">
                  <div>
                    <h2>{item.product_name}</h2>
                    <p>{item.product_description}</p>
                  </div>

                  <button type="button" className="icon-button" aria-label={`Remove ${item.product_name}`}>
                    <TrashIcon />
                  </button>
                </div>

                <div className="cart-item-footer">
                  <div className="qty-pill" aria-label={`Quantity ${item.quantity}`}>
                    <span>-</span>
                    <strong>{item.quantity}</strong>
                    <span>+</span>
                  </div>

                  <p className="item-total">{formatCurrency(item.product_price * item.quantity)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="summary-card">
          <h2>Summary</h2>

          <div className="summary-line">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="summary-line">
            <span>Eco-friendly Shipping</span>
            <span>{formatCurrency(data.shipping_fee)}</span>
          </div>

          <div className="summary-total">
            <p>Total Payable</p>
            <strong>{formatCurrency(grandTotal)}</strong>
            <span>Saving 1.2kg of plastic with this order</span>
          </div>

          <Link href="/checkout" className="checkout-cta">
            Proceed to Checkout
            <span aria-hidden="true">→</span>
          </Link>
        </aside>
      </section>
    </main>
  );
}
