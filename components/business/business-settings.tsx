"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, MapPin, Bell } from "lucide-react"

const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

export function BusinessSettings() {
  const [businessInfo, setBusinessInfo] = useState({
    name: "Burger Palace",
    description: "Las mejores hamburguesas de la ciudad",
    address: "Av. Principal 123",
    phone: "+1234567890",
    email: "info@burgerpalace.com",
  })

  const [businessHours, setBusinessHours] = useState([
    { day: 0, isOpen: false, openTime: "09:00", closeTime: "22:00" }, // Domingo
    { day: 1, isOpen: true, openTime: "09:00", closeTime: "22:00" }, // Lunes
    { day: 2, isOpen: true, openTime: "09:00", closeTime: "22:00" }, // Martes
    { day: 3, isOpen: true, openTime: "09:00", closeTime: "22:00" }, // Miércoles
    { day: 4, isOpen: true, openTime: "09:00", closeTime: "22:00" }, // Jueves
    { day: 5, isOpen: true, openTime: "09:00", closeTime: "23:00" }, // Viernes
    { day: 6, isOpen: true, openTime: "10:00", closeTime: "23:00" }, // Sábado
  ])

  const [deliverySettings, setDeliverySettings] = useState({
    deliveryFee: 2.5,
    minOrderAmount: 15.0,
    maxDeliveryDistance: 10,
    estimatedDeliveryTime: 30,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    soundEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    autoAcceptOrders: false,
  })

  const handleSaveBusinessInfo = () => {
    // TODO: Save business info to database
    console.log("Saving business info:", businessInfo)
  }

  const handleSaveHours = () => {
    // TODO: Save business hours to database
    console.log("Saving business hours:", businessHours)
  }

  const handleSaveDeliverySettings = () => {
    // TODO: Save delivery settings to database
    console.log("Saving delivery settings:", deliverySettings)
  }

  const handleSaveNotifications = () => {
    // TODO: Save notification settings to database
    console.log("Saving notification settings:", notificationSettings)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="business">Información</TabsTrigger>
          <TabsTrigger value="hours">Horarios</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Información del Negocio</CardTitle>
              <CardDescription>Actualiza la información básica de tu restaurante</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Nombre del Negocio</Label>
                  <Input
                    id="business-name"
                    value={businessInfo.name}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={businessInfo.phone}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={businessInfo.description}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={businessInfo.address}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={businessInfo.email}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                />
              </div>

              <Button onClick={handleSaveBusinessInfo}>Guardar Información</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horarios de Atención
              </CardTitle>
              <CardDescription>Configura los horarios de apertura y cierre para cada día</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {businessHours.map((dayHours) => (
                <div key={dayHours.day} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-24">
                    <span className="font-medium">{daysOfWeek[dayHours.day]}</span>
                  </div>

                  <Switch
                    checked={dayHours.isOpen}
                    onCheckedChange={(checked) => {
                      setBusinessHours((hours) =>
                        hours.map((h) => (h.day === dayHours.day ? { ...h, isOpen: checked } : h)),
                      )
                    }}
                  />

                  {dayHours.isOpen ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={dayHours.openTime}
                        onChange={(e) => {
                          setBusinessHours((hours) =>
                            hours.map((h) => (h.day === dayHours.day ? { ...h, openTime: e.target.value } : h)),
                          )
                        }}
                        className="w-32"
                      />
                      <span>a</span>
                      <Input
                        type="time"
                        value={dayHours.closeTime}
                        onChange={(e) => {
                          setBusinessHours((hours) =>
                            hours.map((h) => (h.day === dayHours.day ? { ...h, closeTime: e.target.value } : h)),
                          )
                        }}
                        className="w-32"
                      />
                    </div>
                  ) : (
                    <Badge variant="outline">Cerrado</Badge>
                  )}
                </div>
              ))}

              <Button onClick={handleSaveHours}>Guardar Horarios</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Configuración de Delivery
              </CardTitle>
              <CardDescription>Configura las opciones de entrega y tarifas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="delivery-fee">Tarifa de Envío ($)</Label>
                  <Input
                    id="delivery-fee"
                    type="number"
                    step="0.01"
                    value={deliverySettings.deliveryFee}
                    onChange={(e) =>
                      setDeliverySettings({
                        ...deliverySettings,
                        deliveryFee: Number.parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min-order">Pedido Mínimo ($)</Label>
                  <Input
                    id="min-order"
                    type="number"
                    step="0.01"
                    value={deliverySettings.minOrderAmount}
                    onChange={(e) =>
                      setDeliverySettings({
                        ...deliverySettings,
                        minOrderAmount: Number.parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max-distance">Distancia Máxima (km)</Label>
                  <Input
                    id="max-distance"
                    type="number"
                    value={deliverySettings.maxDeliveryDistance}
                    onChange={(e) =>
                      setDeliverySettings({
                        ...deliverySettings,
                        maxDeliveryDistance: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-time">Tiempo Estimado (min)</Label>
                  <Input
                    id="delivery-time"
                    type="number"
                    value={deliverySettings.estimatedDeliveryTime}
                    onChange={(e) =>
                      setDeliverySettings({
                        ...deliverySettings,
                        estimatedDeliveryTime: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSaveDeliverySettings}>Guardar Configuración</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Configuración de Notificaciones
              </CardTitle>
              <CardDescription>Configura cómo quieres recibir las notificaciones de pedidos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Sonido de Notificación</h4>
                    <p className="text-sm text-muted-foreground">Reproducir sonido cuando llegue un nuevo pedido</p>
                  </div>
                  <Switch
                    checked={notificationSettings.soundEnabled}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, soundEnabled: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notificaciones por Email</h4>
                    <p className="text-sm text-muted-foreground">Recibir resumen diario de pedidos por email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notificaciones SMS</h4>
                    <p className="text-sm text-muted-foreground">Recibir SMS para pedidos urgentes</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-aceptar Pedidos</h4>
                    <p className="text-sm text-muted-foreground">Aceptar automáticamente todos los pedidos</p>
                  </div>
                  <Switch
                    checked={notificationSettings.autoAcceptOrders}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, autoAcceptOrders: checked })
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotifications}>Guardar Configuración</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
