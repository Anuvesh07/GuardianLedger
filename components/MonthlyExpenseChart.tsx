'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrency } from '@/contexts/CurrencyContext';
import type { Expense } from '@/lib/types';
import { startOfMonth, format, subMonths } from 'date-fns';
import { TrendingUp } from 'lucide-react';

interface MonthlyExpenseChartProps {
  expenses: Expense[];
}

export default function MonthlyExpenseChart({ expenses }: MonthlyExpenseChartProps) {
  const { formatAmount } = useCurrency();
  
  // Get last 12 months
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), 11 - i);
    return {
      date,
      label: format(date, 'MMM'),
      fullLabel: format(date, 'MMM yyyy'),
    };
  });

  // Calculate spending per month
  const monthlyData = months.map(month => {
    const monthStart = startOfMonth(month.date);
    const nextMonth = startOfMonth(subMonths(month.date, -1));
    
    const monthExpenses = expenses.filter(e => 
      e.date >= monthStart && e.date < nextMonth
    );
    
    const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    return {
      ...month,
      total,
      count: monthExpenses.length,
    };
  });

  const maxAmount = Math.max(...monthlyData.map(m => m.total), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-soft-mint" />
          Monthly Spending (Last 12 Months)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {monthlyData.map((month, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-ink">{month.fullLabel}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-graphite">{month.count} expenses</span>
                  <span className="font-semibold text-ink">{formatAmount(month.total)}</span>
                </div>
              </div>
              <div className="w-full bg-cloud rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-soft-mint to-sky-blue h-2 rounded-full transition-all"
                  style={{ width: `${(month.total / maxAmount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
