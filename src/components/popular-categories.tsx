// // components/PopularCategories.tsx
// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { Card, CardContent } from "@/components/ui/card";
// import { getCategories } from "../../lib/api";

// interface Category {
//   id: string;
//   name: string;
//   image: string;
//   productCount: number;
// }

// export default function PopularCategories() {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const data = await getCategories();
//         console.log("Données des catégories:", data); // Ajoute pour déboguer
//         setCategories(data);
//         setLoading(false);
//       } catch (error: unknown) {
//         const errorMessage = error instanceof Error ? error.message : "Impossible de charger les catégories";
//         console.error("Erreur dans PopularCategories:", error);
//         setError(errorMessage);
//         setLoading(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   if (loading) return <p>Chargement des catégories...</p>;
//   if (error) return <p>Erreur : {error}</p>;

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//       {categories.map((category) => (
//         <Link key={category.id} href={`/categories/${category.id}`} className="group">
//           <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all">
//             <CardContent className="p-0">
//               <div className="relative aspect-square overflow-hidden bg-muted">
//                 <Image
//                   src={category.image || "/placeholder.svg"}
//                   alt={category.name}
//                   fill
//                   className="object-cover transition-transform group-hover:scale-105"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
//                   <div>
//                     <h3 className="text-lg font-bold text-white">{category.name}</h3>
//                     <p className="text-sm text-white/80">{category.productCount} Produits</p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </Link>
//       ))}
//     </div>
//   );
// }

// components/PopularCategories.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { getCategories } from "../../lib/api";

interface Category {
  id: number; // Changé de string à number pour correspondre à l'API
  name: string;
  description?: string; // Ajouté car l'API retourne description
  image?: string; // Optionnel car absent de l'API
  productCount?: number; // Optionnel car absent de l'API
  created_at?: string;
  updated_at?: string;
}

export default function PopularCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        console.log("Données des catégories:", data); // Pour déboguer
        setCategories(data);
        setLoading(false);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Impossible de charger les catégories";
        console.error("Erreur dans PopularCategories:", error);
        setError(errorMessage);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <p>Chargement des catégories...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/categories/${category.id}`} className="group">
          <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-0">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                  src={category.image && !category.image.startsWith('/') ? category.image : category.image && category.image.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_BASE_IMAGE}${category.image}` : "/placeholder.svg"} // Repli sur placeholder
                  alt={category.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{category.name}</h3>
                    <p className="text-sm text-white/80">
                      {category.productCount ? `${category.productCount} Produits` : "Voir les produits"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}