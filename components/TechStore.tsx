"use client";

import { useLayoutEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import WebApp from "@twa-dev/sdk";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { products, categories, Product, CartItem } from "@/lib/products";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  getTotalPrice,
  getTotalItems,
} from "@/lib/cart";
import { Badge } from "./ui/badge";
import ProductModal from "@/components/ProductModal";

declare global {
  interface Window {
    Telegram?: {
      WebApp: typeof WebApp;
    };
  }
}

interface User {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface AppState {
  user: User | null;
  webApp: typeof WebApp | null;
  isTelegram: boolean;
  isLoading: boolean;
  cart: CartItem[];
  selectedCategory: string;
  selectedProduct: Product | null;
  isModalOpen: boolean;
}

export default function TechStore() {
  const [state, setState] = useState<AppState>({
    user: null,
    webApp: null,
    isTelegram: false,
    isLoading: true,
    cart: [],
    selectedCategory: "all",
    selectedProduct: null,
    isModalOpen: false,
  });

  useLayoutEffect(() => {
    const initializeApp = () => {
      const isTelegramEnvironment = typeof window !== "undefined" && window.Telegram?.WebApp;

      if (!isTelegramEnvironment && typeof window !== "undefined") {
        const demoUser: User = {
          id: 12345,
          first_name: "Demo",
          last_name: "User",
          username: "demo_user",
          language_code: "ru",
          photo_url: undefined,
        };

        setState({
          webApp: null,
          user: demoUser,
          isTelegram: false,
          isLoading: false,
          cart: [],
          selectedCategory: "all",
          selectedProduct: null,
          isModalOpen: false,
        });
        return;
      }

      if (typeof window !== "undefined") {
        try {
          const tg = WebApp;
          tg.ready();
          tg.expand();

          const userData = tg.initDataUnsafe?.user || null;
          console.log("Telegram WebApp инициализирован:", tg);
          console.log("Данные пользователя:", userData);

          setState({
            webApp: tg,
            user: userData,
            isTelegram: true,
            isLoading: false,
            cart: [],
            selectedCategory: "all",
            selectedProduct: null,
            isModalOpen: false,
          });
        } catch (error) {
          console.error("Ошибка инициализации:", error);
          const demoUser: User = {
            id: 12345,
            first_name: "Demo",
            last_name: "User",
            username: "demo_user",
            language_code: "ru",
          };

          setState({
            webApp: null,
            user: demoUser,
            isTelegram: false,
            isLoading: false,
            cart: [],
            selectedCategory: "all",
            selectedProduct: null,
            isModalOpen: false,
          });
        }
      }
    };

    initializeApp();
  }, []);

  const handleAddToCart = (product: Product) => {
    setState((prev) => ({
      ...prev,
      cart: addToCart(prev.cart, product),
    }));
  };

  const handleRemoveFromCart = (productId: number) => {
    setState((prev) => ({
      ...prev,
      cart: removeFromCart(prev.cart, productId),
    }));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setState((prev) => ({
      ...prev,
      cart: updateQuantity(prev.cart, productId, quantity),
    }));
  };

  const handleProductClick = (product: Product) => {
    setState((prev) => ({
      ...prev,
      selectedProduct: product,
      isModalOpen: true,
    }));
  };

  const handleCloseModal = () => {
    setState((prev) => ({
      ...prev,
      isModalOpen: false,
    }));
    setTimeout(() => {
      setState((prev) => ({ ...prev, selectedProduct: null }));
    }, 300);
  };

  const getQuantityInCart = (productId: number) => {
    const item = state.cart.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const filteredProducts =
    state.selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === state.selectedCategory);

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Загрузка...</CardTitle>
            <CardDescription>Инициализация приложения...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!state.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Ошибка</CardTitle>
            <CardDescription>Не удалось загрузить данные пользователя</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🛍️</div>
              <div>
                <h1 className="text-xl font-bold">TechStore</h1>
                <p className="text-xs text-gray-500">
                  {state.isTelegram ? "Telegram Mini App" : "Веб-версия"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  🏠
                </Button>
              </Link>
              {state.user && (
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={state.user.photo_url} alt={state.user.first_name} />
                    <AvatarFallback className="text-xs">
                      {state.user.first_name?.charAt(0)?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:block">
                    {state.user.first_name}
                  </span>
                </div>
              )}
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="w-4 h-4" />
                {getTotalItems(state.cart) > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs">
                    {getTotalItems(state.cart)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Категории</h2>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={state.selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setState((prev) => ({ ...prev, selectedCategory: category.id }))}
                className="shrink-0"
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">
            {categories.find((c) => c.id === state.selectedCategory)?.name || "Все товары"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
                onClick={() => handleProductClick(product)}
              >
                <CardHeader className="pb-2">
                  <div className="text-4xl text-center mb-2">{product.image}</div>
                  <CardTitle className="text-base">{product.name}</CardTitle>
                  <CardDescription className="text-sm">{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold">{product.price.toLocaleString()} ₽</span>
                    <Badge variant={product.inStock ? "default" : "secondary"}>
                      {product.inStock ? "В наличии" : "Нет в наличии"}
                    </Badge>
                  </div>
                  <Button
                    className="w-full"
                    size="sm"
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
            ))}
          </div>
        </div>

        {state.cart.length > 0 && (
          <Card className="sticky bottom-4">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Корзина ({getTotalItems(state.cart)} товара)</span>
                <span className="text-lg">{getTotalPrice(state.cart).toLocaleString()} ₽</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {state.cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span>{item.image}</span>
                      <span>{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-6 h-6 p-0"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-6 h-6 p-0"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <span className="font-medium w-20 text-right">
                        {(item.price * item.quantity).toLocaleString()} ₽
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-6 h-6 p-0 text-red-500"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full" size="lg">
                {state.isTelegram ? "Оплатить через Telegram" : "Оформить заказ"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <ProductModal
        product={state.selectedProduct}
        isOpen={state.isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
        quantity={state.selectedProduct ? getQuantityInCart(state.selectedProduct.id) : 0}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
}
