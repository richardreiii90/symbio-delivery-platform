"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Car, Menu } from "lucide-react"

export function DriverHeader() {
  const [isOnline, setIsOnline] = useState(true)
  const [notifications] = useState(2)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Driver App</h1>
              <p className="text-sm text-muted-foreground">Carlos Mendoza</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className={isOnline ? "bg-delivery-success text-white" : "bg-gray-500 text-white"}>
              {isOnline ? "En línea" : "Desconectado"}
            </Badge>

            <div className="relative">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              {notifications > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{notifications}</span>
                </div>
              )}
            </div>

            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
