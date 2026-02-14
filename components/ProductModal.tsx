"use client";

import { Product } from "@/lib/products";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Minus, ShoppingCart, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { useState } from "react";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  quantity?: number;
  onUpdateQuantity?: (productId: number, quantity: number) => void;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  quantity = 0,
  onUpdateQuantity,
}: ProductModalProps) {
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen || !product) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 300)); // Имитация задержки
    onAddToCart(product);
    setIsAdding(false);
    if (quantity === 0) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 sm:max-w-lg shadow-2xl">
        <CardHeader className="relative pb-4">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 p-2 h-8 w-8 hover:bg-gray-100 rounded-full transition-colors z-10"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="text-center">
            <div className="text-6xl sm:text-7xl mb-4 transition-transform hover:scale-110 duration-200">
              {product.image}
            </div>
            <CardTitle className="text-xl text-center px-2 mb-2">{product.name}</CardTitle>
            <CardDescription className="text-center text-base px-2">
              {product.description}
            </CardDescription>

            {/* Рейтинг */}
            <div className="flex items-center justify-center gap-1 mt-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-2">(4.0)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <span className="text-2xl font-bold text-gray-900">
              {product.price.toLocaleString("ru-RU")} ₽
            </span>
            <Badge
              variant={product.inStock ? "default" : "secondary"}
              className={`text-sm ${
                product.inStock ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
              }`}
            >
              {product.inStock ? "В наличии" : "Нет в наличии"}
            </Badge>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-700">Характеристики:</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Категория:</span>
                <span className="font-medium px-2 py-1 bg-white rounded">
                  {product.category === "phones" && "📱 Смартфоны"}
                  {product.category === "laptops" && "💻 Ноутбуки"}
                  {product.category === "audio" && "🎧 Аудио"}
                  {product.category === "tablets" && "📱 Планшеты"}
                  {product.category === "watches" && "⌚ Часы"}
                  {product.category === "cameras" && "📷 Камеры"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Артикул:</span>
                <span className="font-mono font-medium bg-white px-2 py-1 rounded">
                  #{product.id.toString().padStart(6, "0")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Гарантия:</span>
                <span className="font-medium text-green-600">12 месяцев</span>
              </div>
            </div>
          </div>

          {/* Преимущества */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-700">Преимущества:</h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                <Truck className="w-5 h-5 text-blue-600 mb-1" />
                <span className="text-xs text-gray-700">Быстрая доставка</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                <Shield className="w-5 h-5 text-green-600 mb-1" />
                <span className="text-xs text-gray-700">Гарантия 12 мес.</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
                <RotateCcw className="w-5 h-5 text-purple-600 mb-1" />
                <span className="text-xs text-gray-700">Возврат 14 дней</span>
              </div>
            </div>
          </div>

          {onUpdateQuantity && quantity > 0 && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <span className="font-medium text-blue-900">В корзине:</span>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0 hover:bg-blue-100"
                  onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-8 text-center font-bold text-blue-600">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0 hover:bg-blue-100"
                  onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:opacity-50"
            size="lg"
            disabled={!product.inStock || isAdding}
            onClick={handleAddToCart}
          >
            {isAdding ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Добавление...
              </div>
            ) : product.inStock ? (
              <div className="flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 mr-2" />
                {quantity > 0 ? "Добавить еще" : "В корзину"}
              </div>
            ) : (
              "Недоступно"
            )}
          </Button>

          <div className="text-xs text-gray-500 text-center space-y-1">
            <div>✓ Доставка по всей России</div>
            <div>✓ Оплата при получении</div>
            <div>✓ 14 дней на возврат</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
