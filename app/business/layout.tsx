import type React from "react"
import { NotificationProvider } from "@/contexts/notification-context"

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NotificationProvider userId="business_123" userType="business">
      {children}
    </NotificationProvider>
  )
}
