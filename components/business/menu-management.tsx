"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import Image from "next/image"

// Mock menu data
const mockMenuItems = [
  {
    id: "1",
    name: "Burger Clásica",
    description: "Carne de res, lechuga, tomate, cebolla, queso cheddar",
    price: 12.99,
    category: "Hamburguesas",
    image_url: "/classic-burger.png",
    is_available: true,
    preparation_time: 15,
  },
  {
    id: "2",
    name: "Burger BBQ",
    description: "Carne de res, salsa BBQ, cebolla caramelizada, tocino",
    price: 15.99,
    category: "Hamburguesas",
    image_url: "/bbq-burger.jpg",
    is_available: true,
    preparation_time: 18,
  },
  {
    id: "3",
    name: "Burger Vegetariana",
    description: "Hamburguesa de lentejas, aguacate, tomate, lechuga",
    price: 11.99,
    category: "Hamburguesas",
    image_url: "/veggie-burger.png",
    is_available: false,
    preparation_time: 12,
  },
  {
    id: "4",
    name: "Papas Fritas",
    description: "Papas crujientes con sal marina",
    price: 4.99,
    category: "Acompañamientos",
    image_url: "/crispy-french-fries.png",
    is_available: true,
    preparation_time: 8,
  },
  {
    id: "5",
    name: "Aros de Cebolla",
    description: "Aros de cebolla empanizados y fritos",
    price: 5.99,
    category: "Acompañamientos",
    image_url: "/crispy-onion-rings.png",
    is_available: true,
    preparation_time: 10,
  },
]

const categories = ["Hamburguesas", "Acompañamientos", "Bebidas", "Postres"]

export function MenuManagement() {
  const [menuItems, setMenuItems] = useState(mockMenuItems)
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  const filteredItems =
    selectedCategory === "Todos" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)

  const handleToggleAvailability = (itemId: string) => {
    setMenuItems((items) =>
      items.map((item) => (item.id === itemId ? { ...item, is_available: !item.is_available } : item)),
    )
  }

  const handleDeleteItem = (itemId: string) => {
    setMenuItems((items) => items.filter((item) => item.id !== itemId))
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión de Menú</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Item</DialogTitle>
            </DialogHeader>
            <MenuItemForm
              onClose={() => setIsAddDialogOpen(false)}
              onSave={(item) => {
                setMenuItems([...menuItems, { ...item, id: Date.now().toString() }])
                setIsAddDialogOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Badge
          variant={selectedCategory === "Todos" ? "default" : "outline"}
          className={`cursor-pointer whitespace-nowrap ${
            selectedCategory === "Todos"
              ? "bg-orange-500 text-white border-orange-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
          onClick={() => setSelectedCategory("Todos")}
        >
          Todos ({menuItems.length})
        </Badge>
        {categories.map((category) => {
          const count = menuItems.filter((item) => item.category === category).length
          return (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category} ({count})
            </Badge>
          )
        })}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className={`overflow-hidden ${!item.is_available ? "opacity-60" : ""}`}>
            <div className="relative">
              <Image
                src={item.image_url || "/placeholder.svg"}
                alt={item.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              {!item.is_available && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive">No Disponible</Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">${item.price.toFixed(2)}</span>
                  <Badge variant="outline">{item.preparation_time} min</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch checked={item.is_available} onCheckedChange={() => handleToggleAvailability(item.id)} />
                    <span className="text-sm">{item.is_available ? "Disponible" : "No disponible"}</span>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Editar Item</DialogTitle>
                        </DialogHeader>
                        <MenuItemForm
                          item={item}
                          onClose={() => setEditingItem(null)}
                          onSave={(updatedItem) => {
                            setMenuItems((items) =>
                              items.map((i) => (i.id === item.id ? { ...updatedItem, id: item.id } : i)),
                            )
                            setEditingItem(null)
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function MenuItemForm({
  item,
  onClose,
  onSave,
}: {
  item?: any
  onClose: () => void
  onSave: (item: any) => void
}) {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price || 0,
    category: item?.category || "Hamburguesas",
    image_url: item?.image_url || "",
    is_available: item?.is_available ?? true,
    preparation_time: item?.preparation_time || 15,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Item</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Precio ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prep_time">Tiempo de Preparación (min)</Label>
          <Input
            id="prep_time"
            type="number"
            value={formData.preparation_time}
            onChange={(e) => setFormData({ ...formData, preparation_time: Number.parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">URL de Imagen</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="/path/to/image.jpg"
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={formData.is_available}
          onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
        />
        <Label>Disponible para pedidos</Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">{item ? "Actualizar" : "Agregar"} Item</Button>
      </div>
    </form>
  )
}
