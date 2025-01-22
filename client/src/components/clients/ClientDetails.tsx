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
import { useState } from "react";
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
}

export default function ClientDetails({ client, open, onOpenChange }: ClientDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { updateClient } = useClientStore();

  const form = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: client || {},
  });

  if (!client) return null;

  const onSubmit = async (data: z.infer<typeof clientSchema>) => {
    try {
      await updateClient(client.id, data);
      setIsEditing(false);
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
          defaultValue={value}
        />
      ) : (
        <p className="text-sm">{value}</p>
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
                  defaultValue={client.address}
                />
              ) : (
                <p className="text-sm">{client.address}</p>
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
                  onClick={() => setIsEditing(false)}
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