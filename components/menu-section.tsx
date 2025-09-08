import { MenuItemCard } from "@/components/menu-item-card"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  is_available: boolean
}

interface MenuSectionProps {
  category: string
  items: MenuItem[]
}

export function MenuSection({ category, items }: MenuSectionProps) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">{category}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
