import { type NextRequest, NextResponse } from "next/server"
import { notifyOrderAccepted, notifyDriverAssigned } from "@/lib/notifications"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status, driverId } = await request.json()
    const orderId = params.id

    // Aquí normalmente actualizarías la base de datos
    // Por ahora simulamos la actualización

    // Enviar notificaciones según el nuevo estado
    if (status === "accepted") {
      // Notificar al cliente que el pedido fue aceptado
      notifyOrderAccepted(orderId, "customer_123", "Burger Palace")
    }

    if (status === "picked_up" && driverId) {
      // Notificar al cliente que el repartidor recogió el pedido
      notifyDriverAssigned(orderId, "customer_123", "Juan Pérez")
    }

    return NextResponse.json({ success: true, orderId, status })
  } catch (error) {
    return NextResponse.json({ error: "Error updating order status" }, { status: 500 })
  }
}
