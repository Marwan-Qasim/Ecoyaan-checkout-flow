import Link from "next/link";
import { getCartData } from "@/lib/cartService";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getCartData();
  const subtotal = data.cartItems.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0
  );
  const grandTotal = subtotal + data.shipping_fee - data.discount_applied;

  return (
    <main className="page-shell">
      <header className="top-bar">
        <h1>Ecoyaan Checkout</h1>
      </header>

      <section className="panel">
        <h2>Cart / Order Summary</h2>

        {data.cartItems.map((item) => (
          <article key={item.product_id} className="product-row">
            <img src={item.image} alt={item.product_name} className="product-thumb" />
            <div className="product-copy">
              <h3>{item.product_name}</h3>
              <p>Price: Rs. {item.product_price}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
            <p className="line-total">Rs. {item.product_price * item.quantity}</p>
          </article>
        ))}

        <div className="totals">
          <p>
            <span>Subtotal</span>
            <span>Rs. {subtotal}</span>
          </p>
          <p>
            <span>Shipping Fee</span>
            <span>Rs. {data.shipping_fee}</span>
          </p>
          <p className="total-strong">
            <span>Grand Total</span>
            <span>Rs. {grandTotal}</span>
          </p>
        </div>

        <div className="action-row">
          <Link href="/checkout" className="primary-btn">
            Proceed to Checkout
          </Link>
        </div>
      </section>
    </main>
  );
}
