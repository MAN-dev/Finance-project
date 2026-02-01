export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export interface Account {
  id: string;
  name: string;
  color: string; // Hex code
  initialBalance: number;
  avatar?: string; // Base64 string or URL
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  type: TransactionType;
  description: string;
  category: string;
  date: string; // ISO Date string
  isFavorite?: boolean;
}

export interface DailySummary {
  date: string;
  income: number;
  expense: number;
}

export interface CategorySummary {
  name: string;
  value: number;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface FinancialState {
  accounts: Account[];
  transactions: Transaction[];
}