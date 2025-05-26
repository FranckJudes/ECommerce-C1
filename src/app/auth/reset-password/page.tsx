// "use client";
// import type React from "react";
// import { useState } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "react-toastify";
// import { useAuth } from "../../../../lib/auth-context";

// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const { forgotPassword } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       await forgotPassword(email);
//       toast.success("Lien de réinitialisation envoyé à votre email !");
//       setIsSubmitted(true);
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         toast.error(error.message || "Erreur lors de l'envoi du lien");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container max-w-md px-4 py-16">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold">Mot de passe oublié</h1>
//         <p className="text-muted-foreground mt-2">
//           Entrez votre email pour recevoir un lien de réinitialisation
//         </p>
//       </div>

//       {isSubmitted ? (
//         <div className="text-center">
//           <p className="text-green-600 mb-4">
//             Un lien de réinitialisation a été envoyé à {email}. Vérifiez votre boîte de réception ou vos spams.
//           </p>
//           <Button asChild>
//             <Link href="/auth/sign-in">Retour à la connexion</Link>
//           </Button>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="john.doe@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <Button type="submit" className="w-full" disabled={isLoading}>
//             {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
//           </Button>
//         </form>
//       )}

//       <p className="text-center text-sm mt-8">
//         Retourner à la{" "}
//         <Link href="/auth/sign-in" className="text-primary hover:underline">
//           connexion
//         </Link>
//       </p>
//     </div>
//   );
// }

export default function ForgotPasswordPage() {
  return <div>Page temporaire</div>;
}