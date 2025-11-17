import type { Expense, UserStats, Recommendation } from './types';
import { startOfMonth, format, subMonths } from 'date-fns';

export function calculateUserStats(expenses: Expense[]): UserStats {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  // Category breakdown
  const categoryMap = new Map<string, number>();
  expenses.forEach(e => {
    categoryMap.set(e.category, (categoryMap.get(e.category) || 0) + e.amount);
  });
  
  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
  
  const topCategory = categoryBreakdown[0]?.category || 'None';
  
  // Monthly spending (last 6 months)
  const monthlyMap = new Map<string, number>();
  expenses.forEach(e => {
    const monthKey = format(startOfMonth(e.date), 'MMM yyyy');
    monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + e.amount);
  });
  
  const monthlySpending = Array.from(monthlyMap.entries())
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
    .slice(-6);
  
  return {
    totalSpent,
    topCategory,
    monthlySpending,
    categoryBreakdown,
  };
}

export function generateRecommendations(expenses: Expense[]): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  if (expenses.length === 0) {
    return [{
      type: 'info',
      message: 'Start tracking your expenses to get personalized insights!',
    }];
  }
  
  const now = new Date();
  const currentMonth = startOfMonth(now);
  const lastMonth = startOfMonth(subMonths(now, 1));
  
  const currentMonthExpenses = expenses.filter(e => e.date >= currentMonth);
  const lastMonthExpenses = expenses.filter(
    e => e.date >= lastMonth && e.date < currentMonth
  );
  
  const currentTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const lastTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  // Month-over-month comparison
  if (lastTotal > 0) {
    const percentChange = ((currentTotal - lastTotal) / lastTotal) * 100;
    if (percentChange > 20) {
      recommendations.push({
        type: 'warning',
        message: `Your spending increased by ${percentChange.toFixed(1)}% compared to last month. Consider reviewing your budget.`,
      });
    } else if (percentChange < -20) {
      recommendations.push({
        type: 'info',
        message: `Great job! Your spending decreased by ${Math.abs(percentChange).toFixed(1)}% compared to last month.`,
      });
    }
  }
  
  // Category analysis
  const stats = calculateUserStats(expenses);
  if (stats.categoryBreakdown.length > 0) {
    const top = stats.categoryBreakdown[0];
    if (top.percentage > 40) {
      recommendations.push({
        type: 'warning',
        message: `${top.percentage.toFixed(1)}% of your spending is on ${top.category}. Consider diversifying your budget.`,
      });
    }
    
    recommendations.push({
      type: 'info',
      message: `Your top spending category is ${top.category} with $${top.amount.toFixed(2)}.`,
    });
  }
  
  // Frequency tip
  const avgExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length;
  recommendations.push({
    type: 'tip',
    message: `Your average expense is $${avgExpenseAmount.toFixed(2)}. Track smaller purchases to get a complete picture.`,
  });
  
  return recommendations;
}
