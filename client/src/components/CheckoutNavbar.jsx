import Link from "next/link";

const steps = [
  { label: "Cart", href: "/" },
  { label: "Address", href: "/checkout" },
  { label: "Payment", href: "/payment" },
  { label: "Success", href: "/success" },
];

function StrokeIcon({ children }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-stroke">
      {children}
    </svg>
  );
}

function CartIcon() {
  return (
    <StrokeIcon>
      <path d="M8 7V6a4 4 0 1 1 8 0v1" />
      <path d="M6 7h12l1 13H5L6 7Z" />
    </StrokeIcon>
  );
}

function ProfileIcon() {
  return (
    <StrokeIcon>
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </StrokeIcon>
  );
}

export default function CheckoutNavbar({ activeStep }) {
  return (
    <header className="checkout-header">
      <Link href="/" className="brand-mark">
        Ecoyaan
      </Link>

      <nav className="checkout-steps" aria-label="Checkout progress">
        {steps.map((step) => (
          <Link
            key={step.label}
            href={step.href}
            className={step.label === activeStep ? "is-active" : undefined}
          >
            {step.label}
          </Link>
        ))}
      </nav>

      <div className="header-icons" aria-hidden="true">
        <CartIcon />
        <ProfileIcon />
      </div>
    </header>
  );
}
