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

const emptyAddress = {
  fullName: "",
  email: "",
  phone: "",
  pinCode: "",
  city: "",
  state: "",
};

const MAX_SAVED_ADDRESSES = 2;

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

function formatPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) {
    return phone;
  }
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

function toSavedAddress(values, index) {
  return {
    id: `address-${Date.now()}-${index}`,
    title: values.fullName.trim(),
    lines: [values.city.trim(), `${values.state.trim()} - ${values.pinCode.trim()}`],
    phone: formatPhone(values.phone.trim()),
    email: values.email.trim(),
    values: {
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      pinCode: values.pinCode.trim(),
      city: values.city.trim(),
      state: values.state.trim(),
    },
    type: index % 2 === 0 ? "home" : "office",
  };
}

function StrokeIcon({ children }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-stroke">
      {children}
    </svg>
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

function TrashIcon() {
  return (
    <StrokeIcon>
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 12h10l1-12" />
      <path d="M9 7V4h6v3" />
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
  const {
    address,
    setAddress,
    savedAddresses,
    setSavedAddresses,
    selectedAddressId,
    setSelectedAddressId,
    defaultAddressId,
    setDefaultAddressId,
  } = useCheckout();
  const [values, setValues] = useState(address);
  const [errors, setErrors] = useState(initialErrors);
  const [useDefault, setUseDefault] = useState(false);
  const [limitError, setLimitError] = useState("");
  const [editingAddressId, setEditingAddressId] = useState("");

  const hasSavedAddresses = savedAddresses.length > 0;
  const isEditing = Boolean(editingAddressId);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (limitError) {
      setLimitError("");
    }
  }

  function handleAddAddress(event) {
    event.preventDefault();

    if (!isEditing && savedAddresses.length >= MAX_SAVED_ADDRESSES) {
      setLimitError("You can add at most 2 addresses.");
      return;
    }

    const validationErrors = validate(values);
    setErrors(validationErrors);
    setLimitError("");

    const hasErrors = Object.values(validationErrors).some(Boolean);
    if (hasErrors) {
      return;
    }

    if (isEditing) {
      const existingAddress = savedAddresses.find((item) => item.id === editingAddressId);
      if (!existingAddress) {
        setEditingAddressId("");
        return;
      }

      const updatedAddress = {
        ...toSavedAddress(values, savedAddresses.length),
        id: existingAddress.id,
        type: existingAddress.type,
      };

      setSavedAddresses((prev) =>
        prev.map((item) => (item.id === editingAddressId ? updatedAddress : item))
      );
      setSelectedAddressId(updatedAddress.id);
      if (useDefault) {
        setDefaultAddressId(updatedAddress.id);
      } else if (defaultAddressId === updatedAddress.id) {
        setDefaultAddressId("");
      }
      setAddress(updatedAddress.values);
      setValues(updatedAddress.values);
      setEditingAddressId("");
      setErrors(initialErrors);
      return;
    }

    const nextAddress = toSavedAddress(values, savedAddresses.length);

    setSavedAddresses((prev) => [...prev, nextAddress]);
    setSelectedAddressId(nextAddress.id);
    if (useDefault || !defaultAddressId) {
      setDefaultAddressId(nextAddress.id);
    }
    setAddress(nextAddress.values);
    setValues(useDefault ? emptyAddress : nextAddress.values);
    setErrors(initialErrors);
    setLimitError("");
  }

  function handleSelectAddress(id) {
    setSelectedAddressId(id);
    const chosen = savedAddresses.find((item) => item.id === id);
    if (!chosen) {
      return;
    }

    setValues(chosen.values);
    setUseDefault(defaultAddressId === id);
    setEditingAddressId("");
    setAddress(chosen.values);
  }

  function handleEditAddress(id) {
    const chosen = savedAddresses.find((item) => item.id === id);
    if (!chosen) {
      return;
    }

    setSelectedAddressId(id);
    setValues(chosen.values);
    setUseDefault(defaultAddressId === id);
    setEditingAddressId(id);
    setErrors(initialErrors);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleRemoveAddress(id) {
    const nextAddresses = savedAddresses.filter((item) => item.id !== id);
    setSavedAddresses(nextAddresses);

    if (!nextAddresses.length) {
      setSelectedAddressId("");
      setDefaultAddressId("");
      setAddress(emptyAddress);
      setValues(emptyAddress);
      setUseDefault(false);
      setEditingAddressId("");
      setLimitError("");
      return;
    }

    const nextSelectedId =
      selectedAddressId === id ? nextAddresses[0].id : selectedAddressId;
    const chosen = nextAddresses.find((item) => item.id === nextSelectedId) ?? nextAddresses[0];

    if (defaultAddressId === id) {
      setDefaultAddressId("");
    }
    if (editingAddressId === id) {
      setEditingAddressId("");
      setUseDefault(false);
    }
    setSelectedAddressId(chosen.id);
    setAddress(chosen.values);
    setValues(chosen.values);
  }

  function handleSetDefaultAddress() {
    if (!selectedAddressId) {
      return;
    }

    setDefaultAddressId(selectedAddressId);
  }

  function handleContinue() {
    const chosen = savedAddresses.find((item) => item.id === selectedAddressId);
    if (!chosen) {
      return;
    }

    setAddress(chosen.values);
    router.push("/payment");
  }

  return (
    <main className="checkout-shell address-shell">
      <CheckoutNavbar activeStep="Address" />

      <section className={`address-hero${!hasSavedAddresses ? " is-empty" : ""}`}>
        <h1>Shipping Address</h1>
        <p>
          Select a destination for your sustainable essentials. Every delivery
          is carbon-neutral.
        </p>
      </section>

      {hasSavedAddresses ? (
        <>
          <section className="saved-section">
            <div className="saved-section-heading">
              <h2>Saved Addresses</h2>
              <span>{savedAddresses.length} Saved</span>
            </div>

            <div className="saved-grid">
              {savedAddresses.map((item) => {
                const active = item.id === selectedAddressId;
                const isDefault = item.id === defaultAddressId;

                return (
                  <article
                    key={item.id}
                    className={`saved-card${active ? " is-selected" : ""}`}
                    onClick={() => handleSelectAddress(item.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleSelectAddress(item.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={active}
                  >
                    <div className="saved-card-top">
                      <div className="saved-card-actions">
                        <button
                          type="button"
                          className="saved-round-btn"
                          aria-label={`Edit ${item.title}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleEditAddress(item.id);
                          }}
                        >
                          <PencilIcon />
                        </button>
                        <button
                          type="button"
                          className="saved-round-btn"
                          aria-label={`Remove ${item.title}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleRemoveAddress(item.id);
                          }}
                        >
                          <TrashIcon />
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
                      {isDefault ? <em className="saved-default-tag">Default Address</em> : null}
                      {item.lines.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                      <span>{item.phone}</span>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="saved-section-actions">
              <button
                type="button"
                className="set-default-btn"
                onClick={handleSetDefaultAddress}
                disabled={!selectedAddressId || selectedAddressId === defaultAddressId}
              >
                {selectedAddressId === defaultAddressId
                  ? "Selected Address Is Default"
                  : "Set Selected Address As Default"}
              </button>
            </div>
          </section>

          <div className="section-divider">
            <span>Add Another Address</span>
          </div>
        </>
      ) : null}

      <form
        className={`address-form-card${!hasSavedAddresses ? " is-priority" : ""}`}
        onSubmit={handleAddAddress}
        noValidate
      >
        {!hasSavedAddresses ? (
          <div className="empty-address-note">
            <h2>Add Your First Address</h2>
            <p>Start by entering your shipping details below.</p>
          </div>
        ) : isEditing ? (
          <div className="empty-address-note">
            <h2>Update Address</h2>
            <p>Edit the selected address details and save your changes.</p>
          </div>
        ) : null}

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

        <div className="address-form-actions">
          <label className="default-checkbox">
            <input
              type="checkbox"
              checked={useDefault}
              onChange={(event) => setUseDefault(event.target.checked)}
            />
            <span>Set as default shipping address</span>
          </label>

          <button type="submit" className="inline-add-address-btn">
            <PlusIcon />
            {isEditing ? "Update Address" : "Add Address"}
          </button>
        </div>

        {limitError ? <p className="address-limit-error">{limitError}</p> : null}

        <div className="address-footer-bar">
          <button type="button" className="back-link" onClick={() => router.push("/")}>
            <ArrowLeftIcon />
            Back
          </button>

          <button
            type="button"
            className="address-submit-btn"
            onClick={handleContinue}
            disabled={!selectedAddressId}
          >
            Continue to Payment
            <ArrowRightIcon />
          </button>
        </div>
      </form>
    </main>
  );
}
