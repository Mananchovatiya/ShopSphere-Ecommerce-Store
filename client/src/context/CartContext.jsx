// context/CartContext.jsx - Cart state persisted to localStorage

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "shopsphere_cart";

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.product === product._id);
      if (existing) {
        return prev.map((it) =>
          it.product === product._id
            ? { ...it, quantity: it.quantity + quantity }
            : it
        );
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity,
        },
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((it) => it.product !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((it) => (it.product === productId ? { ...it, quantity } : it))
    );
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((it) => it.product !== productId));
  };

  const clearCart = () => setItems([]);

  // Derived totals
  const itemsCount = items.reduce((sum, it) => sum + it.quantity, 0);
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemsCount,
        subtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
