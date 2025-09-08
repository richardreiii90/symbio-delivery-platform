"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock, DollarSign, Navigation, Phone, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useNotifications } from "@/contexts/notification-context"

// Mock orders data
const availableOrders = [
  {
    id: "ORD-001",
    restaurant_name: "Burger Palace",
    restaurant_address: "Av. Principal 123",
    customer_address: "Av. Libertador 456, Apt 3B",
    distance: 2.3,
    estimated_time: 15,
    payment: 8.5,
    items_count: 3,
    created_at: "2024-01-15T14:15:00Z",
  },
  {
    id: "ORD-002",
    restaurant_name: "Pizza Express",
    restaurant_address: "Calle Roma 456",
    customer_address: "Calle Principal 123",
    distance: 1.8,
    estimated_time: 12,
    payment: 6.75,
    items_count: 2,
    created_at: "2024-01-15T14:10:00Z",
  },
]

const activeOrders = [
  {
    id: "ORD-003",
    restaurant_name: "Sushi Zen",
    restaurant_address: "Plaza Central 789",
    customer_name: "María García",
    customer_phone: "+1234567891",
    customer_address: "Zona Norte 321",
    distance: 3.1,
    estimated_time: 18,
    payment: 12.0,
    items_count: 4,
    status: "picked_up",
    pickup_time: "2024-01-15T14:05:00Z",
  },
]

export function OrdersList() {
  const [orders, setOrders] = useState({ available: availableOrders, active: activeOrders })
  const { playSound } = useNotifications()

  useEffect(() => {
    if (orders.available.length > 0) {
      playSound()
    }
  }, [orders.available.length, playSound])

  const handleAcceptOrder = async (orderId: string) => {
    const order = orders.available.find((o) => o.id === orderId)
    if (order) {
      // Move order from available to active
      setOrders((prev) => ({
        available: prev.available.filter((o) => o.id !== orderId),
        active: [
          ...prev.active,
          { ...order, status: "accepted", customer_name: "Cliente", customer_phone: "+1234567890" },
        ],
      }))

      try {
        await fetch(`/api/orders/${orderId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "picked_up", driverId: "driver_123" }),
        })
      } catch (error) {
        console.error("Error updating order status:", error)
      }

      // Play notification sound
      playAcceptSound()
    }
  }

  const handleCompleteDelivery = async (orderId: string) => {
    setOrders((prev) => ({
      ...prev,
      active: prev.active.filter((o) => o.id !== orderId),
    }))

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "delivered" }),
      })
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const playAcceptSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 600
    oscillator.type = "sine"
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  }

  return (
    <Tabs defaultValue="available" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="available">Disponibles ({orders.available.length})</TabsTrigger>
        <TabsTrigger value="active">Activos ({orders.active.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="available" className="space-y-4">
        {orders.available.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No hay pedidos disponibles en este momento</p>
              <p className="text-sm text-muted-foreground mt-2">Mantente conectado para recibir nuevos pedidos</p>
            </CardContent>
          </Card>
        ) : (
          orders.available.map((order) => (
            <Card key={order.id} className="border-blue-200 bg-blue-50/30">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{order.restaurant_name}</h3>
                      <p className="text-sm text-muted-foreground">{order.items_count} items</p>
                    </div>
                    <Badge className="bg-blue-500 text-white">Nuevo</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span className="font-medium">Recoger:</span>
                      <span className="text-muted-foreground">{order.restaurant_address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Entregar:</span>
                      <span className="text-muted-foreground">{order.customer_address}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Navigation className="w-4 h-4" />
                        <span>{order.distance} km</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{order.estimated_time} min</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-primary">
                        <DollarSign className="w-4 h-4" />
                        <span>${order.payment.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Ver detalles
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Detalles del Pedido #{order.id}</DialogTitle>
                          </DialogHeader>
                          <OrderDetails order={order} />
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" onClick={() => handleAcceptOrder(order.id)}>
                        Aceptar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>

      <TabsContent value="active" className="space-y-4">
        {orders.active.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No tienes pedidos activos</p>
              <p className="text-sm text-muted-foreground mt-2">Acepta un pedido disponible para comenzar</p>
            </CardContent>
          </Card>
        ) : (
          orders.active.map((order) => (
            <Card key={order.id} className="border-green-200 bg-green-50/30">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{order.restaurant_name}</h3>
                      <p className="text-sm text-muted-foreground">Cliente: {order.customer_name}</p>
                    </div>
                    <Badge className="bg-green-500 text-white">En progreso</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Entregar en:</span>
                      <span className="text-muted-foreground">{order.customer_address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4" />
                      <span className="font-medium">Teléfono:</span>
                      <span className="text-muted-foreground">{order.customer_phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Navigation className="w-4 h-4" />
                        <span>{order.distance} km</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{order.estimated_time} min</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-primary">
                        <DollarSign className="w-4 h-4" />
                        <span>${order.payment.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Navigation className="w-4 h-4 mr-1" />
                        Navegar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleCompleteDelivery(order.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>
    </Tabs>
  )
}

function OrderDetails({ order }: { order: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">Información del Pedido</h4>
          <p className="text-sm">Pedido #{order.id}</p>
          <p className="text-sm text-muted-foreground">{order.items_count} items</p>
          <p className="text-sm text-muted-foreground">Creado: {new Date(order.created_at).toLocaleTimeString()}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Pago</h4>
          <p className="text-lg font-bold text-primary">${order.payment.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">Pago en efectivo</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Ruta de Entrega</h4>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5" />
            <div>
              <p className="font-medium">Recoger en:</p>
              <p className="text-sm text-muted-foreground">{order.restaurant_address}</p>
            </div>
          </div>
          <div className="ml-1.5 w-0.5 h-4 bg-gray-300" />
          <div className="flex items-start gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5" />
            <div>
              <p className="font-medium">Entregar en:</p>
              <p className="text-sm text-muted-foreground">{order.customer_address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted p-3 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span>Distancia total:</span>
          <span className="font-medium">{order.distance} km</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>Tiempo estimado:</span>
          <span className="font-medium">{order.estimated_time} minutos</span>
        </div>
      </div>
    </div>
  )
}
