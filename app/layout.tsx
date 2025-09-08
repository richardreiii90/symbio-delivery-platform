import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/react"
import { NotificationProvider } from "@/contexts/notification-context"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "DeliveryApp - Plataforma de Delivery",
  description: "Plataforma completa de delivery para clientes, comercios y repartidores",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <NotificationProvider userId="customer_123" userType="customer">
            {children}
          </NotificationProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
