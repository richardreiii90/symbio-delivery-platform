"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, MapPin } from "lucide-react"

// Mock data para ganancias del repartidor
const mockDriverEarnings = {
  today: {
    earnings: 85.5,
    deliveries: 12,
    hours: 6.5,
    tips: 15.25,
    avgPerDelivery: 7.13,
  },
  week: {
    earnings: 520.75,
    deliveries: 78,
    hours: 35,
    tips: 95.5,
    avgPerDelivery: 6.68,
  },
  month: {
    earnings: 2180.25,
    deliveries: 324,
    hours: 142,
    tips: 385.75,
    avgPerDelivery: 6.73,
  },
}

const mockRecentDeliveries = [
  {
    id: "DEL-001",
    orderId: "ORD-001",
    restaurant: "Burger Palace",
    earnings: 8.5,
    tip: 2.0,
    distance: 2.3,
    duration: 18,
    completedAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "DEL-002",
    orderId: "ORD-002",
    restaurant: "Pizza Express",
    earnings: 6.75,
    tip: 1.5,
    distance: 1.8,
    duration: 15,
    completedAt: "2024-01-15T13:45:00Z",
  },
  {
    id: "DEL-003",
    orderId: "ORD-003",
    restaurant: "Sushi Zen",
    earnings: 12.0,
    tip: 3.0,
    distance: 3.1,
    duration: 22,
    completedAt: "2024-01-15T12:20:00Z",
  },
]

export function EarningsTracker() {
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month">("today")

  const currentData = mockDriverEarnings[selectedPeriod]
  const weeklyGoal = 600
  const weeklyProgress = (mockDriverEarnings.week.earnings / weeklyGoal) * 100

  return (
    <div className="space-y-6">
      {/* Meta semanal */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Meta Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Progreso</span>
              <span className="font-semibold">
                ${mockDriverEarnings.week.earnings.toFixed(2)} / ${weeklyGoal.toFixed(2)}
              </span>
            </div>
            <Progress value={weeklyProgress} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {weeklyProgress >= 100
                ? "¡Felicitaciones! Has superado tu meta semanal"
                : `Te faltan $${(weeklyGoal - mockDriverEarnings.week.earnings).toFixed(2)} para alcanzar tu meta`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de ganancias */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Ganancias</p>
              <p className="text-xl font-bold text-primary">${currentData.earnings.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Propinas</p>
              <p className="text-xl font-bold text-green-600">${currentData.tips.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Entregas</p>
              <p className="text-xl font-bold">{currentData.deliveries}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Horas</p>
              <p className="text-xl font-bold">{currentData.hours}h</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Por Entrega</p>
              <p className="text-xl font-bold">${currentData.avgPerDelivery.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historial de entregas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Entregas Recientes</CardTitle>
            <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
              <TabsList>
                <TabsTrigger value="today">Hoy</TabsTrigger>
                <TabsTrigger value="week">Semana</TabsTrigger>
                <TabsTrigger value="month">Mes</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentDeliveries.map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{delivery.restaurant}</p>
                    <p className="text-sm text-muted-foreground">Pedido #{delivery.orderId}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>{delivery.distance} km</span>
                      <span>{delivery.duration} min</span>
                      <span>{new Date(delivery.completedAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">${delivery.earnings.toFixed(2)}</p>
                  {delivery.tip > 0 && <p className="text-sm text-green-600">+${delivery.tip.toFixed(2)} propina</p>}
                  <p className="text-xs text-muted-foreground">
                    Total: ${(delivery.earnings + delivery.tip).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Información de pagos */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Saldo disponible:</span>
              <span className="text-xl font-bold text-green-600">
                ${(currentData.earnings + currentData.tips).toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Los pagos se procesan diariamente a las 11:00 PM</p>
            <div className="flex gap-2">
              <Button size="sm">Retirar fondos</Button>
              <Button variant="outline" size="sm">
                Configurar cuenta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
