import type { NextRequest } from "next/server"
import { addSubscriber, removeSubscriber, getNotifications } from "@/lib/notifications"

export async function GET(request: NextRequest, { params }: { params: { userType: string; userId: string } }) {
  const { userType, userId } = params

  // Configurar Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      // Enviar configuración inicial
      controller.enqueue(encoder.encode('data: {"type": "connected"}\n\n'))

      // Crear respuesta mock para el sistema de suscriptores
      const mockResponse = {
        body: {
          getWriter: () => ({
            write: (data: Uint8Array) => {
              controller.enqueue(data)
            },
          }),
        },
      } as Response

      // Agregar suscriptor
      addSubscriber(userId, userType, mockResponse)

      // Enviar notificaciones existentes
      const existingNotifications = getNotifications(userId, userType)
      existingNotifications.forEach((notification) => {
        const data = encoder.encode(`data: ${JSON.stringify(notification)}\n\n`)
        controller.enqueue(data)
      })
    },
    cancel() {
      removeSubscriber(userId, userType)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
