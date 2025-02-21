import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Client } from "@/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { useClientStore } from "@/stores/clientStore";

const clientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
});

interface ClientDetailsProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientUpdate?: (client: Client) => void;
}

export default function ClientDetails({ client, open, onOpenChange, onClientUpdate }: ClientDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { updateClient } = useClientStore();

  const form = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: client || {},
  });

  // Reset form when client changes
  useEffect(() => {
    if (client) {
      form.reset(client);
    }
  }, [client, form]);

  if (!client) return null;

  const onSubmit = async (data: z.infer<typeof clientSchema>) => {
    try {
      await updateClient(client.id, data);
      setIsEditing(false);
      // Reset form with new values after successful update
      const updatedClient = { ...client, ...data };
      form.reset(updatedClient);
      // Notify parent component about the update
      onClientUpdate?.(updatedClient);
    } catch (error) {
      console.error("Failed to update client:", error);
    }
  };

  const DetailField = ({ label, value, fieldName }: { label: string; value: string; fieldName: keyof Client }) => (
    <div>
      <p className="text-sm font-medium">{label}</p>
      {isEditing ? (
        <Input
          className="mt-1"
          {...form.register(fieldName)}
        />
      ) : (
        <p className="text-sm">{form.getValues(fieldName) || value}</p>
      )}
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <SheetHeader className="flex flex-row items-center justify-between">
            <div>
              <SheetTitle className="text-2xl">Client Details</SheetTitle>
              <SheetDescription>
                View and edit client information
              </SheetDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="First Name" value={client.firstName} fieldName="firstName" />
                <DetailField label="Last Name" value={client.lastName} fieldName="lastName" />
                <DetailField label="Email" value={client.email} fieldName="email" />
                <DetailField label="Phone" value={client.phone} fieldName="phone" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
              {isEditing ? (
                <Input
                  className="mt-1"
                  {...form.register("address")}
                />
              ) : (
                <p className="text-sm">{form.getValues("address") || client.address}</p>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Account Details</h3>
              <div>
                <p className="text-sm font-medium">Created On</p>
                <p className="text-sm">
                  {format(new Date(client.createdAt), "PPP")}
                </p>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    form.reset(client);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}