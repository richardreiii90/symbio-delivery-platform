"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  timestamp: Date
  read: boolean
}

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

  const initAudioContext = useCallback(() => {
    if (typeof window !== "undefined" && !audioContext) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        setAudioContext(ctx)
        return ctx
      } catch (error) {
        console.log("[v0] AudioContext not available")
        return null
      }
    }
    return audioContext
  }, [audioContext])

  const playSound = useCallback(() => {
    const ctx = initAudioContext()
    if (!ctx) return

    try {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.setValueAtTime(800, ctx.currentTime)
      oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.1)

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.5)
    } catch (error) {
      console.log("[v0] Error playing notification sound")
    }
  }, [initAudioContext])

  useEffect(() => {
    // Simular notificaciones para comercios cuando hay nuevos pedidos
    if (userType === "business") {
      const interval = setInterval(() => {
        // Solo agregar notificación si hay menos de 3 para no saturar
        if (notifications.length < 3) {
          const mockNotification: Notification = {
            id: Date.now().toString(),
            type: "order_created",
            title: "Nuevo Pedido",
            message: `Pedido #${Math.floor(Math.random() * 1000)} recibido`,
            timestamp: new Date(),
            read: false,
          }
          setNotifications((prev) => [mockNotification, ...prev])
          playSound()
        }
      }, 30000) // Cada 30 segundos

      return () => clearInterval(interval)
    }
  }, [userType, notifications.length, playSound])

  const addNotification = useCallback(
    (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev])
      playSound()
    },
    [playSound],
  )

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
