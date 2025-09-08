"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Locate, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapComponent } from "@/components/map-component"
import { getCurrentLocation, reverseGeocode, type Location } from "@/lib/geolocation"
import { useToast } from "@/hooks/use-toast"

export function LocationSelector() {
  const [location, setLocation] = useState("Seleccionar ubicación")
  const [isOpen, setIsOpen] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [addressInput, setAddressInput] = useState("")
  const { toast } = useToast()

  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true)
    try {
      const location = await getCurrentLocation()
      setCurrentLocation(location)
      setSelectedLocation(location)

      // Obtener dirección legible
      const address = await reverseGeocode(location)
      setLocation(address)
      setAddressInput(address)

      toast({
        title: "Ubicación obtenida",
        description: "Se ha obtenido tu ubicación actual exitosamente",
      })
    } catch (error) {
      toast({
        title: "Error de ubicación",
        description: "No se pudo obtener tu ubicación. Verifica los permisos.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingLocation(false)
    }
  }

  const handleMapLocationSelect = async (location: Location) => {
    setSelectedLocation(location)
    try {
      const address = await reverseGeocode(location)
      setAddressInput(address)
    } catch (error) {
      setAddressInput(`${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`)
    }
  }

  const handleLocationConfirm = () => {
    if (selectedLocation && addressInput) {
      setLocation(addressInput)
      setIsOpen(false)
      toast({
        title: "Ubicación guardada",
        description: "Tu ubicación de entrega ha sido actualizada",
      })
    }
  }

  const mapPoints = selectedLocation
    ? [
        {
          location: selectedLocation,
          name: "Ubicación seleccionada",
          type: "delivery" as const,
        },
      ]
    : []

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <MapPin className="w-4 h-4" />
          <span className="max-w-32 truncate">{location}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Selecciona tu ubicación</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Mapa interactivo */}
          <div>
            <Label>Selecciona en el mapa o usa tu ubicación actual</Label>
            <div className="mt-2">
              <MapComponent
                center={currentLocation || undefined}
                points={mapPoints}
                onLocationSelect={handleMapLocationSelect}
                className="w-full h-64"
              />
            </div>
          </div>

          {/* Campo de dirección */}
          <div>
            <Label htmlFor="address">Dirección de entrega</Label>
            <Input
              id="address"
              placeholder="Ingresa tu dirección completa"
              className="mt-1"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
            />
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2">
            <Button
              onClick={handleGetCurrentLocation}
              disabled={isLoadingLocation}
              className="flex-1 bg-transparent"
              variant="outline"
            >
              {isLoadingLocation ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Locate className="w-4 h-4 mr-2" />
              )}
              Usar ubicación actual
            </Button>
            <Button onClick={handleLocationConfirm} disabled={!selectedLocation || !addressInput} className="flex-1">
              Confirmar ubicación
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
