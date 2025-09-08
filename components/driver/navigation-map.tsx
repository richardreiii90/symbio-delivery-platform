"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapComponent } from "@/components/map-component"
import {
  getCurrentLocation,
  calculateDistance,
  calculateEstimatedTime,
  generateOptimizedRoute,
  type Location,
  type RoutePoint,
} from "@/lib/geolocation"
import { Navigation, Clock, MapPin, Route } from "lucide-react"

interface NavigationMapProps {
  orderId: string
  pickupLocation: Location
  deliveryLocation: Location
  pickupAddress: string
  deliveryAddress: string
}

export function NavigationMap({
  orderId,
  pickupLocation,
  deliveryLocation,
  pickupAddress,
  deliveryAddress,
}: NavigationMapProps) {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([])
  const [totalDistance, setTotalDistance] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    initializeNavigation()

    // Actualizar ubicación cada 10 segundos durante navegación
    let locationInterval: NodeJS.Timeout
    if (isNavigating) {
      locationInterval = setInterval(updateCurrentLocation, 10000)
    }

    return () => {
      if (locationInterval) clearInterval(locationInterval)
    }
  }, [isNavigating])

  const initializeNavigation = async () => {
    try {
      const current = await getCurrentLocation()
      setCurrentLocation(current)

      const points: RoutePoint[] = [
        {
          location: current,
          name: "Mi ubicación",
          type: "current",
        },
        {
          location: pickupLocation,
          name: pickupAddress,
          type: "pickup",
        },
        {
          location: deliveryLocation,
          name: deliveryAddress,
          type: "delivery",
        },
      ]

      const optimizedRoute = generateOptimizedRoute(points)
      setRoutePoints(optimizedRoute)

      // Calcular distancia y tiempo total
      let totalDist = 0
      for (let i = 0; i < optimizedRoute.length - 1; i++) {
        totalDist += calculateDistance(optimizedRoute[i].location, optimizedRoute[i + 1].location)
      }

      setTotalDistance(totalDist)
      setEstimatedTime(calculateEstimatedTime(totalDist))
    } catch (error) {
      console.error("Error initializing navigation:", error)
    }
  }

  const updateCurrentLocation = async () => {
    try {
      const current = await getCurrentLocation()
      setCurrentLocation(current)

      // Actualizar el primer punto de la ruta con la nueva ubicación
      setRoutePoints((prev) => prev.map((point, index) => (index === 0 ? { ...point, location: current } : point)))
    } catch (error) {
      console.error("Error updating location:", error)
    }
  }

  const startNavigation = () => {
    setIsNavigating(true)
  }

  const stopNavigation = () => {
    setIsNavigating(false)
  }

  return (
    <div className="space-y-4">
      {/* Información del pedido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="w-5 h-5" />
            Navegación - Pedido #{orderId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <div>
                <p className="font-medium text-sm">Recoger en:</p>
                <p className="text-xs text-muted-foreground">{pickupAddress}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-500" />
              <div>
                <p className="font-medium text-sm">Entregar en:</p>
                <p className="text-xs text-muted-foreground">{deliveryAddress}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Navigation className="w-4 h-4" />
                <span>{totalDistance.toFixed(1)} km</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{estimatedTime} min</span>
              </div>
            </div>

            <div className="flex gap-2">
              {!isNavigating ? (
                <Button onClick={startNavigation} size="sm">
                  <Navigation className="w-4 h-4 mr-1" />
                  Iniciar navegación
                </Button>
              ) : (
                <Button onClick={stopNavigation} variant="destructive" size="sm">
                  Detener navegación
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mapa de navegación */}
      <Card>
        <CardContent className="p-0">
          <MapComponent
            center={currentLocation || undefined}
            points={routePoints}
            showRoute={true}
            className="w-full h-96"
          />
        </CardContent>
      </Card>

      {/* Estado de navegación */}
      {isNavigating && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Navegación activa</span>
              </div>
              <Badge className="bg-blue-500 text-white">Actualizando ubicación...</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instrucciones paso a paso */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Instrucciones de ruta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {routePoints.map((point, index) => (
              <div key={index} className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    point.type === "current" ? "bg-purple-500" : point.type === "pickup" ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{point.name}</p>
                  {index < routePoints.length - 1 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {calculateDistance(point.location, routePoints[index + 1].location).toFixed(1)} km -
                      {calculateEstimatedTime(calculateDistance(point.location, routePoints[index + 1].location))} min
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
