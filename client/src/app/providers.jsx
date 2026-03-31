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

function readSessionJson(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const saved = window.sessionStorage.getItem(key);
  if (!saved) {
    return fallback;
  }

  try {
    return JSON.parse(saved);
  } catch {
    window.sessionStorage.removeItem(key);
    return fallback;
  }
}

export function CheckoutProvider({ children }) {
  const [address, setAddress] = useState(() => {
    const parsed = readSessionJson("ecoyaan-address", initialAddress);
    return { ...initialAddress, ...parsed };
  });

  const [savedAddresses, setSavedAddresses] = useState(() =>
    readSessionJson("ecoyaan-saved-addresses", [])
  );

  const [selectedAddressId, setSelectedAddressId] = useState(() =>
    readSessionJson("ecoyaan-selected-address", "")
  );

  const [defaultAddressId, setDefaultAddressId] = useState(() =>
    readSessionJson("ecoyaan-default-address", "")
  );

  useEffect(() => {
    window.sessionStorage.setItem("ecoyaan-address", JSON.stringify(address));
  }, [address]);

  useEffect(() => {
    window.sessionStorage.setItem("ecoyaan-saved-addresses", JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  useEffect(() => {
    if (selectedAddressId) {
      window.sessionStorage.setItem("ecoyaan-selected-address", JSON.stringify(selectedAddressId));
      return;
    }

    window.sessionStorage.removeItem("ecoyaan-selected-address");
  }, [selectedAddressId]);

  useEffect(() => {
    if (defaultAddressId) {
      window.sessionStorage.setItem("ecoyaan-default-address", JSON.stringify(defaultAddressId));
      return;
    }

    window.sessionStorage.removeItem("ecoyaan-default-address");
  }, [defaultAddressId]);

  const value = useMemo(
    () => ({
      address,
      setAddress,
      savedAddresses,
      setSavedAddresses,
      selectedAddressId,
      setSelectedAddressId,
      defaultAddressId,
      setDefaultAddressId,
    }),
    [address, savedAddresses, selectedAddressId, defaultAddressId]
  );

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
