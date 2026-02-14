"use client";

import { useIsClient } from "@/hooks/useIsClient";
import Profile from "@/components/Profile";

export default function ProfilePage() {
  const isClient = useIsClient();
  const isTelegram = isClient && Boolean(window?.Telegram?.WebApp?.initDataUnsafe?.user);

  if (isTelegram) {
    return <Profile />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Профиль (веб)</h1>
        <p className="text-gray-600">
          Это web-страница. Если открыть эту же ссылку внутри Telegram Mini App, автоматически
          отобразится TG-версия.
        </p>
      </div>
    </div>
  );
}
