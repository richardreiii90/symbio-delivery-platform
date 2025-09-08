import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("[v0] Intentando login para:", email)

    const [user] = await sql`
      SELECT id, name, email, user_type, password_hash
      FROM users 
      WHERE email = ${email}
    `

    if (!user) {
      console.log("[v0] Usuario no encontrado para email:", email)
      return NextResponse.json({ success: false, error: "Email o contraseña incorrectos" }, { status: 401 })
    }

    console.log("[v0] Usuario encontrado:", user.name, "tipo:", user.user_type)
    console.log("[v0] Hash almacenado:", user.password_hash.substring(0, 20) + "...")
    console.log("[v0] Contraseña recibida length:", password.length)

    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    console.log("[v0] Resultado comparación bcrypt:", isValidPassword)

    if (!isValidPassword) {
      console.log("[v0] Contraseña incorrecta para usuario:", user.email)
      return NextResponse.json({ success: false, error: "Email o contraseña incorrectos" }, { status: 401 })
    }

    console.log("[v0] Login exitoso para usuario:", user.name, "tipo:", user.user_type)

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, userType: user.user_type },
    })

    response.cookies.set(
      "user-session",
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.user_type,
      }),
      {
        httpOnly: false, // Permitir acceso desde JavaScript
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 días
      },
    )

    return response
  } catch (error) {
    console.error("[v0] Error logging in:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
