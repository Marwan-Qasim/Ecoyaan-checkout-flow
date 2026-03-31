"use client";

import CheckoutNavbar from "@/components/CheckoutNavbar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCheckout } from "@/app/providers";

const initialErrors = {
  fullName: "",
  email: "",
  phone: "",
  pinCode: "",
  city: "",
  state: "",
};

const savedAddresses = [
  {
    id: "home",
    title: "Amrita Singh",
    lines: [
      "42 Green Terrace, Bloom Gardens",
      "Indiranagar, Bangalore",
      "Karnataka - 560038",
    ],
    phone: "+91 98765 43210",
    type: "home",
  },
  {
    id: "office",
    title: "Amrita Singh",
    lines: [
      "EcoHub Coworking Space, Level 4",
      "Outer Ring Road",
      "Bangalore, Karnataka - 560103",
    ],
    phone: "+91 98765 43210",
    type: "office",
  },
];

function validate(values) {
  const errors = { ...initialErrors };

  if (!values.fullName.trim()) {
    errors.fullName = "Full Name is required";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email";
  }

  if (!/^\d{10}$/.test(values.phone.trim())) {
    errors.phone = "Phone number must be 10 digits";
  }

  if (!/^\d{6}$/.test(values.pinCode.trim())) {
    errors.pinCode = "PIN Code must be 6 digits";
  }

  if (!values.city.trim()) {
    errors.city = "City is required";
  }

  if (!values.state.trim()) {
    errors.state = "State is required";
  }

  return errors;
}

function StrokeIcon({ children }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-stroke">
      {children}
    </svg>
  );
}

function HomeIcon() {
  return (
    <StrokeIcon>
      <path d="M5 11.5 12 6l7 5.5" />
      <path d="M7.5 10.5V18h9v-7.5" />
    </StrokeIcon>
  );
}

function BriefcaseIcon() {
  return (
    <StrokeIcon>
      <path d="M8 7V5.5h8V7" />
      <path d="M4.5 8h15v10.5h-15z" />
      <path d="M4.5 11.5h15" />
    </StrokeIcon>
  );
}

function PencilIcon() {
  return (
    <StrokeIcon>
      <path d="m8 16 6.75-6.75 1.75 1.75L9.75 17.75 7.5 18.5z" />
      <path d="m13.75 10.25 1.75-1.75 1.75 1.75-1.75 1.75" />
    </StrokeIcon>
  );
}

function CheckIcon() {
  return (
    <StrokeIcon>
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </StrokeIcon>
  );
}

function PlusIcon() {
  return (
    <StrokeIcon>
      <path d="M12 7v10" />
      <path d="M7 12h10" />
    </StrokeIcon>
  );
}

function ArrowLeftIcon() {
  return (
    <StrokeIcon>
      <path d="M15 6 9 12l6 6" />
      <path d="M9 12h8" />
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

export default function CheckoutPage() {
  const router = useRouter();
  const { address, setAddress } = useCheckout();
  const [values, setValues] = useState(address);
  const [errors, setErrors] = useState(initialErrors);
  const [selectedAddress, setSelectedAddress] = useState("home");
  const [useDefault, setUseDefault] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some(Boolean);
    if (hasErrors) {
      return;
    }

    setAddress(values);
    router.push("/payment");
  }

  return (
    <main className="checkout-shell address-shell">
      <CheckoutNavbar activeStep="Address" />

      <section className="address-hero">
        <h1>Shipping Address</h1>
        <p>
          Select a destination for your sustainable essentials. Every delivery
          is carbon-neutral.
        </p>
      </section>

      <section className="saved-section">
        <div className="saved-section-heading">
          <h2>Saved Addresses</h2>
          <span>2 Saved</span>
        </div>

        <div className="saved-grid">
          {savedAddresses.map((item) => {
            const active = item.id === selectedAddress;
            const TypeIcon = item.type === "home" ? HomeIcon : BriefcaseIcon;

            return (
              <article
                key={item.id}
                className={`saved-card${active ? " is-selected" : ""}`}
                onClick={() => setSelectedAddress(item.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedAddress(item.id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={active}
              >
                <div className="saved-card-top">
                  <div className="saved-icon-wrap">
                    <TypeIcon />
                  </div>

                  <div className="saved-card-actions">
                    <button type="button" className="saved-round-btn" aria-label={`Edit ${item.title}`}>
                      <PencilIcon />
                    </button>
                    {active ? (
                      <span className="saved-round-btn saved-round-btn-dark" aria-hidden="true">
                        <CheckIcon />
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="saved-card-copy">
                  <h3>{item.title}</h3>
                  {item.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <span>{item.phone}</span>
                </div>
              </article>
            );
          })}
        </div>

        <button type="button" className="add-address-btn">
          <PlusIcon />
          Add New Address
        </button>
      </section>

      <div className="section-divider">
        <span>Or Add New Address</span>
      </div>

      <form className="address-form-card" onSubmit={handleSubmit} noValidate>
        <div className="address-form-grid">
          <label>
            Full Name
            <input
              name="fullName"
              value={values.fullName}
              onChange={handleChange}
              placeholder="John Doe"
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </label>

          <label>
            Email Address
            <input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </label>

          <label>
            Phone Number
            <input
              name="phone"
              value={values.phone}
              onChange={handleChange}
              placeholder="10-digit mobile"
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </label>

          <label>
            PIN Code
            <input
              name="pinCode"
              value={values.pinCode}
              onChange={handleChange}
              placeholder="6-digit code"
            />
            {errors.pinCode && <span className="error-text">{errors.pinCode}</span>}
          </label>

          <label>
            City
            <input
              name="city"
              value={values.city}
              onChange={handleChange}
              placeholder="e.g. Bangalore"
            />
            {errors.city && <span className="error-text">{errors.city}</span>}
          </label>

          <label>
            State
            <select name="state" value={values.state} onChange={handleChange}>
              <option value="">Select state</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Delhi">Delhi</option>
            </select>
            {errors.state && <span className="error-text">{errors.state}</span>}
          </label>
        </div>

        <label className="default-checkbox">
          <input
            type="checkbox"
            checked={useDefault}
            onChange={(event) => setUseDefault(event.target.checked)}
          />
          <span>Set as default shipping address</span>
        </label>

        <div className="address-footer-bar">
          <button type="button" className="back-link" onClick={() => router.push("/")}>
            <ArrowLeftIcon />
            Back
          </button>

          <button type="submit" className="address-submit-btn">
            Continue to Payment
            <ArrowRightIcon />
          </button>
        </div>
      </form>
    </main>
  );
}
