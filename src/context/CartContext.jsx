import { createContext, useCallback, useContext, useMemo, useState } from "react";
import * as cartService from "../services/cart.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => cartService.getCart());
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((item) => {
    setItems(cartService.addCartItem(item));
    setIsOpen(true);
  }, []);

  const updateQty = useCallback((id, qty) => {
    setItems(cartService.updateCartItemQty(id, qty));
  }, []);

  const removeItem = useCallback((id) => {
    setItems(cartService.removeCartItem(id));
  }, []);

  const clearCart = useCallback(() => {
    setItems(cartService.clearCart());
  }, []);

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0),
    [items]
  );

  const value = {
    items,
    count,
    total,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    updateQty,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
