import { create } from 'zustand';
import { Client } from '@/types';
import { toast } from "@/hooks/use-toast";

interface ClientStore {
  clients: Client[];
  loading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
}

// Mock data for initial development
const mockClients: Client[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, San Francisco, CA",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "(555) 987-6543",
    address: "456 Market St, San Francisco, CA",
    createdAt: new Date().toISOString(),
  },
];

export const useClientStore = create<ClientStore>((set) => ({
  clients: [],
  loading: false,
  error: null,

  fetchClients: async () => {
    try {
      set({ loading: true });
      // Using mock data instead of API call for now
      set({ clients: mockClients, loading: false });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
