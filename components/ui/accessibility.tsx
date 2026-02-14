"use client";

import { useEffect } from "react";

// Хук для управления фокусом и доступностью
export function useAccessibility() {
  useEffect(() => {
    // Обработка клавиатурной навигации
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape для закрытия модалок
      if (e.key === "Escape") {
        const modals = document.querySelectorAll('[role="dialog"]');
        modals.forEach((modal) => {
          const closeButton = modal.querySelector('button[aria-label="Close"]');
          if (closeButton) {
            (closeButton as HTMLButtonElement).click();
          }
        });
      }

      // Tab ловушка для модалок
      if (e.key === "Tab") {
        const modal = document.querySelector('[role="dialog"]') as HTMLElement;
        if (modal && document.activeElement && !modal.contains(document.activeElement)) {
          e.preventDefault();
          const firstFocusable = modal.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ) as HTMLElement;
          if (firstFocusable) firstFocusable.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}

// Компонент для пропуска навигации (скринридеры)
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Перейти к основному содержимому
    </a>
  );
}

// Утилиты для ARIA атрибутов
export const ariaUtils = {
  // Для кнопок
  getButtonProps: (isLoading?: boolean, disabled?: boolean) => ({
    "aria-disabled": disabled || isLoading,
    "aria-busy": isLoading,
    role: "button" as const,
  }),

  // Для модалок
  getModalProps: (isOpen: boolean, title: string) => ({
    role: "dialog" as const,
    "aria-modal": true,
    "aria-labelledby": `modal-title-${title}`,
    "aria-hidden": !isOpen,
  }),

  // Для карточек товаров
  getProductCardProps: (product: { name: string; price: number; inStock: boolean }) => ({
    role: "article",
    "aria-label": `${product.name}, цена ${product.price.toLocaleString()} рублей, ${product.inStock ? "в наличии" : "нет в наличии"}`,
  }),

  // Для уведомлений
  getToastProps: (type: "success" | "error" | "warning" | "info") => ({
    role: "alert" as const,
    "aria-live": type === "error" ? "assertive" : "polite",
    "aria-atomic": true,
  }),
};

// Хук для анимации с уважением к предпочтениям пользователя
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

import { useState } from "react";
