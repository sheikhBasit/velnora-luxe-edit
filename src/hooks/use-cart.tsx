import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: string;
  name: string;
  note: string;
  price: string;
  image: string;
  amazonUrl: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: {
    id: string;
    name: string;
    note: string;
    price: string;
    image: string;
    amazonUrl: string;
  }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount in the client environment
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("velnora_cart");
      if (stored) {
        try {
          setCartItems(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse cart items from localStorage:", e);
        }
      }
    }
  }, []);

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    if (typeof window !== "undefined") {
      localStorage.setItem("velnora_cart", JSON.stringify(items));
    }
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    const exists = cartItems.find((item) => item.id === product.id);
    if (exists) {
      saveCart(
        cartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      saveCart([...cartItems, { ...product, quantity: 1 }]);
    }
    // Automatically open the cart drawer when adding a product
    setIsOpen(true);
  };

  const removeFromCart = (productId: string) => {
    saveCart(cartItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart(
        cartItems.map((item) => (item.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => {
    saveCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
