"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AccountProfile() {
  const [isEditing, setIsEditing] = useState(false)

  // In a real app, this would be fetched from an API
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(123) 456-7890",
    avatar: "/placeholder.svg?height=100&width=100",
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm">
            Change Photo
          </Button>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Personal Information</h3>
            <Button variant="ghost" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user.email} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" defaultValue={user.phone} />
              </div>

              <Button>Save Changes</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p>{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>{user.phone}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Password</h3>
          <Button variant="outline">Change Password</Button>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Last updated: 3 months ago</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Preferences</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="emailNotifications" className="rounded border-gray-300" defaultChecked />
            <Label htmlFor="emailNotifications">Email notifications</Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="smsNotifications" className="rounded border-gray-300" defaultChecked />
            <Label htmlFor="smsNotifications">SMS notifications</Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="marketingEmails" className="rounded border-gray-300" />
            <Label htmlFor="marketingEmails">Marketing emails</Label>
          </div>
        </div>
      </div>
    </div>
  )
}
