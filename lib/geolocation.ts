// Sistema de geolocalización y cálculo de distancias
export interface Location {
  latitude: number
  longitude: number
  address?: string
}

export interface RoutePoint {
  location: Location
  name: string
  type: "pickup" | "delivery" | "current"
}

// Obtener ubicación actual del usuario
export function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalización no soportada"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutos
      },
    )
  })
}

// Calcular distancia entre dos puntos usando fórmula de Haversine
export function calculateDistance(point1: Location, point2: Location): number {
  const R = 6371 // Radio de la Tierra en km
  const dLat = toRadians(point2.latitude - point1.latitude)
  const dLon = toRadians(point2.longitude - point1.longitude)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) *
      Math.cos(toRadians(point2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// Calcular tiempo estimado de viaje (asumiendo velocidad promedio de 30 km/h en ciudad)
export function calculateEstimatedTime(distance: number): number {
  const averageSpeed = 30 // km/h
  return Math.round((distance / averageSpeed) * 60) // minutos
}

// Geocodificación inversa simulada (en producción usarías una API real)
export async function reverseGeocode(location: Location): Promise<string> {
  // Simulación de geocodificación inversa
  const addresses = [
    "Av. Libertador 456, Buenos Aires",
    "Calle Principal 123, Córdoba",
    "Plaza Central 789, Rosario",
    "Av. San Martín 321, Mendoza",
    "Calle Roma 654, La Plata",
  ]

  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500))

  return addresses[Math.floor(Math.random() * addresses.length)]
}

// Generar ruta optimizada para múltiples puntos
export function generateOptimizedRoute(points: RoutePoint[]): RoutePoint[] {
  // Algoritmo simple de ruta más cercana (en producción usarías un algoritmo más sofisticado)
  const route: RoutePoint[] = []
  const remaining = [...points]

  // Comenzar desde la ubicación actual si existe
  const currentIndex = remaining.findIndex((p) => p.type === "current")
  if (currentIndex !== -1) {
    route.push(remaining.splice(currentIndex, 1)[0])
  }

  // Agregar puntos de recogida primero
  const pickups = remaining.filter((p) => p.type === "pickup")
  const deliveries = remaining.filter((p) => p.type === "delivery")

  route.push(...pickups, ...deliveries)

  return route
}
