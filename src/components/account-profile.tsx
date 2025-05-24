// components/account-profile.tsx
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-toastify";
import { useAuth } from "../../lib/auth-context";
import { updateProfile, updateUser } from "../../lib/api";

export default function AccountProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postal_code: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: "",
        address: "",
        city: "",
        country: "",
        postal_code: "",
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    try {
      await updateUser({ name: formData.name, email: formData.email });
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        postal_code: formData.postal_code,
      });
      toast.success("Profil mis à jour avec succès !");
      setIsEditing(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Erreur lors de la mise à jour du profil");
      }
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src="/placeholder.svg?height=100&width=100" alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm">
            Changer la photo
          </Button>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Informations personnelles</h3>
            <Button variant="ghost" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Annuler" : "Modifier"}
            </Button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code">Code postal</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                />
              </div>

              <Button onClick={handleSubmit}>Enregistrer</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nom</p>
                  <p>{formData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{formData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p>{formData.phone || "Non défini"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Mot de passe</h3>
          <Button
            variant="outline"
            onClick={() => toast.info("Fonctionnalité de changement de mot de passe à implémenter")}
          >
            Changer le mot de passe
          </Button>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Dernière mise à jour : Non disponible</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Préférences</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="emailNotifications" className="rounded border-gray-300" defaultChecked />
            <Label htmlFor="emailNotifications"> Notifications par email </Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="smsNotifications" className="rounded border-gray-300" defaultChecked />
            <Label htmlFor="smsNotifications">Notifications par SMS</Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="marketingEmails" className="rounded border-gray-300" />
            <Label htmlFor="marketingEmails">Emails marketing</Label>
          </div>
        </div>
      </div>
    </div>
  );
}