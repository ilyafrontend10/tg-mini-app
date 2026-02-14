"use client";

import { useState } from "react";
import { useIsClient } from "@/hooks/useIsClient";
import TechStore from "@/components/TechStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { products, categories, Product, CartItem } from "@/lib/products";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  getTotalPrice,
  getTotalItems,
} from "@/lib/cart";

export default function StorePage() {
  const isClient = useIsClient();
  const isTelegram = isClient && Boolean(window?.Telegram?.WebApp?.initDataUnsafe?.user);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  if (isTelegram) {
    return <TechStore />;
  }

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    setCart((prev: CartItem[]) => addToCart(prev, product));
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prev: CartItem[]) => removeFromCart(prev, productId));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCart((prev: CartItem[]) => updateQuantity(prev, productId, quantity));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Интернет-магазин</h1>
              <p className="text-sm text-gray-500">Каталог техники</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="w-4 h-4" />
                {getTotalItems(cart) > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs">
                    {getTotalItems(cart)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Категории</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">
            {categories.find((c) => c.id === selectedCategory)?.name || "Все товары"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="text-5xl text-center mb-3">{product.image}</div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="text-sm">{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold">
                      {product.price.toLocaleString("ru-RU")} ₽
                    </span>
                    <Badge variant={product.inStock ? "default" : "secondary"}>
                      {product.inStock ? "В наличии" : "Нет в наличии"}
                    </Badge>
                  </div>
                  <Button
                    className="w-full"
                    disabled={!product.inStock}
                    onClick={() => handleAddToCart(product)}
                  >
                    {product.inStock ? "В корзину" : "Недоступно"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart */}
        {cart.length > 0 && (
          <Card className="sticky bottom-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Корзина ({getTotalItems(cart)} товара)</span>
                <span className="text-xl">{getTotalPrice(cart).toLocaleString("ru-RU")} ₽</span>
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
              <Button className="w-full" size="lg">
                Оформить заказ
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
