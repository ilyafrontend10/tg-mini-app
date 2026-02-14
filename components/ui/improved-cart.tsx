"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { CartItem } from "@/lib/products";
import { getTotalPrice, getTotalItems } from "@/lib/cart";

interface ImprovedCartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveFromCart: (productId: number) => void;
  onCheckout: () => void;
  className?: string;
}

export function ImprovedCart({
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
  onCheckout,
  className = "",
}: ImprovedCartProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (cart.length === 0) return null;

  return (
    <Card
      className={`sticky bottom-4 shadow-lg border border-gray-200 bg-white lg:bottom-8 transition-all duration-300 ${className}`}
    >
      {/* Collapsible Header */}
      <CardHeader
        className="pb-3 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={toggleExpanded}
      >
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <span className="hidden sm:inline">Корзина</span>
            <span className="sm:hidden">({getTotalItems(cart)})</span>
            <Badge variant="secondary" className="ml-2">
              {getTotalItems(cart)}{" "}
              {getTotalItems(cart) === 1 ? "товар" : getTotalItems(cart) < 5 ? "товара" : "товаров"}
            </Badge>
          </span>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xl text-blue-600 font-bold">
                {getTotalPrice(cart).toLocaleString("ru-RU")} ₽
              </div>
            </div>
            <Button variant="ghost" size="sm" className="p-1">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      {/* Expandable Content */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <CardContent className="pt-4">
          <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <span className="text-2xl shrink-0">{item.image}</span>
                  <span className="font-medium truncate">{item.name}</span>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-7 h-7 p-0 hover:bg-blue-100"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-7 h-7 p-0 hover:bg-blue-100"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>

                  <span className="font-medium w-24 text-right hidden sm:block">
                    {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-7 h-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => onRemoveFromCart(item.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {/* Mobile price display */}
            <div className="sm:hidden flex justify-between items-center pt-3 border-t">
              <span className="font-semibold">Итого:</span>
              <span className="text-xl font-bold text-blue-600">
                {getTotalPrice(cart).toLocaleString("ru-RU")} ₽
              </span>
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              size="lg"
              onClick={onCheckout}
            >
              Оформить заказ
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
