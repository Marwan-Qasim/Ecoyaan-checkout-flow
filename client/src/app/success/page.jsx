"use client";

import Link from "next/link";
import { useCheckout } from "@/app/providers";
import CheckoutNavbar from "@/components/CheckoutNavbar";

function StrokeIcon({ children }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-stroke">
      {children}
    </svg>
  );
}

function CheckBadgeIcon() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className="success-badge-art">
      <circle cx="60" cy="54" r="30" className="success-badge-ring" />
      <circle cx="60" cy="54" r="18" className="success-badge-core" />
      <path d="m51 54 7 7 12-15" className="success-badge-check" />
      <path d="M26 86c4 0 7 3 7 7-4 0-7-3-7-7Z" className="success-badge-leaf" />
      <path d="M27 92c3-3 8-4 12-4" className="success-badge-leaf-stroke" />
      <path d="M88 23c5-6 12-6 17-2-5 6-12 6-17 2Z" className="success-badge-leaf" />
    </svg>
  );
}

function DropIcon() {
  return (
    <StrokeIcon>
      <path d="M12 4.5c2.5 3 4.5 5.7 4.5 8.2A4.5 4.5 0 1 1 7.5 12.7C7.5 10.2 9.5 7.5 12 4.5Z" />
    </StrokeIcon>
  );
}

function CycleIcon() {
  return (
    <StrokeIcon>
      <path d="M12 6a6 6 0 1 0 5.2 9" />
      <path d="M14.5 6H18v3.5" />
      <path d="M18 6l-3.2 3.2" />
    </StrokeIcon>
  );
}

function ArrowRightIcon() {
  return (
    <StrokeIcon>
      <path d="m9 6 6 6-6 6" />
      <path d="M15 12H7" />
    </StrokeIcon>
  );
}

export default function SuccessPage() {
  const { address } = useCheckout();

  return (
    <main className="checkout-shell success-shell">
      <CheckoutNavbar activeStep="Success" />

      <section className="success-hero-block">
        <div className="success-badge-wrap">
          <CheckBadgeIcon />
        </div>

        <h1>Order Successful!</h1>
        <p className="success-order-id">Order ID: #ECO-12345</p>
      </section>

      <section className="success-message-card">
        <span className="success-pill">Sustainability Champion</span>
        <h2>Thank you for choosing sustainability! Your order is on its way.</h2>
        <p>
          By shopping with Ecoyaan, you&apos;ve saved 2.4kg of plastic and
          supported local organic farmers. We&apos;ve sent a detailed receipt and
          tracking link to your email.
        </p>
      </section>

      <section className="success-info-grid">
        <article className="success-info-card">
          <h3>Delivery Address</h3>
          <p>{address.fullName}</p>
          <p>{address.email}</p>
          <p>{address.city} - {address.pinCode}</p>
          <p>{address.state}, India</p>
          <p>{address.phone}</p>
        </article>

        <article className="success-info-card">
          <h3>Impact Tracker</h3>

          <div className="impact-list">
            <div className="impact-item">
              <span className="impact-icon">
                <DropIcon />
              </span>
              <p>45 Liters of water saved</p>
            </div>
            <div className="impact-item">
              <span className="impact-icon">
                <CycleIcon />
              </span>
              <p>Low carbon logistics used</p>
            </div>
          </div>
        </article>
      </section>

      <div className="success-cta-row">
        <Link href="/" className="success-cta-btn">
          Continue Shopping
          <ArrowRightIcon />
        </Link>
      </div>
    </main>
  );
}
