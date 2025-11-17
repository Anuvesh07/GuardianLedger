export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
}

export interface Expense {
  id: string;
  userId: string;
  title: string;
  amount: number;
  category: string;
  date: Date;
  notes?: string;
  createdAt: Date;
}

export const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Personal',
  'Other',
] as const;

export type Category = typeof CATEGORIES[number];

export interface ExpenseFilters {
  category?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export interface UserStats {
  totalSpent: number;
  topCategory: string;
  monthlySpending: { month: string; amount: number }[];
  categoryBreakdown: { category: string; amount: number; percentage: number }[];
}

export interface Recommendation {
  type: 'warning' | 'info' | 'tip';
  message: string;
}
