import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Client } from "@/types";
import { format } from "date-fns";

interface ClientDetailsProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ClientDetails({ client, open, onOpenChange }: ClientDetailsProps) {
  if (!client) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="text-2xl">Client Details</SheetTitle>
          <SheetDescription>
            View detailed information about the client
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">First Name</p>
                <p className="text-sm">{client.firstName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Name</p>
                <p className="text-sm">{client.lastName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm">{client.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm">{client.phone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
            <p className="text-sm">{client.address}</p>
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
