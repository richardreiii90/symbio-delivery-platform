"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, DollarSign } from "lucide-react"

export function AvailabilityToggle() {
  const [isAvailable, setIsAvailable] = useState(true)
  const [currentLocation] = useState("Centro de la Ciudad")
  const [onlineTime] = useState("2h 34m")
  const [todayEarnings] = useState(87.5)

  return (
    <Card className={`border-2 ${isAvailable ? "border-green-200 bg-green-50/50" : "border-gray-200"}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Main Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                {isAvailable ? "Estás disponible para pedidos" : "Estás desconectado"}
              </h2>
              <p className="text-muted-foreground">
                {isAvailable ? "Recibirás notificaciones de nuevos pedidos" : "Activa para comenzar a recibir pedidos"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={isAvailable} onCheckedChange={setIsAvailable} className="scale-125" />
              <Badge className={isAvailable ? "bg-delivery-success text-white" : "bg-gray-500 text-white"}>
                {isAvailable ? "Disponible" : "No disponible"}
              </Badge>
            </div>
          </div>

          {/* Status Info */}
          {isAvailable && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Ubicación actual</p>
                  <p className="text-xs text-muted-foreground">{currentLocation}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Tiempo en línea</p>
                  <p className="text-xs text-muted-foreground">{onlineTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Ganancias hoy</p>
                  <p className="text-xs text-muted-foreground">${todayEarnings.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
