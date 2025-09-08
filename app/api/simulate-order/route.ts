import { NextResponse } from "next/server"
import { notifyOrderCreated } from "@/lib/notifications"

export async function POST() {
  try {
    // Simular la creación de un nuevo pedido
    const orderId = `ORD-${Math.random().toString(36).substr(2, 9)}`

    // Notificar al comercio sobre el nuevo pedido
    notifyOrderCreated(orderId, "business_123", "Juan Pérez")

    return NextResponse.json({
      success: true,
      message: "Pedido simulado creado",
      orderId,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error creating simulated order",
      },
      { status: 500 },
    )
  }
}
