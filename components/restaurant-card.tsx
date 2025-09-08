import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Truck } from "lucide-react"

interface Restaurant {
  id: string
  business_name: string
  description: string
  address: string
  phone: string
  rating: number
  delivery_time: string
  delivery_fee: number
  image_url: string
  is_active: boolean
}

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative">
          <Image
            src={restaurant.image_url || "/placeholder.svg"}
            alt={restaurant.business_name}
            width={300}
            height={200}
            className="w-full h-48 object-cover"
          />
          {!restaurant.is_active && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">Cerrado</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-1">{restaurant.business_name}</h3>
            <p className="text-muted-foreground text-sm line-clamp-2">{restaurant.description}</p>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{restaurant.rating}</span>
              </div>

              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{restaurant.delivery_time}</span>
              </div>

              <div className="flex items-center gap-1 text-muted-foreground">
                <Truck className="w-4 h-4" />
                <span>${restaurant.delivery_fee.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
