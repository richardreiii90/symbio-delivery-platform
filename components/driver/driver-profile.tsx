"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Car, Settings, Star } from "lucide-react"

export function DriverProfile() {
  const [driverInfo, setDriverInfo] = useState({
    name: "Carlos Mendoza",
    email: "carlos.mendoza@email.com",
    phone: "+1234567890",
    address: "Av. Libertador 789, Ciudad",
    rating: 4.8,
    totalDeliveries: 1247,
    joinDate: "2023-03-15",
  })

  const [vehicleInfo, setVehicleInfo] = useState({
    type: "motorcycle",
    brand: "Honda",
    model: "CB 150",
    year: "2022",
    licensePlate: "ABC-123",
    color: "Rojo",
  })

  const [preferences, setPreferences] = useState({
    maxDistance: 15,
    workingHours: {
      start: "08:00",
      end: "20:00",
    },
    notifications: {
      sound: true,
      vibration: true,
      email: false,
    },
  })

  const handleSaveProfile = () => {
    console.log("Saving driver profile:", driverInfo)
  }

  const handleSaveVehicle = () => {
    console.log("Saving vehicle info:", vehicleInfo)
  }

  const handleSavePreferences = () => {
    console.log("Saving preferences:", preferences)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Perfil Personal</TabsTrigger>
          <TabsTrigger value="vehicle">Vehículo</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Información Personal
              </CardTitle>
              <CardDescription>Actualiza tu información personal y de contacto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Driver Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-2xl font-bold">{driverInfo.rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Calificación</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{driverInfo.totalDeliveries}</div>
                  <p className="text-sm text-muted-foreground">Entregas totales</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.floor((Date.now() - new Date(driverInfo.joinDate).getTime()) / (1000 * 60 * 60 * 24 * 30))}
                  </div>
                  <p className="text-sm text-muted-foreground">Meses activo</p>
                </div>
              </div>

              {/* Personal Information Form */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={driverInfo.name}
                    onChange={(e) => setDriverInfo({ ...driverInfo, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={driverInfo.phone}
                    onChange={(e) => setDriverInfo({ ...driverInfo, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={driverInfo.email}
                  onChange={(e) => setDriverInfo({ ...driverInfo, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Textarea
                  id="address"
                  value={driverInfo.address}
                  onChange={(e) => setDriverInfo({ ...driverInfo, address: e.target.value })}
                  rows={2}
                />
              </div>

              <Button onClick={handleSaveProfile}>Guardar Información Personal</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicle">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Información del Vehículo
              </CardTitle>
              <CardDescription>Configura la información de tu vehículo de entrega</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-type">Tipo de Vehículo</Label>
                  <Select
                    value={vehicleInfo.type}
                    onValueChange={(value) => setVehicleInfo({ ...vehicleInfo, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="motorcycle">Motocicleta</SelectItem>
                      <SelectItem value="bicycle">Bicicleta</SelectItem>
                      <SelectItem value="car">Automóvil</SelectItem>
                      <SelectItem value="scooter">Scooter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input
                    id="brand"
                    value={vehicleInfo.brand}
                    onChange={(e) => setVehicleInfo({ ...vehicleInfo, brand: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input
                    id="model"
                    value={vehicleInfo.model}
                    onChange={(e) => setVehicleInfo({ ...vehicleInfo, model: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Año</Label>
                  <Input
                    id="year"
                    value={vehicleInfo.year}
                    onChange={(e) => setVehicleInfo({ ...vehicleInfo, year: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="license-plate">Placa</Label>
                  <Input
                    id="license-plate"
                    value={vehicleInfo.licensePlate}
                    onChange={(e) => setVehicleInfo({ ...vehicleInfo, licensePlate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={vehicleInfo.color}
                    onChange={(e) => setVehicleInfo({ ...vehicleInfo, color: e.target.value })}
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2">Información del Vehículo Actual</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="capitalize">{vehicleInfo.type}</span>
                  <span className="text-muted-foreground">Vehículo:</span>
                  <span>
                    {vehicleInfo.brand} {vehicleInfo.model} ({vehicleInfo.year})
                  </span>
                  <span className="text-muted-foreground">Placa:</span>
                  <span className="font-mono">{vehicleInfo.licensePlate}</span>
                  <span className="text-muted-foreground">Color:</span>
                  <span>{vehicleInfo.color}</span>
                </div>
              </div>

              <Button onClick={handleSaveVehicle}>Guardar Información del Vehículo</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuración y Preferencias
              </CardTitle>
              <CardDescription>Personaliza tu experiencia de trabajo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Working Preferences */}
              <div className="space-y-4">
                <h4 className="font-semibold">Preferencias de Trabajo</h4>

                <div className="space-y-2">
                  <Label htmlFor="max-distance">Distancia Máxima de Entrega (km)</Label>
                  <Input
                    id="max-distance"
                    type="number"
                    value={preferences.maxDistance}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        maxDistance: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Hora de Inicio</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={preferences.workingHours.start}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          workingHours: { ...preferences.workingHours, start: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">Hora de Fin</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={preferences.workingHours.end}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          workingHours: { ...preferences.workingHours, end: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="space-y-4">
                <h4 className="font-semibold">Configuración de Notificaciones</h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sonido de Notificación</p>
                      <p className="text-sm text-muted-foreground">Reproducir sonido para nuevos pedidos</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.notifications.sound}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          notifications: { ...preferences.notifications, sound: e.target.checked },
                        })
                      }
                      className="w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Vibración</p>
                      <p className="text-sm text-muted-foreground">Vibrar el dispositivo para alertas</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.notifications.vibration}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          notifications: { ...preferences.notifications, vibration: e.target.checked },
                        })
                      }
                      className="w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificaciones por Email</p>
                      <p className="text-sm text-muted-foreground">Recibir resumen diario por email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.notifications.email}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          notifications: { ...preferences.notifications, email: e.target.checked },
                        })
                      }
                      className="w-4 h-4"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSavePreferences}>Guardar Configuración</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
