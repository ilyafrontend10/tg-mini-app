'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import WebApp from '@twa-dev/sdk'

interface User {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  photo_url?: string
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [webApp, setWebApp] = useState<any>(null)

  useEffect(() => {
    // Инициализация Telegram Web App
    if (typeof window !== 'undefined') {
      const tg = WebApp
      tg.ready()
      tg.expand()
      setWebApp(tg)

      // Получение данных пользователя
      if (tg.initDataUnsafe.user) {
        setUser(tg.initDataUnsafe.user)
      }
    }
  }, [])

  const handleShowAlert = () => {
    if (webApp) {
      webApp.showAlert('Привет из Telegram Mini App!')
    }
  }

  const handleShare = () => {
    if (webApp) {
      webApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('Посмотри мой профиль!')}`)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Загрузка...</CardTitle>
            <CardDescription>
              Пожалуйста, откройте это приложение в Telegram
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
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
                <AvatarImage src={user.photo_url} alt={user.first_name} />
                <AvatarFallback className="text-2xl">
                  {user.first_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">
                  {user.first_name} {user.last_name || ''}
                </h2>
                {user.username && (
                  <p className="text-gray-600">@{user.username}</p>
                )}
                <p className="text-sm text-gray-500">
                  ID: {user.id}
                </p>
                {user.language_code && (
                  <p className="text-sm text-gray-500">
                    Язык: {user.language_code.toUpperCase()}
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
              <p><strong>Платформа:</strong> {webApp?.platform || 'Неизвестно'}</p>
              <p><strong>Версия:</strong> {webApp?.version || 'Неизвестно'}</p>
              <p><strong>Цветовая тема:</strong> {webApp?.colorScheme || 'light'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
