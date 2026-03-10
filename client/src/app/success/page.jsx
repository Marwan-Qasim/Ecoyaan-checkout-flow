import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="page-shell">
      <section className="panel success-panel">
        <h1>Order Successful!</h1>
        <p>Your payment was completed and your order has been placed.</p>
        <Link href="/" className="primary-btn">
          Back to Cart
        </Link>
      </section>
    </main>
  );
}
