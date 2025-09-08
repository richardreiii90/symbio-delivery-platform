"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  is_available: boolean
}

interface MenuItemCardProps {
  item: MenuItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image_url: item.image_url,
    })
  }

  return (
    <Card className={`overflow-hidden ${!item.is_available ? "opacity-50" : ""}`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="font-semibold">{item.name}</h4>
                {!item.is_available && (
                  <Badge variant="destructive" className="text-xs">
                    No disponible
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={!item.is_available}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Agregar
                </Button>
              </div>
            </div>
          </div>
          <div className="w-20 h-20 flex-shrink-0">
            <Image
              src={item.image_url || "/placeholder.svg"}
              alt={item.name}
              width={80}
              height={80}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
