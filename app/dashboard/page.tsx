'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserExpenses } from '@/lib/firestore';
import { calculateUserStats, generateRecommendations } from '@/lib/analytics';
import type { Expense } from '@/lib/types';
import Navbar from '@/components/Navbar';
import ExpenseList from '@/components/ExpenseList';
import StatsCards from '@/components/StatsCards';
import RecommendationsPanel from '@/components/RecommendationsPanel';
import AddExpenseDialog from '@/components/AddExpenseDialog';
import MonthlyExpenseChart from '@/components/MonthlyExpenseChart';
import YearlyOverview from '@/components/YearlyOverview';
import CategoryPieChart from '@/components/CategoryPieChart';
import ShareProfileButton from '@/components/ShareProfileButton';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadExpenses();
    }
  }, [user]);

  const loadExpenses = async () => {
    if (!user) return;
    
    setLoadingExpenses(true);
    try {
      console.log('Loading expenses for user:', user.id);
      const data = await getUserExpenses(user.id);
      console.log('Loaded expenses:', data.length, 'expenses');
      setExpenses(data);
    } catch (error) {
      console.error('Failed to load expenses:', error);
      console.error('Error details:', error);
    } finally {
      setLoadingExpenses(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = calculateUserStats(expenses);
  const recommendations = generateRecommendations(expenses);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user.displayName}!</h1>
              <p className="text-muted-foreground">Track and manage your expenses</p>
            </div>
            <div className="flex gap-3">
              <ShareProfileButton username={user.username} />
              <Button onClick={() => setShowAddDialog(true)} size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Add Expense
              </Button>
            </div>
          </div>

          <StatsCards stats={stats} loading={loadingExpenses} />
        </motion.div>

        {/* Analytics Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <YearlyOverview expenses={expenses} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CategoryPieChart expenses={expenses} />
          </motion.div>
        </div>

        {/* Monthly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <MonthlyExpenseChart expenses={expenses} />
        </motion.div>

        {/* Expenses and Recommendations */}
        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <ExpenseList
              expenses={expenses}
              loading={loadingExpenses}
              onRefresh={loadExpenses}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <RecommendationsPanel recommendations={recommendations} />
          </motion.div>
        </div>
      </main>

      <AddExpenseDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSuccess={loadExpenses}
      />
    </div>
  );
}
