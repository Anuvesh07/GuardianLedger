'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrency } from '@/contexts/CurrencyContext';
import type { UserStats } from '@/lib/types';
import { TrendingUp, DollarSign, PieChart, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardsProps {
  stats: UserStats;
  loading: boolean;
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  const { formatAmount } = useCurrency();
  
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const currentMonth = stats.monthlySpending[stats.monthlySpending.length - 1];
  const previousMonth = stats.monthlySpending[stats.monthlySpending.length - 2];
  const monthlyChange = previousMonth
    ? ((currentMonth?.amount || 0) - previousMonth.amount) / previousMonth.amount * 100
    : 0;

  const cards = [
    {
      title: 'Total Spent',
      value: formatAmount(stats.totalSpent),
      icon: DollarSign,
      color: 'text-blue-600',
    },
    {
      title: 'This Month',
      value: formatAmount(currentMonth?.amount || 0),
      icon: Calendar,
      color: 'text-green-600',
      change: monthlyChange,
    },
    {
      title: 'Top Category',
      value: stats.topCategory,
      icon: PieChart,
      color: 'text-purple-600',
    },
    {
      title: 'Categories',
      value: stats.categoryBreakdown.length.toString(),
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {card.change !== undefined && (
                <p className={`text-xs ${card.change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {card.change >= 0 ? '+' : ''}{card.change.toFixed(1)}% from last month
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
