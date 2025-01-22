import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClientStore } from "@/stores/clientStore";
import { useEffect, useState } from "react";
import { Client } from "@/types";
import ClientDetails from "./ClientDetails";

export default function ClientList() {
  const { clients, fetchClients } = useClientStore();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleRowClick = (client: Client) => {
    setSelectedClient(client);
    setDetailsOpen(true);
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow 
                key={client.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(client)}
              >
                <TableCell>
                  {client.firstName} {client.lastName}
                </TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{client.address}</TableCell>
                <TableCell>
                  {new Date(client.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ClientDetails 
        client={selectedClient}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
}