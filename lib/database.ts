import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Database utility functions
export async function createUser(userData: {
  id: string
  email: string
  name: string
  phone?: string
  userType: "customer" | "business" | "delivery"
}) {
  const result = await sql`
    INSERT INTO users (id, email, name, phone, user_type)
    VALUES (${userData.id}, ${userData.email}, ${userData.name}, ${userData.phone || null}, ${userData.userType})
    RETURNING *
  `
  return result[0]
}

export async function getUserById(id: string) {
  const result = await sql`
    SELECT * FROM users WHERE id = ${id}
  `
  return result[0]
}

export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `
  return result[0]
}

export async function createBusiness(businessData: {
  id: string
  userId: string
  businessName: string
  description?: string
  address: string
  phone: string
  latitude?: number
  longitude?: number
}) {
  const result = await sql`
    INSERT INTO businesses (id, user_id, business_name, description, address, phone, latitude, longitude)
    VALUES (${businessData.id}, ${businessData.userId}, ${businessData.businessName}, 
            ${businessData.description || null}, ${businessData.address}, ${businessData.phone},
            ${businessData.latitude || null}, ${businessData.longitude || null})
    RETURNING *
  `
  return result[0]
}

export async function createDeliveryDriver(driverData: {
  id: string
  userId: string
  vehicleType: string
  licensePlate?: string
}) {
  const result = await sql`
    INSERT INTO delivery_drivers (id, user_id, vehicle_type, license_plate)
    VALUES (${driverData.id}, ${driverData.userId}, ${driverData.vehicleType}, ${driverData.licensePlate || null})
    RETURNING *
  `
  return result[0]
}

export async function getBusinessesByLocation(latitude: number, longitude: number, radiusKm = 10) {
  const result = await sql`
    SELECT b.*, u.name as owner_name, u.email as owner_email
    FROM businesses b
    JOIN users u ON b.user_id = u.id
    WHERE b.is_active = true
    AND b.latitude IS NOT NULL 
    AND b.longitude IS NOT NULL
    AND (
      6371 * acos(
        cos(radians(${latitude})) * cos(radians(b.latitude)) *
        cos(radians(b.longitude) - radians(${longitude})) +
        sin(radians(${latitude})) * sin(radians(b.latitude))
      )
    ) <= ${radiusKm}
    ORDER BY (
      6371 * acos(
        cos(radians(${latitude})) * cos(radians(b.latitude)) *
        cos(radians(b.longitude) - radians(${longitude})) +
        sin(radians(${latitude})) * sin(radians(b.latitude))
      )
    )
  `
  return result
}

export async function getAvailableDrivers(latitude: number, longitude: number, radiusKm = 5) {
  const result = await sql`
    SELECT dd.*, u.name, u.phone
    FROM delivery_drivers dd
    JOIN users u ON dd.user_id = u.id
    WHERE dd.is_available = true
    AND dd.current_latitude IS NOT NULL 
    AND dd.current_longitude IS NOT NULL
    AND (
      6371 * acos(
        cos(radians(${latitude})) * cos(radians(dd.current_latitude)) *
        cos(radians(dd.current_longitude) - radians(${longitude})) +
        sin(radians(${latitude})) * sin(radians(dd.current_latitude))
      )
    ) <= ${radiusKm}
    ORDER BY (
      6371 * acos(
        cos(radians(${latitude})) * cos(radians(dd.current_latitude)) *
        cos(radians(dd.current_longitude) - radians(${longitude})) +
        sin(radians(${latitude})) * sin(radians(dd.current_latitude))
      )
    )
  `
  return result
}
