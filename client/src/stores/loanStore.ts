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

// Initial mock data
const initialLoans: Loan[] = [
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

// Helper function to get loans from localStorage
const getStoredLoans = (): Loan[] => {
  try {
    const storedLoans = localStorage.getItem('loans');
    return storedLoans ? JSON.parse(storedLoans) : initialLoans;
  } catch (error) {
    console.error('Failed to parse loans from localStorage:', error);
    return initialLoans;
  }
};

// Helper function to save loans to localStorage
const saveLoansToStorage = (loans: Loan[]) => {
  try {
    localStorage.setItem('loans', JSON.stringify(loans));
  } catch (error) {
    console.error('Failed to save loans to localStorage:', error);
  }
};

export const useLoanStore = create<LoanStore>((set) => ({
  loans: getStoredLoans(),
  loading: false,
  error: null,

  fetchLoans: async () => {
    try {
      set({ loading: true });
      const loans = getStoredLoans();
      set({ loans, loading: false });
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
      const currentLoans = getStoredLoans();
      const newLoan: Loan = {
        id: Math.max(0, ...currentLoans.map(loan => loan.id)) + 1,
        userId: 1, // Default user ID since we're not using authentication
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedLoans = [...currentLoans, newLoan];
      saveLoansToStorage(updatedLoans);

      set({
        loans: updatedLoans,
        loading: false,
      });

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
      const currentLoans = getStoredLoans();
      const updatedLoans = currentLoans.map((loan) =>
        loan.id === id
          ? {
              ...loan,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : loan
      );

      saveLoansToStorage(updatedLoans);
      set({
        loans: updatedLoans,
        loading: false,
      });

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
      const currentLoans = getStoredLoans();
      const updatedLoans = currentLoans.map((loan) =>
        loan.id === id 
          ? { ...loan, status, updatedAt: new Date().toISOString() } 
          : loan
      );

      saveLoansToStorage(updatedLoans);
      set({
        loans: updatedLoans,
        loading: false,
      });

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