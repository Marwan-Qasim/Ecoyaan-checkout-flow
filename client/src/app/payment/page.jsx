"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { hasValidAddress, useCheckout } from "@/app/providers";
import { getCartData } from "@/lib/cartService";

export default function PaymentPage() {
  const router = useRouter();
  const { address } = useCheckout();
  const [data, setData] = useState(null);

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
      <main className="page-shell">
        <header className="top-bar">
          <h1>Ecoyaan Checkout</h1>
        </header>
        <section className="panel">
          <div className="card">
            <p>Loading payment details...</p>
          </div>
        </section>
      </main>
    );
  }

  const grandTotal = subtotal + data.shipping_fee - data.discount_applied;

  return (
    <main className="page-shell">
      <header className="top-bar">
        <h1>Ecoyaan Checkout</h1>
      </header>

      <section className="panel two-col">
        <div className="card">
          <h2>Shipping Address</h2>
          <p><strong>Name:</strong> {address.fullName}</p>
          <p><strong>Email:</strong> {address.email}</p>
          <p><strong>Phone:</strong> {address.phone}</p>
          <p><strong>PIN:</strong> {address.pinCode}</p>
          <p><strong>City:</strong> {address.city}</p>
          <p><strong>State:</strong> {address.state}</p>
          <Link className="link-btn" href="/checkout">Edit Address</Link>
        </div>

        <div className="card">
          <h2>Order Summary</h2>
          {data.cartItems.map((item) => (
            <div key={item.product_id} className="summary-row">
              <span>{item.product_name} x {item.quantity}</span>
              <span>Rs. {item.product_price * item.quantity}</span>
            </div>
          ))}
          <div className="summary-row"><span>Subtotal</span><span>Rs. {subtotal}</span></div>
          <div className="summary-row"><span>Shipping</span><span>Rs. {data.shipping_fee}</span></div>
          <div className="summary-row total"><span>Grand Total</span><span>Rs. {grandTotal}</span></div>

          <button type="button" className="primary-btn" onClick={() => router.push("/success")}>
            Pay Securely
          </button>
        </div>
      </section>
    </main>
  );
}
