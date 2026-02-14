"use client";

import { useLayoutEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import WebApp from "@twa-dev/sdk";

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
}

export default function Profile() {
  const [state, setState] = useState<AppState>({
    user: null,
    webApp: null,
    isTelegram: false,
    isLoading: true,
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
          });
        }
      }
    };

    initializeApp();
  }, []);

  const handleShowAlert = () => {
    if (state.webApp && state.isTelegram) {
      state.webApp.showAlert("Привет из Telegram Mini App!");
    } else {
      alert("Привет из веб-версии!");
    }
  };

  const handleShare = () => {
    if (state.webApp && state.isTelegram && typeof window !== "undefined") {
      try {
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("Посмотри мой профиль!")}`;
        state.webApp.openTelegramLink(shareUrl);
      } catch (error) {
        console.error("Ошибка при открытии ссылки:", error);
      }
    } else if (typeof window !== "undefined") {
      if (navigator.share) {
        navigator
          .share({
            title: "Мой профиль",
            text: "Посмотри мой профиль!",
            url: window.location.href,
          })
          .catch(console.error);
      } else {
        navigator.clipboard
          .writeText(window.location.href)
          .then(() => {
            alert("Ссылка скопирована в буфер обмена!");
          })
          .catch(() => {
            alert("Не удалось скопировать ссылку");
          });
      }
    }
  };

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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Профиль</h1>
          <Link href="/">
            <Button variant="ghost" size="sm">
              🏠
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Профиль пользователя</CardTitle>
            <CardDescription>
              {state.isTelegram
                ? "Ваш профиль в Telegram Mini App"
                : "Демо-версия для веб-браузера"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={state.user.photo_url} alt={state.user.first_name} />
                <AvatarFallback className="text-2xl">
                  {state.user.first_name?.charAt(0)?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">
                  {state.user.first_name} {state.user.last_name || ""}
                </h2>
                {state.user.username && <p className="text-gray-600">@{state.user.username}</p>}
                <p className="text-sm text-gray-500">ID: {state.user.id}</p>
                {state.user.language_code && (
                  <p className="text-sm text-gray-500">
                    Язык: {state.user.language_code?.toUpperCase() || "Неизвестно"}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-2 pt-4">
              <Button onClick={handleShowAlert} className="w-full">
                {state.isTelegram ? "Показать уведомление" : "Показать alert"}
              </Button>
              <Button onClick={handleShare} variant="outline" className="w-full">
                {state.isTelegram ? "Поделиться через Telegram" : "Поделиться"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Информация о приложении</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Платформа:</strong>{" "}
                {state.isTelegram ? state.webApp?.platform || "Telegram" : "Веб-браузер"}
              </p>
              <p>
                <strong>Версия:</strong> {state.webApp?.version || "Неизвестно"}
              </p>
              <p>
                <strong>Цветовая тема:</strong> {state.webApp?.colorScheme || "light"}
              </p>
              <p>
                <strong>Режим:</strong> {state.isTelegram ? "Telegram Mini App" : "Демо-режим"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
