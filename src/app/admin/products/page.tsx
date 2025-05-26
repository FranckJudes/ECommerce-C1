// // app/admin/products/page.tsx
// "use client";

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { toast } from "@/hooks/use-toast";
// import {
//   getProducts,
//   createProduct,
//   deleteProduct,
//   getCategories,
// } from "../../../../lib/api";
// import { AxiosError } from "axios";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Skeleton } from "@/components/ui/skeleton";

// interface Product {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   stock: number;
//   category_id: number;
//   image: string;
//   featured: boolean;
//   coming_soon: boolean;
//   created_at: string;
//   updated_at: string;
// }

// interface Category {
//   id: number;
//   name: string;
//   description: string;
//   created_at: string;
//   updated_at: string;
// }

// const productSchema = z.object({
//   name: z.string().min(1, "Le nom est requis"),
//   description: z.string().min(1, "La description est requise"),
//   price: z.number().min(0, "Le prix doit être positif"),
//   stock: z.number().int().min(0, "Le stock doit être un entier positif"),
//   category_id: z.number().int().min(1, "La catégorie est requise"),
//   image: z.string().optional(),
//   featured: z.boolean().optional(),
//   coming_soon: z.boolean().optional(),
// });

// type ProductFormData = z.infer<typeof productSchema>;

// export default function AdminProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   const form = useForm<ProductFormData>({
//     resolver: zodResolver(productSchema),
//     defaultValues: {
//       name: "",
//       description: "",
//       price: 0,
//       stock: 0,
//       category_id: 0,
//       image: "",
//       featured: false,
//       coming_soon: false,
//     },
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const [productsData, categoriesData] = await Promise.all([
//           getProducts(),
//           getCategories(),
//         ]);
//         setProducts(productsData.data);
//         setCategories(categoriesData);
//         setLoading(false);
//       } catch (error: unknown) {
//         const errorMessage = error instanceof AxiosError && error.response?.data?.message
//           ? error.response.data.message
//           : "Impossible de charger les données";
//         setError(errorMessage);
//         toast({
//           title: "Erreur",
//           description: errorMessage,
//           variant: "destructive",
//         });
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleCreateProduct = async (data: ProductFormData) => {
//     try {
//       const newProduct = await createProduct(data);
//       setProducts([...products, newProduct]);
//       toast({
//         title: "Succès",
//         description: "Produit créé avec succès.",
//       });
//       form.reset();
//     } catch (error: unknown) {
//       const errorMessage = error instanceof AxiosError && error.response?.data?.message
//         ? error.response.data.message
//         : "Échec de la création du produit";
//       toast({
//         title: "Erreur",
//         description: errorMessage,
//         variant: "destructive",
//       });
//     }
//   };

//   const handleDeleteProduct = async (id: number) => {
//     if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
//     try {
//       await deleteProduct(id);
//       setProducts(products.filter((p) => p.id !== id));
//       toast({
//         title: "Succès",
//         description: "Produit supprimé avec succès.",
//       });
//     } catch (error: unknown) {
//       const errorMessage = error instanceof AxiosError && error.response?.data?.message
//         ? error.response.data.message
//         : "Échec de la suppression du produit";
//       toast({
//         title: "Erreur",
//         description: errorMessage,
//         variant: "destructive",
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container px-4 py-8">
//         <Skeleton className="h-8 w-1/4 mb-6" />
//         <Skeleton className="h-10 w-32 mb-4" />
//         <Table>
//           <TableHeader>
//             <TableRow>
//               {["Nom", "Prix", "Stock", "Catégorie", "Actions"].map((header) => (
//                 <TableHead key={header}>
//                   <Skeleton className="h-6 w-full" />
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {Array(5).fill(0).map((_, index) => (
//               <TableRow key={index}>
//                 {Array(5).fill(0).map((_, i) => (
//                   <TableCell key={i}>
//                     <Skeleton className="h-6 w-full" />
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="container px-4 py-8">Erreur : {error}</div>;
//   }

//   return (
//     <div className="container px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Gestion des produits</h1>
//         <Button asChild variant="outline">
//           <Link href="/admin">Retour au tableau de bord</Link>
//         </Button>
//       </div>
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button className="mb-4">Ajouter un produit</Button>
//         </DialogTrigger>
//         <DialogContent className="max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Ajouter un produit</DialogTitle>
//           </DialogHeader>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(handleCreateProduct)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Nom</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Nom du produit" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Description</FormLabel>
//                     <FormControl>
//                       <Textarea placeholder="Description du produit" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="price"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Prix</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="number"
//                         step="0.01"
//                         placeholder="0.00"
//                         {...field}
//                         onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="stock"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Stock</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="number"
//                         placeholder="0"
//                         {...field}
//                         onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="category_id"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Catégorie</FormLabel>
//                     <Select
//                       onValueChange={(value) => field.onChange(parseInt(value))}
//                       value={field.value ? field.value.toString() : ""}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Sélectionner une catégorie" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {categories.map((category) => (
//                           <SelectItem key={category.id} value={category.id.toString()}>
//                             {category.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="image"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>URL de l&apos;image</FormLabel>
//                     <FormControl>
//                       <Input placeholder="https://exemple.com/image.jpg" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="featured"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                     <FormControl>
//                       <Checkbox
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                       />
//                     </FormControl>
//                     <div className="space-y-1 leading-none">
//                       <FormLabel>Mis en avant</FormLabel>
//                     </div>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="coming_soon"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                     <FormControl>
//                       <Checkbox
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                       />
//                     </FormControl>
//                     <div className="space-y-1 leading-none">
//                       <FormLabel>Bientôt disponible</FormLabel>
//                     </div>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Button type="submit">Créer</Button>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Nom</TableHead>
//             <TableHead>Prix</TableHead>
//             <TableHead>Stock</TableHead>
//             <TableHead>Catégorie</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {products.map((product) => (
//             <TableRow key={product.id}>
//               <TableCell>{product.name}</TableCell>
//               <TableCell>{product.price} €</TableCell>
//               <TableCell>{product.stock}</TableCell>
//               <TableCell>
//                 {categories.find((c) => c.id === product.category_id)?.name || "Inconnue"}
//               </TableCell>
//               <TableCell>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="mr-2"
//                   onClick={() => router.push(`/admin/products/${product.id}`)}
//                 >
//                   Modifier
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   size="sm"
//                   onClick={() => handleDeleteProduct(product.id)}
//                 >
//                   Supprimer
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

export default function AdminProductsPage() {
  return <div>Page temporaire</div>;
}