import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password, userType } = await request.json()

    const [user] = await sql`
      INSERT INTO users (name, email, phone, password_hash, user_type, created_at)
      VALUES (${name}, ${email}, ${phone}, ${password}, ${userType}, NOW())
      RETURNING id, name, email, user_type
    `

    // Si es un comercio, crear entrada en businesses
    if (userType === "business") {
      await sql`
        INSERT INTO businesses (user_id, name, description, address, phone, is_active, created_at)
        VALUES (${user.id}, ${name}, 'Nuevo comercio', 'Dirección por definir', ${phone}, true, NOW())
      `
    }

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, userType: user.user_type },
    })
  } catch (error) {
    console.error("[v0] Error registering user:", error)
    return NextResponse.json({ success: false, error: "Error al registrar usuario" }, { status: 500 })
  }
}
