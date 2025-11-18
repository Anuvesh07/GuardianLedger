'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HyperText } from '@/components/ui/hyper-text';
import { useCurrency } from '@/contexts/CurrencyContext';
import type { Expense } from '@/lib/types';
import { startOfYear, endOfYear } from 'date-fns';
import { Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface YearlyOverviewProps {
  expenses: Expense[];
}

export default function YearlyOverview({ expenses }: YearlyOverviewProps) {
  const { formatAmount } = useCurrency();
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  const currentYearStart = startOfYear(new Date(currentYear, 0, 1));
  const currentYearEnd = endOfYear(new Date(currentYear, 11, 31));
  const lastYearStart = startOfYear(new Date(lastYear, 0, 1));
  const lastYearEnd = endOfYear(new Date(lastYear, 11, 31));

  const currentYearExpenses = expenses.filter(
    e => e.date >= currentYearStart && e.date <= currentYearEnd
  );
  const lastYearExpenses = expenses.filter(
    e => e.date >= lastYearStart && e.date <= lastYearEnd
  );

  const currentYearTotal = currentYearExpenses.reduce((sum, e) => sum + e.amount, 0);
  const lastYearTotal = lastYearExpenses.reduce((sum, e) => sum + e.amount, 0);
  const yearOverYearChange = lastYearTotal > 0 
    ? ((currentYearTotal - lastYearTotal) / lastYearTotal) * 100 
    : 0;

  const currentYearAvg = currentYearExpenses.length > 0 
    ? currentYearTotal / currentYearExpenses.length 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-lavender" />
          Yearly Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Year */}
          <div className="p-4 bg-soft-mint-light rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-soft-mint-dark">{currentYear}</span>
              <DollarSign className="h-4 w-4 text-soft-mint-dark" />
            </div>
            <p className="text-2xl font-bold text-soft-mint-dark mb-1">
              {formatAmount(currentYearTotal)}
            </p>
            <p className="text-xs text-soft-mint-dark/80">
              {currentYearExpenses.length} transactions
            </p>
          </div>

          {/* Last Year */}
          <div className="p-4 bg-cloud rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-graphite">{lastYear}</span>
              <DollarSign className="h-4 w-4 text-graphite" />
            </div>
            <p className="text-2xl font-bold text-ink mb-1">
              {formatAmount(lastYearTotal)}
            </p>
            <p className="text-xs text-graphite">
              {lastYearExpenses.length} transactions
            </p>
          </div>

          {/* Year-over-Year Change */}
          <div className="p-4 bg-lavender-light rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-lavender-dark">YoY Change</span>
              {yearOverYearChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-warm-coral-dark" />
              ) : (
                <TrendingDown className="h-4 w-4 text-soft-mint-dark" />
              )}
            </div>
            <p className={`text-2xl font-bold mb-1 ${
              yearOverYearChange >= 0 ? 'text-warm-coral-dark' : 'text-soft-mint-dark'
            }`}>
              {yearOverYearChange >= 0 ? '+' : ''}{yearOverYearChange.toFixed(1)}%
            </p>
            <p className="text-xs text-lavender-dark/80">
              vs last year
            </p>
          </div>

          {/* Average Transaction */}
          <div className="p-4 bg-sky-blue-light rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-sky-blue-dark">Avg Transaction</span>
              <DollarSign className="h-4 w-4 text-sky-blue-dark" />
            </div>
            <p className="text-2xl font-bold text-sky-blue-dark mb-1">
              {formatAmount(currentYearAvg)}
            </p>
            <p className="text-xs text-sky-blue-dark/80">
              {currentYear} average
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
