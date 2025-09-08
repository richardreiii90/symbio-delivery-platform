import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Clock, Truck, CheckCircle } from "lucide-react"
import Link from "next/link"

// Mock order data
const mockOrders = [
  {
    id: "ORD-001",
    restaurant_name: "Burger Palace",
    status: "delivered",
    items: ["Burger Clásica", "Papas Fritas", "Coca Cola"],
    total: 20.47,
    delivery_address: "Av. Libertador 456, Apt 3B",
    estimated_delivery: "2024-01-15T14:30:00Z",
    delivered_at: "2024-01-15T14:25:00Z",
  },
  {
    id: "ORD-002",
    restaurant_name: "Pizza Express",
    status: "picked_up",
    items: ["Pizza Margherita", "Agua Natural"],
    total: 18.99,
    delivery_address: "Calle Principal 123",
    estimated_delivery: "2024-01-15T15:45:00Z",
    delivered_at: null,
  },
  {
    id: "ORD-003",
    restaurant_name: "Sushi Zen",
    status: "preparing",
    items: ["Sushi Roll California", "Sopa Miso"],
    total: 25.5,
    delivery_address: "Plaza Central 789",
    estimated_delivery: "2024-01-15T16:15:00Z",
    delivered_at: null,
  },
]

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-yellow-500", icon: Clock },
  accepted: { label: "Aceptado", color: "bg-blue-500", icon: CheckCircle },
  preparing: { label: "Preparando", color: "bg-orange-500", icon: Clock },
  ready: { label: "Listo", color: "bg-green-500", icon: CheckCircle },
  picked_up: { label: "En camino", color: "bg-purple-500", icon: Truck },
  delivered: { label: "Entregado", color: "bg-green-600", icon: CheckCircle },
  cancelled: { label: "Cancelado", color: "bg-red-500", icon: Clock },
}

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Mis Pedidos</h1>
          </div>
        </div>
      </header>

      {/* Orders List */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-4">
          {mockOrders.map((order) => {
            const statusInfo = statusConfig[order.status as keyof typeof statusConfig]
            const StatusIcon = statusInfo.icon

            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{order.restaurant_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">Pedido #{order.id}</p>
                    </div>
                    <Badge className={`${statusInfo.color} text-white`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Items del pedido:</h4>
                    <ul className="text-sm text-muted-foreground">
                      {order.items.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{order.delivery_address}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {order.status === "delivered" ? (
                        <span>Entregado el {new Date(order.delivered_at!).toLocaleString()}</span>
                      ) : (
                        <span>Estimado: {new Date(order.estimated_delivery).toLocaleTimeString()}</span>
                      )}
                    </div>
                    <div className="text-lg font-bold text-primary">${order.total.toFixed(2)}</div>
                  </div>

                  {order.status === "picked_up" && (
                    <Button className="w-full bg-transparent" variant="outline">
                      <Truck className="w-4 h-4 mr-2" />
                      Rastrear pedido
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
