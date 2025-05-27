"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getAddressBook, updateAddressBook, addAddressBook, removeAddressBook, setDefaultAddressBook } from "../../lib/api"
import { toast } from "@/hooks/use-toast"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const addressFormSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  street: z.string().min(1, "L'adresse est requise"),
  street2: z.string().optional(),
  city: z.string().min(1, "La ville est requise"),
  state: z.string().optional(),
  zip: z.string().min(1, "Le code postal est requis"),
  country: z.string().min(1, "Le pays est requis"),
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
  isDefault: z.boolean().optional()
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

export default function AddressBook() {
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingAddress, setEditingAddress] = useState<any | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      street: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      phone: "",
      isDefault: false
    }
  });

  const editForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      street: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      phone: "",
      isDefault: false
    }
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const response = await getAddressBook();
        setAddresses(response.data || []);
        setLoading(false);
      } catch (error: unknown) {
        const errorMessage = error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Impossible de charger les adresses";
        setError(errorMessage);
        setLoading(false);
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };
    fetchAddresses();
  }, []);

  const handleAddAddress = async (data: AddressFormValues) => {
    try {
      const response = await addAddressBook({
        address_line1: data.street,
        address_line2: data.street2,
        city: data.city,
        state: data.state,
        postal_code: data.zip,
        country: data.country,
        is_default: data.isDefault || false
      });
      
      const newAddress = {
        id: response.data.id,
        name: `${data.firstName} ${data.lastName}`,
        street: data.street + (data.street2 ? `, ${data.street2}` : ""),
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country,
        phone: data.phone,
        isDefault: data.isDefault || false
      };
      
      // Si c'est l'adresse par défaut, mettre à jour les autres adresses
      if (data.isDefault) {
        setAddresses(addresses.map(addr => ({
          ...addr,
          isDefault: false
        })));
      }
      
      setAddresses([...addresses, newAddress]);
      setShowAddAddress(false);
      form.reset();
      
      toast({
        title: "Succès",
        description: "Adresse ajoutée avec succès",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : "Impossible d'ajouter l'adresse";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    
    // Extraire le prénom et le nom
    const nameParts = address.name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    
    // Extraire la rue principale et l'appartement
    const streetParts = address.street.split(", ");
    const street = streetParts[0] || "";
    const street2 = streetParts.slice(1).join(", ") || "";
    
    editForm.reset({
      firstName,
      lastName,
      street,
      street2,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault
    });
    
    setShowEditDialog(true);
  };

  const handleUpdateAddress = async (data: AddressFormValues) => {
    if (!editingAddress) return;
    
    try {
      const response = await updateAddressBook({
        address_line1: data.street,
        address_line2: data.street2,
        city: data.city,
        state: data.state,
        postal_code: data.zip,
        country: data.country,
        is_default: data.isDefault || false
      });
      
      const updatedAddress = {
        ...editingAddress,
        name: `${data.firstName} ${data.lastName}`,
        street: data.street + (data.street2 ? `, ${data.street2}` : ""),
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country,
        phone: data.phone,
        isDefault: data.isDefault || false
      };
      
      setAddresses(addresses.map(addr => addr.id === editingAddress.id ? updatedAddress : addr));
      setShowEditDialog(false);
      setEditingAddress(null);
      
      toast({
        title: "Succès",
        description: "Adresse mise à jour avec succès",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : "Impossible de mettre à jour l'adresse";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      // Appeler l'API pour définir l'adresse par défaut
      await setDefaultAddressBook(id);
      
      // Mettre à jour l'état local
      setAddresses(addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      })));
      
      toast({
        title: "Succès",
        description: "Adresse définie par défaut",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : "Impossible de définir l'adresse par défaut";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleRemoveAddress = async (id: string) => {
    try {
      // Appeler l'API pour supprimer l'adresse
      await removeAddressBook(id);
      
      // Mettre à jour l'état local
      setAddresses(addresses.filter(addr => addr.id !== id));
      
      toast({
        title: "Succès",
        description: "Adresse supprimée",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError && error.response?.data?.message
        ? error.response.data.message
        : "Impossible de supprimer l'adresse";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center py-12">Erreur : {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Carnet d'adresses</h3>
        <Dialog open={showAddAddress} onOpenChange={setShowAddAddress}>
          <DialogTrigger asChild>
            <Button>Ajouter une adresse</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une adresse</DialogTitle>
              <DialogDescription>Ajoutez une nouvelle adresse de livraison ou de facturation à votre compte.</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleAddAddress)} className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John" 
                    {...form.register("firstName")} 
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    {...form.register("lastName")} 
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">Adresse</Label>
                <Input 
                  id="street" 
                  placeholder="123 Main St" 
                  {...form.register("street")} 
                />
                {form.formState.errors.street && (
                  <p className="text-sm text-destructive">{form.formState.errors.street.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="street2">Appartement, suite, etc. (optionnel)</Label>
                <Input 
                  id="street2" 
                  placeholder="Apt 4B" 
                  {...form.register("street2")} 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input 
                    id="city" 
                    placeholder="Paris" 
                    {...form.register("city")} 
                  />
                  {form.formState.errors.city && (
                    <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">État/Région</Label>
                  <Input 
                    id="state" 
                    placeholder="Île-de-France" 
                    {...form.register("state")} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip">Code postal</Label>
                  <Input 
                    id="zip" 
                    placeholder="75001" 
                    {...form.register("zip")} 
                  />
                  {form.formState.errors.zip && (
                    <p className="text-sm text-destructive">{form.formState.errors.zip.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <Input 
                    id="country" 
                    placeholder="France" 
                    {...form.register("country")} 
                  />
                  {form.formState.errors.country && (
                    <p className="text-sm text-destructive">{form.formState.errors.country.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone" 
                  placeholder="06 12 34 56 78" 
                  {...form.register("phone")} 
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="isDefault" 
                  className="rounded border-gray-300" 
                  {...form.register("isDefault")} 
                />
                <Label htmlFor="isDefault">Définir comme adresse par défaut</Label>
              </div>
            
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setShowAddAddress(false)}>
                  Annuler
                </Button>
                <Button type="submit">Ajouter l'adresse</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length > 0 ? (
        <div className="space-y-4">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{address.name}</CardTitle>
                  {address.isDefault && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Par défaut</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.state} {address.zip}
                </p>
                <p>{address.country}</p>
                <p className="mt-1">{address.phone}</p>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditAddress(address)}
                  >
                    Modifier
                  </Button>
                  {!address.isDefault && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSetDefaultAddress(address.id)}
                    >
                      Définir par défaut
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive"
                    onClick={() => handleRemoveAddress(address.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 mb-6 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Aucune adresse</h2>
          <p className="text-muted-foreground mb-6">Vous n'avez pas encore ajouté d'adresse.</p>
          <Button onClick={() => setShowAddAddress(true)}>Ajouter une adresse</Button>
        </div>
      )}
      
      {/* Dialog d'édition d'adresse */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'adresse</DialogTitle>
            <DialogDescription>Modifiez les informations de votre adresse.</DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleUpdateAddress)} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName">Prénom</Label>
                <Input 
                  id="edit-firstName" 
                  placeholder="John" 
                  {...editForm.register("firstName")} 
                />
                {editForm.formState.errors.firstName && (
                  <p className="text-sm text-destructive">{editForm.formState.errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastName">Nom</Label>
                <Input 
                  id="edit-lastName" 
                  placeholder="Doe" 
                  {...editForm.register("lastName")} 
                />
                {editForm.formState.errors.lastName && (
                  <p className="text-sm text-destructive">{editForm.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-street">Adresse</Label>
              <Input 
                id="edit-street" 
                placeholder="123 Main St" 
                {...editForm.register("street")} 
              />
              {editForm.formState.errors.street && (
                <p className="text-sm text-destructive">{editForm.formState.errors.street.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-street2">Appartement, suite, etc. (optionnel)</Label>
              <Input 
                id="edit-street2" 
                placeholder="Apt 4B" 
                {...editForm.register("street2")} 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-city">Ville</Label>
                <Input 
                  id="edit-city" 
                  placeholder="Paris" 
                  {...editForm.register("city")} 
                />
                {editForm.formState.errors.city && (
                  <p className="text-sm text-destructive">{editForm.formState.errors.city.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-state">État/Région</Label>
                <Input 
                  id="edit-state" 
                  placeholder="Île-de-France" 
                  {...editForm.register("state")} 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-zip">Code postal</Label>
                <Input 
                  id="edit-zip" 
                  placeholder="75001" 
                  {...editForm.register("zip")} 
                />
                {editForm.formState.errors.zip && (
                  <p className="text-sm text-destructive">{editForm.formState.errors.zip.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-country">Pays</Label>
                <Input 
                  id="edit-country" 
                  placeholder="France" 
                  {...editForm.register("country")} 
                />
                {editForm.formState.errors.country && (
                  <p className="text-sm text-destructive">{editForm.formState.errors.country.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Téléphone</Label>
              <Input 
                id="edit-phone" 
                placeholder="06 12 34 56 78" 
                {...editForm.register("phone")} 
              />
              {editForm.formState.errors.phone && (
                <p className="text-sm text-destructive">{editForm.formState.errors.phone.message}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="edit-isDefault" 
                className="rounded border-gray-300" 
                {...editForm.register("isDefault")} 
              />
              <Label htmlFor="edit-isDefault">Définir comme adresse par défaut</Label>
            </div>
          
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                Annuler
              </Button>
              <Button type="submit">Mettre à jour</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
