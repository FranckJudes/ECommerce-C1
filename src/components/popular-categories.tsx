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
import { getCategories, getCategoryProducts, Category, Product } from "../../lib/api";

interface CategoryWithImage extends Category {
  productImage?: string;
  productCount?: number;
}

export default function PopularCategories() {
  const [categories, setCategories] = useState<CategoryWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoriesWithImages = async () => {
      try {
        const categoriesData = await getCategories();

        // Pour chaque catégorie → récupérer un produit
        const categoriesWithProducts = await Promise.all(
          categoriesData.map(async (category: Category) => {
            try {
              const res = await getCategoryProducts(category.id, { per_page: 1 });
              const firstProduct: Product | undefined = res.data[0];

              return {
                ...category,
                productImage: firstProduct ? firstProduct.image : undefined,
                productCount: res.data.length, // total visible, à améliorer si backend renvoie `total`
              };
            } catch (err) {
              console.error(`Erreur chargement produits de la catégorie ${category.name}`, err);
              return { ...category };
            }
          })
        );

        setCategories(categoriesWithProducts);
        setLoading(false);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Impossible de charger les catégories";
        console.error("Erreur dans PopularCategories:", error);
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchCategoriesWithImages();
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
                  src={
                    category.productImage
                      ? `${process.env.NEXT_PUBLIC_API_BASE_IMAGE}${category.productImage}`
                      : "/placeholder.svg"
                  }
                  alt={category.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{category.name}</h3>
                    <p className="text-sm text-white/80">
                      {category.productCount
                        ? `${category.productCount} Produits`
                        : "Voir les produits"}
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
