import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ТехноМаркет - Лучшие цены на электронику и технику",
  description:
    "Более 1000 товаров с гарантией и быстрой доставкой по всей России. Смартфоны, ноутбуки, аудио, планшеты, часы и камеры по лучшим ценам.",
  keywords:
    "техника, электроника, смартфоны, ноутбуки, наушники, планшеты, часы, камеры, купить, доставка, гарантия",
  authors: [{ name: "ТехноМаркет" }],
  creator: "ТехноМаркет",
  publisher: "ТехноМаркет",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://technomarket.example.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ТехноМаркет - Лучшие цены на электронику",
    description: "Более 1000 товаров с гарантией и быстрой доставкой по всей России",
    url: "https://technomarket.example.com",
    siteName: "ТехноМаркет",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ТехноМаркет - Лучшие цены на электронику",
    description: "Более 1000 товаров с гарантией и быстрой доставкой по всей России",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
