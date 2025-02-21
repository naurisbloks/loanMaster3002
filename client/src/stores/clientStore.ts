import { create } from 'zustand';
import { Client } from '@/types';
import { toast } from "@/hooks/use-toast";

interface ClientStore {
  clients: Client[];
  loading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  updateClient: (id: number, data: Partial<Client>) => Promise<void>;
  createClient: (data: Omit<Client, 'id' | 'createdAt'>) => Promise<Client>;
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

export const useClientStore = create<ClientStore>((set, get) => ({
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

  createClient: async (data) => {
    try {
      set({ loading: true });
      // Create a new mock client
      const newClient: Client = {
        id: mockClients.length + 1,
        ...data,
        createdAt: new Date().toISOString(),
      };

      set((state) => ({
        clients: [...state.clients, newClient],
        loading: false,
      }));

      toast({
        title: "Success",
        description: "Client created successfully",
      });

      return newClient;
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateClient: async (id: number, data: Partial<Client>) => {
    try {
      set({ loading: true });
      // Update client in mock data
      set((state) => ({
        clients: state.clients.map((client) =>
          client.id === id ? { ...client, ...data } : client
        ),
        loading: false,
      }));

      toast({
        title: "Success",
        description: "Client information updated successfully",
      });
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