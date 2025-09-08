import { notFound } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Star, Clock, Truck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MenuSection } from "@/components/menu-section"
import { CartSidebar } from "@/components/cart-sidebar"

// Mock restaurant data
const mockRestaurant = {
  id: "1",
  business_name: "Burger Palace",
  description: "Las mejores hamburguesas de la ciudad con ingredientes frescos y de calidad",
  address: "Av. Principal 123",
  phone: "+1234567890",
  rating: 4.5,
  delivery_time: "25-35 min",
  delivery_fee: 2.5,
  image_url: "/burger-restaurant-interior.png", // Updated to use generated interior image
  is_active: true,
}

const mockMenu = [
  {
    category: "Hamburguesas",
    items: [
      {
        id: "1",
        name: "Burger Clásica",
        description: "Carne de res, lechuga, tomate, cebolla, queso cheddar",
        price: 12.99,
        image_url: "/classic-burger.png", // Updated to use generated image
        is_available: true,
      },
      {
        id: "2",
        name: "Burger BBQ",
        description: "Carne de res, salsa BBQ, cebolla caramelizada, tocino",
        price: 15.99,
        image_url: "/bbq-burger.jpg", // Updated to use generated image
        is_available: true,
      },
      {
        id: "3",
        name: "Burger Vegetariana",
        description: "Hamburguesa de lentejas, aguacate, tomate, lechuga",
        price: 11.99,
        image_url: "/veggie-burger.png", // Updated to use generated image
        is_available: true,
      },
    ],
  },
  {
    category: "Acompañamientos",
    items: [
      {
        id: "4",
        name: "Papas Fritas",
        description: "Papas crujientes con sal marina",
        price: 4.99,
        image_url: "/crispy-french-fries.png", // Updated to use generated image
        is_available: true,
      },
      {
        id: "5",
        name: "Aros de Cebolla",
        description: "Aros de cebolla empanizados y fritos",
        price: 5.99,
        image_url: "/crispy-onion-rings.png", // Updated to use generated image
        is_available: true,
      },
    ],
  },
  {
    category: "Bebidas",
    items: [
      {
        id: "6",
        name: "Coca Cola",
        description: "Refresco de cola 500ml",
        price: 2.99,
        image_url: "/classic-coca-cola.png", // Updated to use generated image
        is_available: true,
      },
      {
        id: "7",
        name: "Agua Natural",
        description: "Agua purificada 500ml",
        price: 1.99,
        image_url: "/reusable-water-bottle.png", // Updated to use generated image
        is_available: true,
      },
    ],
  },
]

export default function RestaurantPage({ params }: { params: { id: string } }) {
  // In a real app, fetch restaurant and menu data
  const restaurant = mockRestaurant
  const menu = mockMenu

  if (!restaurant) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="font-semibold">{restaurant.business_name}</h1>
          </div>
        </div>
      </header>

      {/* Restaurant Info */}
      <div className="relative">
        <Image
          src={restaurant.image_url || "/placeholder.svg"}
          alt={restaurant.business_name}
          width={600}
          height={300}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold">{restaurant.business_name}</h2>
          <p className="text-sm opacity-90">{restaurant.description}</p>
        </div>
      </div>

      {/* Restaurant Details */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{restaurant.rating}</span>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-5 h-5" />
            <span>{restaurant.delivery_time}</span>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <Truck className="w-5 h-5" />
            <span>Envío ${restaurant.delivery_fee.toFixed(2)}</span>
          </div>

          {restaurant.is_active ? (
            <Badge className="bg-delivery-success text-white">Abierto</Badge>
          ) : (
            <Badge variant="destructive">Cerrado</Badge>
          )}
        </div>

        {/* Menu */}
        <div className="space-y-8">
          {menu.map((section) => (
            <MenuSection key={section.category} category={section.category} items={section.items} />
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  )
}
