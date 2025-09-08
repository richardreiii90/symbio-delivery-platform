"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"

const categories = [
  "Todos",
  "Hamburguesas",
  "Pizza",
  "Sushi",
  "Comida Rápida",
  "Italiana",
  "Mexicana",
  "Postres",
  "Bebidas",
]

export function CategoryFilter() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <Badge
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          className="cursor-pointer whitespace-nowrap"
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  )
}
