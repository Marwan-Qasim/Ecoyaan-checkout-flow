"use client";

import Link from "next/link";
import CheckoutNavbar from "@/components/CheckoutNavbar";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { hasValidAddress, useCheckout } from "@/app/providers";
import { getCartData } from "@/lib/cartService";

function formatCurrency(value, { free = false } = {}) {
  if (free && value === 0) {
    return "FREE";
  }

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function StrokeIcon({ children }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-stroke">
      {children}
    </svg>
  );
}

function UpiIcon() {
  return (
    <StrokeIcon>
      <path d="M7 6h10v12H7z" />
      <path d="M10 9.5h4" />
      <path d="M10 12h4" />
      <path d="M10 14.5h2.5" />
    </StrokeIcon>
  );
}

function CardIcon() {
  return (
    <StrokeIcon>
      <path d="M5 7.5h14v9H5z" />
      <path d="M5 10.5h14" />
      <path d="M8 14h3" />
    </StrokeIcon>
  );
}

function BankIcon() {
  return (
    <StrokeIcon>
      <path d="M4.5 9 12 5l7.5 4" />
      <path d="M6.5 10.5V17" />
      <path d="M10 10.5V17" />
      <path d="M14 10.5V17" />
      <path d="M17.5 10.5V17" />
      <path d="M4.5 18h15" />
    </StrokeIcon>
  );
}

function LockIcon() {
  return (
    <StrokeIcon>
      <path d="M8 11V8.5a4 4 0 1 1 8 0V11" />
      <path d="M7 11h10v8H7z" />
    </StrokeIcon>
  );
}

function LeafIcon() {
  return (
    <StrokeIcon>
      <path d="M16.5 6.5c-4.5 0-8 2.5-9 8 4.5 0 8-2.5 9-8Z" />
      <path d="M8.5 14.5c1.5-1.5 3.5-2.5 6-3" />
    </StrokeIcon>
  );
}

const paymentMethods = [
  {
    id: "upi",
    title: "UPI Payment",
    subtitle: "upi@naturalpayaxis",
    icon: UpiIcon,
  },
  {
    id: "card",
    title: "Credit/Debit Card",
    subtitle: "Visa, Mastercard, RuPay",
    icon: CardIcon,
  },
  {
    id: "bank",
    title: "Bank Transfer",
    subtitle: "Direct transfer from your bank",
    icon: BankIcon,
  },
];

export default function PaymentPage() {
  const router = useRouter();
  const { address } = useCheckout();
  const [data, setData] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("upi");

  useEffect(() => {
    if (!hasValidAddress(address)) {
      router.replace("/checkout");
      return;
    }

    let isMounted = true;

    async function loadCartData() {
      const cartData = await getCartData();
      if (isMounted) {
        setData(cartData);
      }
    }

    loadCartData();

    return () => {
      isMounted = false;
    };
  }, [address, router]);

  const subtotal = useMemo(
    () =>
      data
        ? data.cartItems.reduce((sum, item) => sum + item.product_price * item.quantity, 0)
        : 0,
    [data]
  );

  if (!hasValidAddress(address)) {
    return null;
  }

  if (!data) {
    return (
      <main className="checkout-shell payment-shell">
        <CheckoutNavbar activeStep="Payment" />
        <section className="panel">
          <div className="card">
            <p>Loading payment details...</p>
          </div>
        </section>
      </main>
    );
  }

  const ecoTax = data.shipping_fee;
  const shipping = 0;
  const grandTotal = subtotal + ecoTax + shipping;

  return (
    <main className="checkout-shell payment-shell">
      <CheckoutNavbar activeStep="Payment" />

      <section className="payment-hero">
        <h1>Review &amp; Pay</h1>
        <p>
          Curate your impact. Review your sustainable choices before finalizing
          your order.
        </p>
      </section>

      <section className="payment-layout">
        <div className="payment-main">
          <section className="payment-block">
            <div className="payment-block-head">
              <h2>Shipping Address</h2>
              <Link href="/checkout" className="mini-edit-link">
                Edit
              </Link>
            </div>

            <div className="shipping-review">
              <h3>{address.fullName}</h3>
              <p>{address.email}</p>
              <p>{address.city} - {address.pinCode}</p>
              <p>{address.state}, India</p>
              <p>{address.phone}</p>
            </div>
          </section>

          <section className="selection-review">
            <h2>Your Selection</h2>

            <div className="selection-list">
              {data.cartItems.map((item) => (
                <article key={item.product_id} className="selection-card">
                  <div
                    className="selection-thumb"
                    role="img"
                    aria-label={item.product_name}
                    style={{ backgroundImage: `url(${item.image})` }}
                  />

                  <div className="selection-copy">
                    <h3>{item.product_name}</h3>
                    <p>{item.product_description}</p>
                    <strong>₹{formatCurrency(item.product_price * item.quantity)}</strong>
                  </div>

                  <span className="selection-qty">Qty: {item.quantity}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="payment-block payment-methods-block">
            <h2>Payment Method</h2>

            <div className="payment-methods-list" role="radiogroup" aria-label="Payment Method">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const active = method.id === selectedMethod;

                return (
                  <button
                    key={method.id}
                    type="button"
                    className={`payment-method-row${active ? " is-selected" : ""}`}
                    onClick={() => setSelectedMethod(method.id)}
                    role="radio"
                    aria-checked={active}
                  >
                    <div className="payment-method-left">
                      <div className="payment-method-icon">
                        <Icon />
                      </div>

                      <div className="payment-method-copy">
                        <strong>{method.title}</strong>
                        <span>{method.subtitle}</span>
                      </div>
                    </div>

                    <span className={`payment-radio${active ? " is-selected" : ""}`} aria-hidden="true">
                      {active ? <span className="payment-radio-dot" /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="order-summary-panel">
          <h2>Order Summary</h2>

          <div className="order-summary-line">
            <span>Subtotal</span>
            <span>₹{formatCurrency(subtotal)}</span>
          </div>
          <div className="order-summary-line">
            <span>Shipping</span>
            <span>{formatCurrency(shipping, { free: true })}</span>
          </div>
          <div className="order-summary-line">
            <span>Eco-Tax</span>
            <span>₹{formatCurrency(ecoTax)}</span>
          </div>

          <div className="order-summary-total">
            <div>
              <span>Total Amount</span>
              <small>Tax Included</small>
            </div>
            <strong>₹{formatCurrency(grandTotal)}</strong>
          </div>

          <button type="button" className="pay-button" onClick={() => router.push("/success")}>
            Pay Securely
            <LockIcon />
          </button>

          <div className="impact-note">
            <LeafIcon />
            <p>
              Your purchase plants one sapling in the Western Ghats. Thank you
              for your conscious choice.
            </p>
          </div>

          <button type="button" className="summary-back-link" onClick={() => router.push("/checkout")}>
            Back to Address
          </button>
        </aside>
      </section>
    </main>
  );
}
