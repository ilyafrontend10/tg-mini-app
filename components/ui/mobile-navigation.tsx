"use client";

import { useState } from "react";
import { Menu, X, Search, ShoppingCart, User, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTotalItems } from "@/lib/cart";
import { CartItem } from "@/lib/products";

interface MobileNavigationProps {
  cart: CartItem[];
  onSearchClick: () => void;
  onCartClick: () => void;
}

export function MobileNavigation({ cart, onSearchClick, onCartClick }: MobileNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Mobile Header */}
      <div className="sm:hidden bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={toggleMenu} className="p-2">
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div className="flex items-center space-x-2">
                <div className="text-xl">🛍️</div>
                <h1 className="text-lg font-bold text-gray-900">ТехноМаркет</h1>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={onSearchClick} className="p-2">
                <Search className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="sm" onClick={onCartClick} className="relative p-2">
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems(cart) > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-blue-600">
                    {getTotalItems(cart)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleMenu}>
            <div className="bg-white w-80 h-full shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Меню</h2>
                  <Button variant="ghost" size="sm" onClick={toggleMenu}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <nav className="p-4 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    toggleMenu();
                    window.location.href = "/";
                  }}
                >
                  <Home className="w-5 h-5 mr-3" />
                  Главная
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    toggleMenu();
                    window.location.href = "/profile";
                  }}
                >
                  <User className="w-5 h-5 mr-3" />
                  Профиль
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    toggleMenu();
                    onCartClick();
                  }}
                >
                  <ShoppingCart className="w-5 h-5 mr-3" />
                  Корзина
                  {getTotalItems(cart) > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {getTotalItems(cart)}
                    </Badge>
                  )}
                </Button>
              </nav>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 text-center">© 2024 ТехноМаркет</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="grid grid-cols-4 py-2">
          <Button
            variant="ghost"
            className="flex flex-col items-center py-2 h-auto"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Главная</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center py-2 h-auto"
            onClick={onSearchClick}
          >
            <Search className="w-5 h-5 mb-1" />
            <span className="text-xs">Поиск</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center py-2 h-auto relative"
            onClick={onCartClick}
          >
            <ShoppingCart className="w-5 h-5 mb-1" />
            <span className="text-xs">Корзина</span>
            {getTotalItems(cart) > 0 && (
              <Badge className="absolute top-1 right-4 w-4 h-4 p-0 flex items-center justify-center text-xs bg-blue-600">
                {getTotalItems(cart)}
              </Badge>
            )}
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center py-2 h-auto"
            onClick={() => (window.location.href = "/profile")}
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">Профиль</span>
          </Button>
        </div>
      </div>
    </>
  );
}
