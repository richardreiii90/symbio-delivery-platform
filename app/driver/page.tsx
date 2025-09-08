import { Suspense } from "react"
import { AvailabilityToggle } from "@/components/driver/availability-toggle"
import { OrdersList } from "@/components/driver/orders-list"
import { DriverStats } from "@/components/driver/driver-stats"
import { DriverProfile } from "@/components/driver/driver-profile"
import { NotificationBell } from "@/components/notification-bell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, BarChart3, User } from "lucide-react"

export default function DriverDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">D</span>
              </div>
              <h1 className="text-xl font-bold">Driver App</h1>
            </div>
            <NotificationBell />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Availability Toggle */}
          <AvailabilityToggle />

          {/* Main Content Tabs */}
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Pedidos
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Estadísticas
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Perfil
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Suspense fallback={<OrdersLoadingSkeleton />}>
                <OrdersList />
              </Suspense>
            </TabsContent>

            <TabsContent value="stats">
              <Suspense fallback={<StatsLoadingSkeleton />}>
                <DriverStats />
              </Suspense>
            </TabsContent>

            <TabsContent value="profile">
              <Suspense fallback={<ProfileLoadingSkeleton />}>
                <DriverProfile />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

function OrdersLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-card rounded-lg border p-4 animate-pulse">
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-3 bg-muted rounded w-2/3" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

function StatsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-card rounded-lg border p-4 animate-pulse">
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-8 bg-muted rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ProfileLoadingSkeleton() {
  return (
    <div className="bg-card rounded-lg border p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-muted rounded w-1/4" />
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}
