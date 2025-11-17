'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserByUsername, getUserExpenses } from '@/lib/firestore';
import { calculateUserStats } from '@/lib/analytics';
import type { User, Expense } from '@/lib/types';
import Navbar from '@/components/Navbar';
import StatsCards from '@/components/StatsCards';
import MonthlyExpenseChart from '@/components/MonthlyExpenseChart';
import YearlyOverview from '@/components/YearlyOverview';
import CategoryPieChart from '@/components/CategoryPieChart';
import ShareProfileButton from '@/components/ShareProfileButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { User as UserIcon, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function UserProfilePage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSignupPopup, setShowSignupPopup] = useState(false);

  useEffect(() => {
    // Load profile regardless of auth status (public access)
    loadUserProfile();
    
    // Show signup popup for non-authenticated users after 2 seconds
    if (!authLoading && !currentUser) {
      const timer = setTimeout(() => {
        setShowSignupPopup(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [username, currentUser, authLoading]);

  const loadUserProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const user = await getUserByUsername(username);
      
      if (!user) {
        setError('User not found');
        return;
      }

      setProfileUser(user);
      const userExpenses = await getUserExpenses(user.id);
      setExpenses(userExpenses);
    } catch (err: any) {
      setError(err.message || 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-destructive mb-4">{error || 'User not found'}</p>
              <Link href="/search">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Search
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const stats = calculateUserStats(expenses);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Signup Popup for Non-Authenticated Users */}
      {showSignupPopup && !currentUser && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowSignupPopup(false)}
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="relative max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-2 border-primary/50 shadow-2xl">
              <CardHeader className="relative">
                <button
                  onClick={() => setShowSignupPopup(false)}
                  className="absolute right-4 top-4 rounded-full p-1 hover:bg-muted transition-colors"
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                <CardTitle className="text-2xl">Track Your Own Expenses! 💰</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  You&apos;re viewing {profileUser?.displayName}&apos;s expenses. Want to track your own spending and get personalized insights?
                </p>
                <div className="space-y-2">
                  <Link href="/auth/signup" className="block">
                    <Button className="w-full" size="lg">
                      Sign Up Free
                    </Button>
                  </Link>
                  <Link href="/auth/login" className="block">
                    <Button variant="outline" className="w-full" size="lg">
                      Log In
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Free forever • No credit card required
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <Link href="/search">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Search
              </Button>
            </Link>
            <ShareProfileButton username={profileUser.username} variant="outline" />
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              {profileUser.photoURL ? (
                <img
                  src={profileUser.photoURL}
                  alt={profileUser.displayName}
                  className="h-16 w-16 rounded-full"
                />
              ) : (
                <UserIcon className="h-8 w-8 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profileUser.displayName}</h1>
              <p className="text-muted-foreground">@{profileUser.username}</p>
            </div>
          </div>

          <StatsCards stats={stats} loading={false} />

          <div className="grid lg:grid-cols-2 gap-6 mt-8">
            <YearlyOverview expenses={expenses} />
            <CategoryPieChart expenses={expenses} />
          </div>

          <div className="mt-8">
            <MonthlyExpenseChart expenses={expenses} />
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Expense History</CardTitle>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No expenses to display</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {expenses.slice(0, 20).map((expense, i) => (
                      <motion.div
                        key={expense.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{expense.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                              {expense.category}
                            </span>
                            <span>{formatDate(expense.date)}</span>
                          </div>
                          {expense.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{expense.notes}</p>
                          )}
                        </div>
                        <span className="text-lg font-semibold">{formatCurrency(expense.amount)}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
