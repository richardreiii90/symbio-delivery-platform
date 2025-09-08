import { NavigationMap } from "@/components/driver/navigation-map"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock data - en producción vendría de la base de datos
const mockOrderData = {
  "ORD-001": {
    pickupLocation: { latitude: -34.6037, longitude: -58.3816 },
    deliveryLocation: { latitude: -34.6118, longitude: -58.396 },
    pickupAddress: "Burger Palace - Av. Principal 123",
    deliveryAddress: "Av. Libertador 456, Apt 3B",
  },
  "ORD-002": {
    pickupLocation: { latitude: -34.6158, longitude: -58.3734 },
    deliveryLocation: { latitude: -34.5989, longitude: -58.3754 },
    pickupAddress: "Pizza Express - Calle Roma 456",
    deliveryAddress: "Calle Principal 123",
  },
}

export default function NavigationPage({ params }: { params: { orderId: string } }) {
  const orderData = mockOrderData[params.orderId as keyof typeof mockOrderData]

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Pedido no encontrado</h1>
          <p className="text-muted-foreground mb-4">El pedido #{params.orderId} no existe</p>
          <Link href="/driver">
            <Button>Volver al dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/driver">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Navegación</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <NavigationMap
          orderId={params.orderId}
          pickupLocation={orderData.pickupLocation}
          deliveryLocation={orderData.deliveryLocation}
          pickupAddress={orderData.pickupAddress}
          deliveryAddress={orderData.deliveryAddress}
        />
      </main>
    </div>
  )
}
