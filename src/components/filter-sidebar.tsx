"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FilterSidebar() {
  const [priceRange, setPriceRange] = useState([0, 500])

  const brands = [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "jordan", label: "Jordan" },
    { id: "new-balance", label: "New Balance" },
    { id: "puma", label: "Puma" },
    { id: "reebok", label: "Reebok" },
    { id: "converse", label: "Converse" },
    { id: "vans", label: "Vans" },
  ]

  const categories = [
    { id: "running", label: "Running" },
    { id: "basketball", label: "Basketball" },
    { id: "lifestyle", label: "Lifestyle" },
    { id: "skateboarding", label: "Skateboarding" },
    { id: "training", label: "Training & Gym" },
    { id: "tennis", label: "Tennis" },
  ]

  const sizes = [
    { id: "7", label: "US 7" },
    { id: "7.5", label: "US 7.5" },
    { id: "8", label: "US 8" },
    { id: "8.5", label: "US 8.5" },
    { id: "9", label: "US 9" },
    { id: "9.5", label: "US 9.5" },
    { id: "10", label: "US 10" },
    { id: "10.5", label: "US 10.5" },
    { id: "11", label: "US 11" },
    { id: "11.5", label: "US 11.5" },
    { id: "12", label: "US 12" },
  ]

  const colors = [
    { id: "black", label: "Black", color: "bg-black" },
    { id: "white", label: "White", color: "bg-white border" },
    { id: "red", label: "Red", color: "bg-red-500" },
    { id: "blue", label: "Blue", color: "bg-blue-500" },
    { id: "green", label: "Green", color: "bg-green-500" },
    { id: "yellow", label: "Yellow", color: "bg-yellow-500" },
    { id: "gray", label: "Gray", color: "bg-gray-500" },
    { id: "orange", label: "Orange", color: "bg-orange-500" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" className="h-auto p-0 text-primary">
          Reset All
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["price", "brands", "sizes"]}>
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider defaultValue={[0, 500]} max={500} step={10} value={priceRange} onValueChange={setPriceRange} />
              <div className="flex items-center justify-between">
                <p className="text-sm">${priceRange[0]}</p>
                <p className="text-sm">${priceRange[1]}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brands">
          <AccordionTrigger>Brands</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox id={`brand-${brand.id}`} />
                  <Label htmlFor={`brand-${brand.id}`} className="text-sm">
                    {brand.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox id={`category-${category.id}`} />
                  <Label htmlFor={`category-${category.id}`} className="text-sm">
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sizes">
          <AccordionTrigger>Sizes</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <div
                  key={size.id}
                  className="flex items-center justify-center h-10 border rounded-md cursor-pointer hover:bg-muted transition-colors"
                >
                  <span className="text-sm">{size.label}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="colors">
          <AccordionTrigger>Colors</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <div key={color.id} className="flex flex-col items-center gap-1 cursor-pointer">
                  <div className={`w-8 h-8 rounded-full ${color.color}`} />
                  <span className="text-xs">{color.label}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full">Apply Filters</Button>
    </div>
  )
}
