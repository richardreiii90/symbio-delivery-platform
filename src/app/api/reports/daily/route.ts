import { NextResponse } from "next/server"
export async function GET() { return NextResponse.json({ ok: true, note: "Implementar generación de reportes diarios" }) }
export async function POST() { return GET() }
