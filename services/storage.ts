import { Account, Transaction, FinancialState, User } from '../types';
import { DEFAULT_ACCOUNTS } from '../constants';

const STORAGE_KEY = 'credfin_data_v1';
const USER_KEY = 'credfin_user_v1';

const getInitialState = (): FinancialState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored data", e);
    }
  }
  return {
    accounts: DEFAULT_ACCOUNTS,
    transactions: [],
  };
};

export const loadData = (): FinancialState => {
  return getInitialState();
};

export const saveData = (state: FinancialState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const loadUser = (): User | null => {
  const stored = localStorage.getItem(USER_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse user data", e);
    }
  }
  return null;
};

export const saveUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};