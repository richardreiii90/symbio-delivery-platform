import type React from "react"
import { NotificationProvider } from "@/contexts/notification-context"

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NotificationProvider userId="driver_123" userType="driver">
      {children}
    </NotificationProvider>
  )
}
