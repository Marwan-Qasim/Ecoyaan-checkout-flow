"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CheckoutContext = createContext(null);

const initialAddress = {
  fullName: "",
  email: "",
  phone: "",
  pinCode: "",
  city: "",
  state: "",
};

export function CheckoutProvider({ children }) {
  const [address, setAddress] = useState(initialAddress);

  useEffect(() => {
    const saved = window.localStorage.getItem("ecoyaan-address");
    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      setAddress({ ...initialAddress, ...parsed });
    } catch {
      window.localStorage.removeItem("ecoyaan-address");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("ecoyaan-address", JSON.stringify(address));
  }, [address]);

  const value = useMemo(() => ({ address, setAddress }), [address]);

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used inside CheckoutProvider");
  }
  return context;
}

export function hasValidAddress(address) {
  return (
    address.fullName.trim() &&
    address.email.trim() &&
    address.phone.trim() &&
    address.pinCode.trim() &&
    address.city.trim() &&
    address.state.trim()
  );
}
