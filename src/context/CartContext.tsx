"use client";

import React, { createContext, useContext, useState } from "react";

interface CartContextType {
  cartCount: number;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cartCount, setCartCount] = useState(0);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};
