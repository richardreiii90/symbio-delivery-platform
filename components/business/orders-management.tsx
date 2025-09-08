"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, CheckCircle, X, Eye, MapPin, Phone } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { useNotifications } from "@/contexts/notification-context"

// Mock orders data
const mockOrders = [
  {
    id: "ORD-001",
    customer_name: "Juan Pérez",
    customer_phone: "+1234567890",
    items: [
      { name: "Burger Clásica", quantity: 2, price: 12.99 },
      { name: "Papas Fritas", quantity: 1, price: 4.99 },
    ],
    total: 30.97,
    delivery_address: "Av. Libertador 456, Apt 3B",
    status: "pending",
    created_at: "2024-01-15T14:15:00Z",
    notes: "Sin cebolla en las hamburguesas",
  },
  {
    id: "ORD-002",
    customer_name: "María García",
    customer_phone: "+1234567891",
    items: [
      { name: "Burger BBQ", quantity: 1, price: 15.99 },
      { name: "Coca Cola", quantity: 2, price: 2.99 },
    ],
    total: 21.97,
    delivery_address: "Calle Principal 123",
    status: "accepted",
    created_at: "2024-01-15T14:10:00Z",
    notes: "",
  },
  {
    id: "ORD-003",
    customer_name: "Carlos López",
    customer_phone: "+1234567892",
    items: [
      { name: "Burger Vegetariana", quantity: 1, price: 11.99 },
      { name: "Aros de Cebolla", quantity: 1, price: 5.99 },
      { name: "Agua Natural", quantity: 1, price: 1.99 },
    ],
    total: 19.97,
    delivery_address: "Plaza Central 789",
    status: "preparing",
    created_at: "2024-01-15T14:05:00Z",
    notes: "Entrega urgente",
  },
]

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-yellow-500", textColor: "text-yellow-600" },
  accepted: { label: "Aceptado", color: "bg-blue-500", textColor: "text-blue-600" },
  preparing: { label: "Preparando", color: "bg-orange-500", textColor: "text-orange-600" },
  ready: { label: "Listo", color: "bg-green-500", textColor: "text-green-600" },
  picked_up: { label: "Recogido", color: "bg-purple-500", textColor: "text-purple-600" },
}

export function OrdersManagement() {
  const [orders, setOrders] = useState(mockOrders)
  // const { playSound } = useNotifications()

  // useEffect(() => {
  //   const pendingCount = orders.filter((order) => order.status === "pending").length
  //   if (pendingCount > 0) {
  //     playSound()
  //   }
  // }, [orders, playSound])

  const handleAcceptOrder = async (orderId: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "accepted" } : order)))

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" }),
      })
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const handleRejectOrder = async (orderId: string) => {
    setOrders(orders.filter((order) => order.id !== orderId))

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      })
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const pendingOrders = orders.filter((order) => order.status === "pending")
  const activeOrders = orders.filter((order) => order.status !== "pending")

  return (
    <div className="space-y-6">
      {/* Pending Orders - Priority Section */}
      {pendingOrders.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Clock className="w-5 h-5" />
              Pedidos Pendientes ({pendingOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <Card key={order.id} className="border-yellow-300">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">Pedido #{order.id}</h3>
                          <Badge className="bg-yellow-500 text-white">
                            {statusConfig[order.status as keyof typeof statusConfig].label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Cliente: {order.customer_name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {order.delivery_address}
                        </div>
                        <div className="text-lg font-bold text-primary">${order.total.toFixed(2)}</div>
                        {order.notes && (
                          <p className="text-sm bg-muted p-2 rounded">
                            <strong>Notas:</strong> {order.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Detalles del Pedido #{order.id}</DialogTitle>
                            </DialogHeader>
                            <OrderDetails order={order} />
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="sm" onClick={() => handleRejectOrder(order.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                        <Button size="sm" onClick={() => handleAcceptOrder(order.id)}>
                          <CheckCircle className="w-4 h-4" />
                          Aceptar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Activos ({activeOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {activeOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No hay pedidos activos en este momento</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell className="font-semibold">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={statusConfig[order.status as keyof typeof statusConfig].color + " text-white"}>
                        {statusConfig[order.status as keyof typeof statusConfig].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleTimeString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Detalles del Pedido #{order.id}</DialogTitle>
                            </DialogHeader>
                            <OrderDetails order={order} />
                          </DialogContent>
                        </Dialog>
                        {order.status === "accepted" && (
                          <Button size="sm" onClick={() => handleUpdateStatus(order.id, "preparing")}>
                            Preparar
                          </Button>
                        )}
                        {order.status === "preparing" && (
                          <Button size="sm" onClick={() => handleUpdateStatus(order.id, "ready")}>
                            Listo
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function OrderDetails({ order }: { order: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">Información del Cliente</h4>
          <p className="text-sm">{order.customer_name}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Phone className="w-3 h-3" />
            {order.customer_phone}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Dirección de Entrega</h4>
          <div className="flex items-start gap-1 text-sm">
            <MapPin className="w-3 h-3 mt-0.5" />
            {order.delivery_address}
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Items del Pedido</h4>
        <div className="space-y-2">
          {order.items.map((item: any, index: number) => (
            <div key={index} className="flex justify-between items-center py-2 border-b">
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="text-muted-foreground ml-2">x{item.quantity}</span>
              </div>
              <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2 font-bold text-lg">
            <span>Total:</span>
            <span className="text-primary">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {order.notes && (
        <div>
          <h4 className="font-semibold mb-2">Notas Especiales</h4>
          <p className="text-sm bg-muted p-3 rounded">{order.notes}</p>
        </div>
      )}
    </div>
  )
}
