import { z } from "zod";

export interface Loan {
  id: number;
  userId: number;
  type: 'pawn' | 'consumer' | 'retail';
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'closed';
  interestRate: number;
  term: number;
  purpose?: string;
  collateral?: string;
  itemDetails?: string; // Added for pawn loans
  createdAt: string;
  updatedAt: string;
}

export interface LoanFormData {
  type: 'pawn' | 'consumer' | 'retail';
  amount?: number;
  term?: number;
  interestRate?: number;
  purpose?: string;
  collateral?: string;
  itemDetails?: string; // Added for pawn loans
}
