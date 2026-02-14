import { CartItem, Product } from "./products";

export const addToCart = (cart: CartItem[], product: Product): CartItem[] => {
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    return cart.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }
  return [...cart, { ...product, quantity: 1 }];
};

export const removeFromCart = (cart: CartItem[], productId: number): CartItem[] => {
  return cart.filter(item => item.id !== productId);
};

export const updateQuantity = (cart: CartItem[], productId: number, quantity: number): CartItem[] => {
  if (quantity <= 0) {
    return removeFromCart(cart, productId);
  }
  return cart.map(item =>
    item.id === productId ? { ...item, quantity } : item
  );
};

export const getTotalPrice = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const getTotalItems = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => total + item.quantity, 0);
};
