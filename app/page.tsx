import { Suspense } from "react"
import { RestaurantList } from "@/components/restaurant-list"
import { LocationSelector } from "@/components/location-selector"
import { SearchBar } from "@/components/search-bar"
import { CategoryFilter } from "@/components/category-filter"
import { NotificationBell } from "@/components/notification-bell"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">D</span>
              </div>
              <h1 className="text-xl font-bold">DeliveryApp</h1>
            </div>
            <div className="flex items-center gap-2">
              <LocationSelector />
              <NotificationBell />
              <Link href="/orders">
                <Button variant="ghost" size="sm">
                  Mis Pedidos
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="sm">Iniciar Sesión</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="space-y-4">
            <SearchBar />
            <CategoryFilter />
          </div>

          {/* Restaurant List */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Restaurantes cerca de ti</h2>
            <Suspense fallback={<RestaurantListSkeleton />}>
              <RestaurantList />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}

function RestaurantListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-card rounded-lg border p-4 animate-pulse">
          <div className="w-full h-48 bg-muted rounded-lg mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
            <div className="h-3 bg-muted rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
