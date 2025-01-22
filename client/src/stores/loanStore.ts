import { create } from 'zustand';
import { Loan, LoanFormData } from '@/types';

// Simulated API endpoint - replace with actual API URL
const API_BASE_URL = 'https://api.example.com';

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
      // Simulate API call with mock data
      const mockData: Loan[] = [
        {
          id: 1,
          userId: 1,
          type: 'pawn',
          amount: 5000,
          status: 'pending',
          interestRate: 5,
          term: 12,
          purpose: 'Business expansion',
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
      ];

      // In production, replace with actual API call:
      // const response = await fetch(`${API_BASE_URL}/loans`);
      // const data = await response.json();

      set({ loans: mockData, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createLoan: async (data: LoanFormData) => {
    try {
      set({ loading: true });
      // Simulate API call with mock response
      const mockResponse: Loan = {
        id: Math.floor(Math.random() * 1000),
        userId: 1,
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // In production, replace with actual API call:
      // const response = await fetch(`${API_BASE_URL}/loans`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // const newLoan = await response.json();

      set((state) => ({
        loans: [...state.loans, mockResponse],
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateLoanStatus: async (id: number, status: Loan['status']) => {
    try {
      set({ loading: true });
      // Simulate API call
      // In production, replace with actual API call:
      // const response = await fetch(`${API_BASE_URL}/loans/${id}/status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status }),
      // });
      // const updatedLoan = await response.json();

      set((state) => ({
        loans: state.loans.map((loan) =>
          loan.id === id ? { ...loan, status, updatedAt: new Date().toISOString() } : loan
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));