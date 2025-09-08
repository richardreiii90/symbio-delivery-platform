import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const drivers = await sql`
      SELECT d.*, u.name as user_name
      FROM drivers d
      JOIN users u ON d.user_id = u.id
      ORDER BY d.created_at DESC
    `

    return NextResponse.json(drivers)
  } catch (error) {
    console.error("[v0] Error fetching drivers:", error)
    return NextResponse.json({ error: "Error al obtener repartidores" }, { status: 500 })
  }
}
