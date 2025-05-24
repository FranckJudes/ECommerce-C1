"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { useAuth } from "../../../../lib/auth-context";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { resetPassword } = useAuth();

  useEffect(() => {
    if (!token) {
      toast.error("Token de réinitialisation manquant. Veuillez demander un nouveau lien.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsLoading(true);

    try {
      await resetPassword(token, email, password, passwordConfirmation);
      toast.success("Mot de passe réinitialisé avec succès !");
      setIsSubmitted(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Erreur lors de la réinitialisation");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="container max-w-md px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Lien invalide</h1>
        <p className="text-muted-foreground mt-2">
          Le lien de réinitialisation est invalide ou a expiré.
        </p>
        <Button asChild className="mt-4">
          <Link href="/auth/forgot-password">Demander un nouveau lien</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-md px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Réinitialiser le mot de passe</h1>
        <p className="text-muted-foreground mt-2">
          Entrez votre email et votre nouveau mot de passe
        </p>
      </div>

      {isSubmitted ? (
        <div className="text-center">
          <p className="text-green-600 mb-4">
            Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter.
          </p>
          <Button asChild>
            <Link href="/auth/sign-in">Se connecter</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Le mot de passe doit contenir au moins 8 caractères, un chiffre et un caractère spécial.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="passwordConfirmation">Confirmer le mot de passe</Label>
            <Input
              id="passwordConfirmation"
              type="password"
              placeholder="••••••••"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Réinitialisation en cours..." : "Réinitialiser"}
          </Button>
        </form>
      )}

      <p className="text-center text-sm mt-8">
        Retourner à la{" "}
        <Link href="/auth/sign-in" className="text-primary hover:underline">
          connexion
        </Link>
      </p>
    </div>
  );
}