import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

const MASTER_KEY = "DeliveryAdmin2024!"

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password, userType, masterKey } = await request.json()

    if (userType === "admin") {
      if (!masterKey || masterKey !== MASTER_KEY) {
        return NextResponse.json(
          {
            success: false,
            error: "Llave maestra incorrecta. Solo el administrador principal puede crear cuentas de administrador.",
          },
          { status: 403 },
        )
      }
    }

    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Este email ya está registrado. Por favor usa otro email o inicia sesión.",
        },
        { status: 400 },
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const [user] = await sql`
      INSERT INTO users (name, email, phone, password_hash, user_type, created_at)
      VALUES (${name}, ${email}, ${phone}, ${hashedPassword}, ${userType}, NOW())
      RETURNING id, name, email, user_type
    `

    console.log("[v0] Usuario registrado exitosamente:", user.name, "tipo:", user.user_type)

    // Si es un comercio, crear entrada en businesses
    if (userType === "business") {
      await sql`
        INSERT INTO businesses (user_id, name, description, address, phone, is_open, created_at)
        VALUES (${user.id}, ${name}, 'Nuevo comercio', 'Dirección por definir', ${phone}, true, NOW())
      `
      console.log("[v0] Entrada de negocio creada para usuario:", user.id)
    }

    // Si es un repartidor, crear entrada en drivers
    if (userType === "driver") {
      await sql`
        INSERT INTO drivers (user_id, vehicle_type, license_plate, is_available, created_at)
        VALUES (${user.id}, 'Moto', 'ABC-123', false, NOW())
      `
      console.log("[v0] Entrada de repartidor creada para usuario:", user.id)
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
