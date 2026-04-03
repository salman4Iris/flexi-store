"use client";

import React, { createContext, useContext, useState } from "react";

export type CartItem = { id: string; name: string; price: number; qty: number };

type CartContextType = {
  items: CartItem[];
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  remove: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  total: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export const CartProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (item: Omit<CartItem, "qty">, qty = 1): void => {
    setItems((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      if (exists) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + qty } : p
        );
      }
      return [...prev, { ...item, qty }];
    });
  };

  const remove = (id: string): void => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQty = (id: string, qty: number): void => {
    if (qty < 1) {
      remove(id);
      return;
    }
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));
  };

  const clear = (): void => {
    setItems([]);
  };

  const total = (): number => items.reduce((s, i) => s + i.price * i.qty, 0);

  const value: CartContextType = { items, add, remove, updateQty, clear, total };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
