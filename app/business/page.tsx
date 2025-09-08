"use client"

import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { OrdersManagement } from "@/components/business/orders-management"
import { MenuManagement } from "@/components/business/menu-management"
import { BusinessSettings } from "@/components/business/business-settings"
import { BusinessStats } from "@/components/business/business-stats"
import { NotificationSound } from "@/components/business/notification-sound"
import { NotificationBell } from "@/components/notification-bell"
import { Badge } from "@/components/ui/badge"
import { Store, Menu, Settings, BarChart3, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BusinessDashboard() {
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.href = "/auth"
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Panel de Comercio</h1>
                <p className="text-sm text-muted-foreground">Burger Palace</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-delivery-success text-white">Abierto</Badge>
              <NotificationBell />
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <Menu className="w-4 h-4" />
              Menú
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Estadísticas
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Suspense fallback={<OrdersLoadingSkeleton />}>
              <OrdersManagement />
            </Suspense>
          </TabsContent>

          <TabsContent value="menu">
            <Suspense fallback={<MenuLoadingSkeleton />}>
              <MenuManagement />
            </Suspense>
          </TabsContent>

          <TabsContent value="stats">
            <Suspense fallback={<StatsLoadingSkeleton />}>
              <BusinessStats />
            </Suspense>
          </TabsContent>

          <TabsContent value="settings">
            <BusinessSettings />
          </TabsContent>
        </Tabs>
      </main>

      {/* Notification Sound Component */}
      <NotificationSound />
    </div>
  )
}

function OrdersLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-3 bg-muted rounded w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function MenuLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <div className="w-full h-32 bg-muted" />
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function StatsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-8 bg-muted rounded w-1/3" />
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
