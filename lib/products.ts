export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export const products: Product[] = [
  { id: 1, name: "iPhone 15 Pro", price: 129990, category: "phones", image: "📱", description: "Последний флагман Apple", inStock: true },
  { id: 2, name: "MacBook Air M2", price: 149990, category: "laptops", image: "💻", description: "Тонкий и мощный ноутбук", inStock: true },
  { id: 3, name: "AirPods Pro", price: 34990, category: "audio", image: "🎧", description: "Беспроводные наушники с ANC", inStock: true },
  { id: 4, name: "Samsung Galaxy S24", price: 99990, category: "phones", image: "📱", description: "Флагман Samsung", inStock: true },
  { id: 5, name: "Sony WH-1000XM5", price: 44990, category: "audio", image: "🎧", description: "Премиальные наушники", inStock: false },
  { id: 6, name: "iPad Pro", price: 119990, category: "tablets", image: "📱", description: "Профессиональный планшет", inStock: true },
  { id: 7, name: "Apple Watch Ultra", price: 99990, category: "watches", image: "⌚", description: "Премиальные часы", inStock: true },
  { id: 8, name: "Canon EOS R6", price: 299990, category: "cameras", image: "📷", description: "Профессиональная камера", inStock: true },
];

export const categories = [
  { id: "all", name: "Все товары", icon: "🛍️" },
  { id: "phones", name: "Смартфоны", icon: "📱" },
  { id: "laptops", name: "Ноутбуки", icon: "💻" },
  { id: "audio", name: "Аудио", icon: "🎧" },
  { id: "tablets", name: "Планшеты", icon: "📱" },
  { id: "watches", name: "Часы", icon: "⌚" },
  { id: "cameras", name: "Камеры", icon: "📷" },
];
