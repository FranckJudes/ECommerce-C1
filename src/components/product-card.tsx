// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { useCart } from "@/hooks/use-cart"
// import { toast } from "@/hooks/use-toast"

// interface ProductCardProps {
//   id: string
//   name: string
//   price: number
//   image: string
//   brand: string
//   isNew?: boolean
//   isSale?: boolean
//   salePrice?: number
// }

// export default function ProductCard({ id, name, price, image, brand, isNew, isSale, salePrice }: ProductCardProps) {
//   const [isLoading, setIsLoading] = useState(false)
//   const { addItem } = useCart()

//   const handleAddToCart = () => {
//     setIsLoading(true)

//     // Simuler un délai d'ajout au panier
//     setTimeout(() => {
//       addItem({
//         id,
//         name,
//         price: isSale && salePrice ? salePrice : price,
//         image,
//         quantity: 1,
//       })

//       toast({
//         title: "Produit ajouté au panier",
//         description: `${name} a été ajouté à votre panier.`,
//       })

//       setIsLoading(false)
//     }, 500)
//   }

//   return (
//     <Card className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
//       <Link href={`/products/${id}`}>
//         <CardContent className="p-0">
//           <div className="relative aspect-square overflow-hidden bg-muted">
//             <Image
//               src={image || "/placeholder.svg"}
//               alt={name}
//               fill
//               className="object-cover transition-transform group-hover:scale-105"
//             />
//             {isNew && (
//               <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
//                 Nouveau
//               </div>
//             )}
//             {isSale && salePrice && (
//               <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
//                 -{Math.round(((price - salePrice) / price) * 100)}%
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Link>
//       <CardFooter className="flex flex-col items-start p-4">
//         <p className="text-sm text-muted-foreground">{brand}</p>
//         <Link href={`/products/${id}`}>
//           <h3 className="font-medium line-clamp-1 hover:text-primary transition-colors">{name}</h3>
//         </Link>
//         <div className="flex items-center justify-between w-full mt-1">
//           <div className="flex items-center gap-2">
//             {isSale && salePrice ? (
//               <>
//                 <p className="font-bold">{salePrice} €</p>
//                 <p className="text-sm text-muted-foreground line-through">{price} €</p>
//               </>
//             ) : (
//               <p className="font-bold">{price} €</p>
//             )}
//           </div>
//           <Button variant="outline" size="sm" onClick={handleAddToCart} disabled={isLoading}>
//             {isLoading ? "..." : "Ajouter"}
//           </Button>
//         </div>
//       </CardFooter>
//     </Card>
//   )
// }

// components/product-card.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  is_new?: boolean;
  is_upcoming?: boolean;
  salePrice?: number;
}

export default function ProductCard({ id, name, price, image, brand, is_new, is_upcoming, salePrice }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    setIsLoading(true);

    setTimeout(() => {
      addItem({
        id: id.toString(),
        name,
        price: salePrice || price,
        image,
        quantity: 1,
      });

      toast({
        title: "Produit ajouté au panier",
        description: `${name} a été ajouté à votre panier.`,
      });

      setIsLoading(false);
    }, 500);
  };

  return (
    <Card className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
      <Link href={`/products/${id}`}>
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={image || "/placeholder.svg"}
              alt={name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            {is_new && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                Nouveau
              </div>
            )}
            {salePrice && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                -{Math.round(((price - salePrice) / price) * 100)}%
              </div>
            )}
            {is_upcoming && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                À venir
              </div>
            )}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="flex flex-col items-start p-4">
        <p className="text-sm text-muted-foreground">{brand}</p>
        <Link href={`/products/${id}`}>
          <h3 className="font-medium line-clamp-1 hover:text-primary transition-colors">{name}</h3>
        </Link>
        <div className="flex items-center justify-between w-full mt-1">
          <div className="flex items-center gap-2">
            {salePrice ? (
              <>
                <p className="font-bold">{salePrice} €</p>
                <p className="text-sm text-muted-foreground line-through">{price} €</p>
              </>
            ) : (
              <p className="font-bold">{price} €</p>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleAddToCart} disabled={isLoading || is_upcoming}>
            {isLoading ? "..." : is_upcoming ? "Indisponible" : "Ajouter"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
