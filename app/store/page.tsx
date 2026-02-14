"use client";

import { useState, useEffect } from "react";
import { useIsClient } from "@/hooks/useIsClient";
import TechStore from "@/components/TechStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Trash2, Search } from "lucide-react";
import { products, categories, Product, CartItem } from "@/lib/products";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  getTotalPrice,
  getTotalItems,
} from "@/lib/cart";
import ProductModal from "@/components/ProductModal";
import { LoadingSpinner, EmptyState } from "@/components/ui/loading";
import { useToast, ToastContainer } from "@/components/ui/toast";

export default function StorePage() {
  const isClient = useIsClient();
  const isTelegram = isClient && Boolean(window?.Telegram?.WebApp?.initDataUnsafe?.user);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toasts, success, removeToast } = useToast();

  // Имитация загрузки данных
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">🛍️</div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">ТехноМаркет</h1>
                  <p className="text-sm text-gray-500 hidden sm:block">Лучшие цены на технику</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <LoadingSpinner size="lg" text="Загрузка товаров..." />
        </div>
      </div>
    );
  }

  if (isTelegram) {
    return <TechStore />;
  }

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    setCart((prev: CartItem[]) => addToCart(prev, product));
    success(`${product.name} добавлен в корзину`);
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prev: CartItem[]) => removeFromCart(prev, productId));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCart((prev: CartItem[]) => updateQuantity(prev, productId, quantity));
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const getQuantityInCart = (productId: number) => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">🛍️</div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">ТехноМаркет</h1>
                <p className="text-sm text-gray-500 hidden sm:block">Лучшие цены на технику</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="relative hover:bg-gray-50 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Корзина</span>
                {getTotalItems(cart) > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs bg-blue-600 hover:bg-blue-700">
                    {getTotalItems(cart)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Hero Section */}
        <div className="mb-8 lg:mb-12 text-center bg-white py-12 px-6 rounded-lg shadow-sm">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Откройте мир технологий
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Более 1000 товаров с гарантией и быстрой доставкой по всей России
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>В наличии: 847 товаров
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Доставка 1-2 дня
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Гарантия 12 мес.
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mb-6 sm:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Категории</h2>
            <Badge variant="outline" className="hidden sm:inline-flex">
              {categories.length - 1} категорий
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`transition-colors ${
                  selectedCategory === category.id
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    : "hover:bg-gray-100 hover:border-gray-300"
                }`}
              >
                <span className="mr-2 text-lg">{category.icon}</span>
                <span className="hidden sm:inline">{category.name}</span>
                <span className="sm:hidden">
                  {category.name.replace(/ смартфоны| ноутбуки| аудио| планшеты| часы| камеры/, "")}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
              {categories.find((c) => c.id === selectedCategory)?.name || "Все товары"}
            </h2>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {filteredProducts.length} товаров
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 bg-white hover:scale-105"
                  onClick={() => handleProductClick(product)}
                >
                  <CardHeader className="pb-3">
                    <div className="text-5xl sm:text-6xl text-center mb-3">{product.image}</div>
                    <CardTitle className="text-base sm:text-lg text-center text-gray-900">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-center text-gray-600 line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg sm:text-xl font-bold text-gray-900">
                        {product.price.toLocaleString("ru-RU")} ₽
                      </span>
                      <Badge
                        variant={product.inStock ? "default" : "secondary"}
                        className={`text-xs ${
                          product.inStock
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {product.inStock ? "В наличии" : "Нет в наличии"}
                      </Badge>
                    </div>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      disabled={!product.inStock}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      {product.inStock ? "В корзину" : "Недоступно"}
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState
                  title="Товары не найдены"
                  description={
                    searchQuery
                      ? `По запросу "${searchQuery}" ничего не найдено. Попробуйте изменить запрос или выбрать другую категорию.`
                      : "В выбранной категории нет товаров."
                  }
                  icon={searchQuery ? "🔍" : "📦"}
                  action={{
                    label: "Сбросить фильтры",
                    onClick: () => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Cart */}
        {cart.length > 0 && (
          <Card className="sticky bottom-4 shadow-lg border border-gray-200 bg-white lg:bottom-8">
            <CardHeader className="pb-3 bg-gray-50 border-b">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  <span className="hidden sm:inline">Корзина</span>
                  <span className="sm:hidden">({getTotalItems(cart)})</span>
                </span>
                <div className="text-right">
                  <div className="text-xl text-blue-600 font-bold">
                    {getTotalPrice(cart).toLocaleString("ru-RU")} ₽
                  </div>
                  <div className="text-xs text-gray-500">{getTotalItems(cart)} товара</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{item.image}</span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-7 h-7 p-0"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-7 h-7 p-0"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <span className="font-medium w-24 text-right">
                        {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-7 h-7 p-0 text-red-500 hover:text-red-600"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                size="lg"
              >
                Оформить заказ
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
        quantity={selectedProduct ? getQuantityInCart(selectedProduct.id) : 0}
        onUpdateQuantity={handleUpdateQuantity}
      />

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
