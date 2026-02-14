"use client";

import { useLayoutEffect, useState } from "react";
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
}

export default function Profile() {
  const [state, setState] = useState<AppState>({
    user: null,
    webApp: null,
  });

  useLayoutEffect(() => {
    // Инициализация Telegram Web App
    if (typeof window !== "undefined") {
      try {
        const tg = WebApp;
        tg.ready();
        tg.expand();

        // Получение данных пользователя
        const userData = tg.initDataUnsafe?.user || null;

        // Используем setTimeout для отложенного обновления состояния
        setTimeout(() => {
          setState({
            webApp: tg,
            user: userData,
          });
        }, 0);
      } catch (error) {
        console.error("Ошибка инициализации Telegram Web App:", error);
      }
    }
  }, []);

  const handleShowAlert = () => {
    if (state.webApp) {
      state.webApp.showAlert("Привет из Telegram Mini App!");
    }
  };

  const handleShare = () => {
    if (state.webApp && typeof window !== "undefined") {
      try {
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("Посмотри мой профиль!")}`;
        state.webApp.openTelegramLink(shareUrl);
      } catch (error) {
        console.error("Ошибка при открытии ссылки:", error);
      }
    }
  };

  if (!state.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Загрузка...</CardTitle>
            <CardDescription>Пожалуйста, откройте это приложение в Telegram</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Профиль пользователя</CardTitle>
            <CardDescription>Ваш профиль в Telegram Mini App</CardDescription>
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
                Показать уведомление
              </Button>
              <Button onClick={handleShare} variant="outline" className="w-full">
                Поделиться профилем
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
                <strong>Платформа:</strong> {state.webApp?.platform || "Неизвестно"}
              </p>
              <p>
                <strong>Версия:</strong> {state.webApp?.version || "Неизвестно"}
              </p>
              <p>
                <strong>Цветовая тема:</strong> {state.webApp?.colorScheme || "light"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
