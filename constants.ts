import { Account } from './types';

export const APP_NAME = "CREDFIN";

export const DEFAULT_ACCOUNTS: Account[] = [
  { id: 'acc_1', name: 'Personal', color: '#8b5cf6', initialBalance: 50000 },
  { id: 'acc_2', name: "Dad's Account", color: '#14b8a6', initialBalance: 150000 },
  { id: 'acc_3', name: "Mom's Account", color: '#f43f5e', initialBalance: 80000 },
];

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Bills & Utilities',
  'Entertainment',
  'Health',
  'Other',
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Other',
];

export const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': '#f59e0b',
  'Shopping': '#ec4899',
  'Transportation': '#3b82f6',
  'Bills & Utilities': '#ef4444',
  'Entertainment': '#8b5cf6',
  'Health': '#10b981',
  'Other': '#6b7280',
  'Salary': '#10b981',
  'Freelance': '#3b82f6',
  'Investment': '#8b5cf6',
  'Gift': '#ec4899',
};

export const INDIAN_LOCALE = 'en-IN';
export const CURRENCY = 'INR';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat(INDIAN_LOCALE, {
    style: 'currency',
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(amount);
};