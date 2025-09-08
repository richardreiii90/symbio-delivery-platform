import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true, message: "Sesión cerrada exitosamente" })

    response.cookies.set("user-session", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expira inmediatamente
    })

    return response
  } catch (error) {
    console.error("[v0] Error logging out:", error)
    return NextResponse.json({ success: false, error: "Error al cerrar sesión" }, { status: 500 })
  }
}
