import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get("businessId")

    if (!businessId) {
      return NextResponse.json({ error: "Business ID requerido" }, { status: 400 })
    }

    const menuItems = await sql`
      SELECT * FROM menu_items 
      WHERE business_id = ${businessId} 
      ORDER BY category, name
    `

    return NextResponse.json({ success: true, items: menuItems })
  } catch (error) {
    console.error("[v0] Error fetching menu:", error)
    return NextResponse.json({ error: "Error al obtener menú" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { businessId, name, description, price, category, imageUrl, preparationTime } = await request.json()

    const [newItem] = await sql`
      INSERT INTO menu_items (business_id, name, description, price, category, image_url, preparation_time, is_available, created_at)
      VALUES (${businessId}, ${name}, ${description}, ${price}, ${category}, ${imageUrl}, ${preparationTime}, true, NOW())
      RETURNING *
    `

    return NextResponse.json({ success: true, item: newItem })
  } catch (error) {
    console.error("[v0] Error adding menu item:", error)
    return NextResponse.json({ error: "Error al agregar item" }, { status: 500 })
  }
}
