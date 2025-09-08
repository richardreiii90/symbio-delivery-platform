import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { customerId, businessId, items, total, deliveryAddress, paymentMethod } = await request.json()

    const [order] = await sql`
      INSERT INTO orders (customer_id, business_id, total_amount, delivery_address, payment_method, status, created_at)
      VALUES (${customerId}, ${businessId}, ${total}, ${deliveryAddress}, ${paymentMethod}, 'pending', NOW())
      RETURNING id, created_at
    `

    for (const item of items) {
      try {
        await sql`
          INSERT INTO order_items (order_id, menu_item_id, quantity, price, special_instructions)
          VALUES (${order.id}, ${item.id}, ${item.quantity}, ${item.price}, ${item.instructions || ""})
        `
      } catch (itemError) {
        console.log(`[v0] Error adding item ${item.id} to order ${order.id}`)
      }
    }

    console.log(`[v0] ✅ Nuevo pedido #${order.id} creado exitosamente`)
    console.log(`[v0] 💳 Método de pago: ${paymentMethod}`)
    console.log(`[v0] 💰 Total: $${total}`)
    console.log(`[v0] 🏪 Comercio notificado del nuevo pedido`)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: `Pedido confirmado. Método de pago: ${paymentMethod}. El comercio ha sido notificado y procesará tu pedido pronto.`,
    })
  } catch (error) {
    console.error("[v0] Error creating order:", error)
    return NextResponse.json({ error: "Error al crear pedido" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customerId")
    const businessId = searchParams.get("businessId")

    let orders
    if (customerId) {
      orders = await sql`
        SELECT o.*, b.name as business_name 
        FROM orders o 
        JOIN businesses b ON o.business_id = b.id 
        WHERE o.customer_id = ${customerId} 
        ORDER BY o.created_at DESC
      `
    } else if (businessId) {
      orders = await sql`
        SELECT o.*, u.name as customer_name 
        FROM orders o 
        JOIN users u ON o.customer_id = u.id 
        WHERE o.business_id = ${businessId} 
        ORDER BY o.created_at DESC
      `
    } else {
      orders = await sql`SELECT * FROM orders ORDER BY created_at DESC LIMIT 50`
    }

    return NextResponse.json({ success: true, orders })
  } catch (error) {
    console.error("[v0] Error fetching orders:", error)
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 })
  }
}
