import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Telegram Mini App</h1>
          <p className="text-lg text-gray-600">Выберите раздел для перехода</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🛍️</span>
                Tech Store
              </CardTitle>
              <CardDescription>Магазин техники с корзиной и категориями товаров</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/store">
                <Button className="w-full">Перейти в магазин</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">👤</span>
                Профиль
              </CardTitle>
              <CardDescription>Ваш профиль и информация о приложении</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/profile">
                <Button className="w-full" variant="outline">
                  Перейти в профиль
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
