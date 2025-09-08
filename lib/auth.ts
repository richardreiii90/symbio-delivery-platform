import { cookies } from "next/headers"
import { getUserById } from "./database"

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("user_id")?.value

  if (!userId) {
    return null
  }

  try {
    const user = await getUserById(userId)
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function setUserSession(userId: string) {
  const cookieStore = await cookies()
  cookieStore.set("user_id", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearUserSession() {
  const cookieStore = await cookies()
  cookieStore.delete("user_id")
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
