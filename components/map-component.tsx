"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import type { Location, RoutePoint } from "@/lib/geolocation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface MapComponentProps {
  center?: Location
  points?: RoutePoint[]
  showRoute?: boolean
  onLocationSelect?: (location: Location) => void
  className?: string
}

export function MapComponent({
  center,
  points = [],
  showRoute = false,
  onLocationSelect,
  className = "w-full h-64",
}: MapComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mapCenter, setMapCenter] = useState<Location>(
    center || { latitude: -34.6037, longitude: -58.3816 }, // Buenos Aires por defecto
  )
  const [zoom, setZoom] = useState(13)

  useEffect(() => {
    drawMap()
  }, [mapCenter, zoom, points, showRoute])

  const drawMap = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Dibujar fondo del mapa (simulado)
    ctx.fillStyle = "#f0f9ff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Dibujar grid de calles simulado
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1

    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }

    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Dibujar puntos
    points.forEach((point, index) => {
      const x = (point.location.longitude - mapCenter.longitude) * 10000 + canvas.width / 2
      const y = (mapCenter.latitude - point.location.latitude) * 10000 + canvas.height / 2

      // Color según tipo de punto
      let color = "#3b82f6" // azul por defecto
      if (point.type === "pickup") color = "#ef4444" // rojo
      if (point.type === "delivery") color = "#22c55e" // verde
      if (point.type === "current") color = "#8b5cf6" // púrpura

      // Dibujar marcador
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, 2 * Math.PI)
      ctx.fill()

      // Dibujar borde blanco
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Dibujar número de orden
      ctx.fillStyle = "#ffffff"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText((index + 1).toString(), x, y + 4)
    })

    // Dibujar ruta si está habilitada
    if (showRoute && points.length > 1) {
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 3
      ctx.setLineDash([5, 5])

      ctx.beginPath()
      points.forEach((point, index) => {
        const x = (point.location.longitude - mapCenter.longitude) * 10000 + canvas.width / 2
        const y = (mapCenter.latitude - point.location.latitude) * 10000 + canvas.height / 2

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()
      ctx.setLineDash([])
    }
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onLocationSelect) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Convertir coordenadas de canvas a lat/lng
    const longitude = mapCenter.longitude + (x - canvas.width / 2) / 10000
    const latitude = mapCenter.latitude - (y - canvas.height / 2) / 10000

    onLocationSelect({ latitude, longitude })
  }

  const zoomIn = () => setZoom((prev) => Math.min(prev + 1, 18))
  const zoomOut = () => setZoom((prev) => Math.max(prev - 1, 1))

  return (
    <Card className={className}>
      <CardContent className="p-0 relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={256}
          className="w-full h-full cursor-pointer"
          onClick={handleCanvasClick}
        />

        {/* Controles de zoom */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <Button size="sm" variant="outline" onClick={zoomIn} className="w-8 h-8 p-0 bg-transparent">
            +
          </Button>
          <Button size="sm" variant="outline" onClick={zoomOut} className="w-8 h-8 p-0 bg-transparent">
            -
          </Button>
        </div>

        {/* Leyenda */}
        {points.length > 0 && (
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
            <div className="flex items-center gap-4">
              {points.some((p) => p.type === "current") && (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Actual</span>
                </div>
              )}
              {points.some((p) => p.type === "pickup") && (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Recoger</span>
                </div>
              )}
              {points.some((p) => p.type === "delivery") && (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Entregar</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
