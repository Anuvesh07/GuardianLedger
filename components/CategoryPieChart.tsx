'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrency } from '@/contexts/CurrencyContext';
import type { Expense } from '@/lib/types';
import { PieChart } from 'lucide-react';

interface CategoryPieChartProps {
  expenses: Expense[];
}

const CATEGORY_COLORS = [
  'bg-soft-mint',
  'bg-sky-blue',
  'bg-lavender',
  'bg-warm-coral',
  'bg-lemon',
  'bg-soft-mint-light',
  'bg-sky-blue-light',
  'bg-lavender-light',
  'bg-warm-coral-light',
  'bg-lemon-light',
];

export default function CategoryPieChart({ expenses }: CategoryPieChartProps) {
  const { formatAmount } = useCurrency();
  
  // Calculate category totals
  const categoryMap = new Map<string, number>();
  expenses.forEach(e => {
    categoryMap.set(e.category, (categoryMap.get(e.category) || 0) + e.amount);
  });

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryData = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10); // Top 10 categories

  if (categoryData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-lavender" />
            Spending by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-graphite">
            <p>No expenses yet</p>
            <p className="text-sm mt-2">Add expenses to see category breakdown</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-lavender" />
          Spending by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {categoryData.map((item, i) => (
            <div key={item.category} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]}`} />
                  <span className="font-medium text-ink">{item.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-graphite">{item.percentage.toFixed(1)}%</span>
                  <span className="font-semibold text-ink">{formatAmount(item.amount)}</span>
                </div>
              </div>
              <div className="w-full bg-cloud rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-stone/60 dark:border-stone/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-graphite">Total</span>
            <span className="text-lg font-bold text-ink">{formatAmount(totalAmount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
