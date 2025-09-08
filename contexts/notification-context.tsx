"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { Notification } from "@/lib/notifications"

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  clearAll: () => void
  playSound: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

interface NotificationProviderProps {
  children: React.ReactNode
  userId: string
  userType: "customer" | "business" | "driver"
}

export function NotificationProvider({ children, userId, userType }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

  // Inicializar AudioContext para sonidos
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      setAudioContext(ctx)
    }
  }, [])

  // Función para reproducir sonido de notificación
  const playSound = useCallback(() => {
    if (!audioContext) return

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }, [audioContext])

  // Conectar a Server-Sent Events
  useEffect(() => {
    const eventSource = new EventSource(`/api/notifications/${userType}/${userId}`)

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === "connected") return

        const notification = data as Notification
        setNotifications((prev) => [notification, ...prev])

        // Reproducir sonido para nuevas notificaciones
        if (!notification.read) {
          playSound()
        }
      } catch (error) {
        console.error("Error parsing notification:", error)
      }
    }

    eventSource.onerror = (error) => {
      console.error("SSE error:", error)
    }

    return () => {
      eventSource.close()
    }
  }, [userId, userType, playSound])

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev])
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        clearAll,
        playSound,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
