import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const businesses = await sql`
      SELECT b.*, u.name as user_name
      FROM businesses b
      JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
    `

    return NextResponse.json(businesses)
  } catch (error) {
    console.error("[v0] Error fetching businesses:", error)
    return NextResponse.json({ error: "Error al obtener comercios" }, { status: 500 })
  }
}
