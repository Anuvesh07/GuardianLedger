'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCurrency } from '@/contexts/CurrencyContext';
import type { Expense } from '@/lib/types';
import { startOfMonth, format, subMonths } from 'date-fns';
import { TrendingUp, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface MonthlyExpenseChartProps {
  expenses: Expense[];
}

export default function MonthlyExpenseChart({ expenses }: MonthlyExpenseChartProps) {
  const { formatAmount } = useCurrency();
  const [selectedMonth, setSelectedMonth] = useState<{
    label: string;
    expenses: Expense[];
  } | null>(null);
  
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
      expenses: monthExpenses,
    };
  });

  const maxAmount = Math.max(...monthlyData.map(m => m.total), 1);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-soft-mint" />
            Monthly Spending (Last 12 Months)
          </CardTitle>
          <p className="text-sm text-muted-foreground">Click on any month to see expenses</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyData.map((month, i) => (
              <div 
                key={i} 
                className="space-y-1 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                onClick={() => month.count > 0 && setSelectedMonth({
                  label: month.fullLabel,
                  expenses: month.expenses
                })}
              >
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

      {/* Month Details Dialog */}
      <Dialog open={!!selectedMonth} onOpenChange={() => setSelectedMonth(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Expenses for {selectedMonth?.label}</span>
              <button
                onClick={() => setSelectedMonth(null)}
                className="rounded-full p-1 hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {selectedMonth?.expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{expense.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                      {expense.category}
                    </span>
                    <span>{formatDate(expense.date)}</span>
                  </div>
                  {expense.notes && (
                    <p className="text-sm text-muted-foreground mt-1">{expense.notes}</p>
                  )}
                </div>
                <span className="text-lg font-semibold ml-4">{formatAmount(expense.amount)}</span>
              </div>
            ))}
            {selectedMonth && selectedMonth.expenses.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No expenses for this month</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
