"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Définition du type CartItem
export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  size?: string
  color?: string
  quantity: number
}

// Interface du contexte avec EXACTEMENT les mêmes noms que dans cart/page.tsx
export interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void // Utilisé dans cart/page.tsx
  updateQuantity: (id: string, quantity: number) => void // Utilisé dans cart/page.tsx
  clearCart: () => void // Utilisé dans cart/page.tsx
  itemCount: number
  totalPrice: number // Utilisé dans cart/page.tsx
}

// Création du contexte avec le type correct
const CartContext = createContext<CartContextType | undefined>(undefined)

// Provider du panier
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
    }
  }, [])

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items))
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error)
    }
  }, [items])

  // Ajouter un article au panier
  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      // Vérifier si l'article existe déjà dans le panier
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color,
      )

      if (existingItemIndex >= 0) {
        // Mettre à jour la quantité si l'article existe déjà
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += newItem.quantity
        return updatedItems
      } else {
        // Ajouter le nouvel article
        return [...prevItems, newItem]
      }
    })
  }

  // Supprimer un article du panier
  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  // Mettre à jour la quantité d'un article
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  // Vider le panier
  const clearCart = () => {
    setItems([])
  }

  // Calculer le nombre total d'articles
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  // Calculer le prix total
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0)

  // Valeur du contexte
  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    totalPrice,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Hook pour utiliser le panier
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
