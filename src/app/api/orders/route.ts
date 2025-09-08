import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { merchantId, items, address, lat, lng, paymentMethod } = body

    if (!merchantId || !items?.length) {
      return NextResponse.json({ error: "merchantId e items son obligatorios" }, { status: 400 })
    }

    const itemsTotal = items.reduce((acc: number, it: any) => acc + Number(it.unitPrice) * Number(it.qty), 0)
    // MVP: delivery fijo; luego calcular por distancia (Mapbox/ORS)
    const deliveryPrice = 1000
    const grandTotal = itemsTotal + deliveryPrice

    const order = await prisma.order.create({
      data: {
        merchantId,
        status: "received",
        paymentMethod,
        deliveryAddress: address,
        deliveryLat: lat,
        deliveryLng: lng,
        itemsTotal,
        deliveryPrice,
        grandTotal,
        items: {
          create: items.map((it: any) => ({
            nameSnapshot: it.name,
            unitPrice: it.unitPrice,
            quantity: it.qty,
            subtotal: it.unitPrice * it.qty
          }))
        }
      },
      include: { items: true }
    })

    // TODO: publicar a Ably canal merchant:{merchantId}
    return NextResponse.json({ orderId: order.id, grandTotal })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
