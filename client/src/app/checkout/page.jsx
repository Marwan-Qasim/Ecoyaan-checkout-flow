"use client";

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

export default function CheckoutPage() {
  const router = useRouter();
  const { address, setAddress } = useCheckout();
  const [values, setValues] = useState(address);
  const [errors, setErrors] = useState(initialErrors);

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
    <main className="page-shell">
      <header className="top-bar">
        <h1>Ecoyaan Checkout</h1>
      </header>

      <section className="panel">
        <h2>Shipping Address</h2>

        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          <label>
            Full Name
            <input name="fullName" value={values.fullName} onChange={handleChange} />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </label>

          <label>
            Email
            <input name="email" type="email" value={values.email} onChange={handleChange} />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </label>

          <label>
            Phone Number
            <input name="phone" value={values.phone} onChange={handleChange} />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </label>

          <label>
            PIN Code
            <input name="pinCode" value={values.pinCode} onChange={handleChange} />
            {errors.pinCode && <span className="error-text">{errors.pinCode}</span>}
          </label>

          <label>
            City
            <input name="city" value={values.city} onChange={handleChange} />
            {errors.city && <span className="error-text">{errors.city}</span>}
          </label>

          <label>
            State
            <input name="state" value={values.state} onChange={handleChange} />
            {errors.state && <span className="error-text">{errors.state}</span>}
          </label>

          <div className="action-row">
            <button type="submit" className="primary-btn">
              Continue to Payment
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
