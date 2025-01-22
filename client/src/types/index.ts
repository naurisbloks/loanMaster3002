export interface User {
  id: number;
  username: string;
  role: string;
}

export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

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
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: number;
  loanId: number;
  amount: number;
  type: 'payment' | 'disbursement';
  date: string;
  notes?: string;
}

export interface LoanFormData {
  type: 'pawn' | 'consumer' | 'retail';
  amount: number;
  term: number;
  interestRate: number;
  purpose?: string;
  collateral?: string;
}