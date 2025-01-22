import { create } from 'zustand';
import { Loan, LoanFormData } from '@/types';
import { toast } from "@/hooks/use-toast";

interface LoanStore {
  loans: Loan[];
  loading: boolean;
  error: string | null;
  fetchLoans: () => Promise<void>;
  createLoan: (data: LoanFormData) => Promise<void>;
  updateLoanStatus: (id: number, status: Loan['status']) => Promise<void>;
}

export const useLoanStore = create<LoanStore>((set) => ({
  loans: [],
  loading: false,
  error: null,

  fetchLoans: async () => {
    try {
      set({ loading: true });
      const response = await fetch('/api/loans');
      if (!response.ok) {
        throw new Error('Failed to fetch loans');
      }
      const data = await response.json();
      set({ loans: data, loading: false });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
      set({ error: (error as Error).message, loading: false });
    }
  },

  createLoan: async (data: LoanFormData) => {
    try {
      set({ loading: true });
      const response = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create loan');
      }

      const newLoan = await response.json();
      set((state) => ({
        loans: [...state.loans, newLoan],
        loading: false,
      }));

      toast({
        title: "Success",
        description: "Loan application submitted successfully",
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

  updateLoanStatus: async (id: number, status: Loan['status']) => {
    try {
      set({ loading: true });
      const response = await fetch(`/api/loans/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update loan status');
      }

      const updatedLoan = await response.json();
      set((state) => ({
        loans: state.loans.map((loan) =>
          loan.id === id ? updatedLoan : loan
        ),
        loading: false,
      }));

      toast({
        title: "Success",
        description: `Loan status updated to ${status}`,
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