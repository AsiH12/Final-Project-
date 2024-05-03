import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalCount = 0;
    cart.forEach(item => {
      totalCount += item.amount;
    });
    setCartCount(totalCount);
  };

  useEffect(() => {
    // Update the cart count when the component mounts
    updateCartCount();

    // Watch for changes in the local storage cart and update the count
    window.addEventListener("storage", updateCartCount);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const updateCount = () => {
    updateCartCount();
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartCount = () => {
  const { cartCount, updateCount } = useContext(CartContext);
  return { cartCount, updateCount };
};
