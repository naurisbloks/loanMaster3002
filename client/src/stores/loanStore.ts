import { create } from 'zustand';
import { Loan, LoanFormData } from '@/types';
import { toast } from "@/hooks/use-toast";

interface LoanStore {
  loans: Loan[];
  loading: boolean;
  error: string | null;
  fetchLoans: () => Promise<void>;
  createLoan: (data: LoanFormData) => Promise<void>;
  updateLoan: (id: number, data: Partial<Loan>) => Promise<void>;
  updateLoanStatus: (id: number, status: Loan['status']) => Promise<void>;
}

const mockLoans: Loan[] = [
  {
    id: 1,
    userId: 1,
    type: 'pawn',
    amount: 5000,
    status: 'pending',
    interestRate: 5,
    term: 12,
    purpose: 'Business expansion',
    collateral: 'Jewelry',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    userId: 1,
    type: 'consumer',
    amount: 10000,
    status: 'approved',
    interestRate: 7.5,
    term: 24,
    purpose: 'Home renovation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    userId: 2,
    type: 'retail',
    amount: 2000,
    status: 'active',
    interestRate: 4.5,
    term: 6,
    purpose: 'Electronics purchase',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useLoanStore = create<LoanStore>((set) => ({
  loans: [],
  loading: false,
  error: null,

  fetchLoans: async () => {
    try {
      set({ loading: true });
      // Using mock data instead of API call
      set({ loans: mockLoans, loading: false });
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
      // Create a new mock loan
      const newLoan: Loan = {
        id: mockLoans.length + 1,
        userId: 1,
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

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

  updateLoan: async (id: number, data: Partial<Loan>) => {
    try {
      set({ loading: true });
      // Update loan in mock data
      set((state) => ({
        loans: state.loans.map((loan) =>
          loan.id === id
            ? {
                ...loan,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : loan
        ),
        loading: false,
      }));

      toast({
        title: "Success",
        description: "Loan details updated successfully",
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
      // Update mock loan status
      set((state) => ({
        loans: state.loans.map((loan) =>
          loan.id === id 
            ? { ...loan, status, updatedAt: new Date().toISOString() } 
            : loan
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