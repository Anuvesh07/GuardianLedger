'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Users, Shield, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cloud">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-mint"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cloud">

      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <span className="p-2 bg-soft-mint-light text-soft-mint-dark rounded-lg">
            <Wallet className="h-6 w-6" />
          </span>
          <span className="text-2xl font-bold text-ink">ExpenseTracker</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-3"
        >
          <Link href="/auth/login">
            <Button variant="ghost" className="text-graphite hover:text-ink hover:bg-paper">
              Login
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="bg-soft-mint text-white hover:brightness-105 shadow-soft">
              Get Started
            </Button>
          </Link>
        </motion.div>
      </nav>

      <main className="container mx-auto px-6 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-lavender-light text-lavender-dark rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Modern expense tracking made simple</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-ink">
            Take Control of Your{' '}
            <span className="bg-gradient-to-r from-soft-mint to-sky-blue bg-clip-text text-transparent">
              Finances
            </span>
          </h1>
          
          <p className="text-xl text-graphite mb-8 max-w-2xl mx-auto">
            Track expenses, analyze spending patterns, and get personalized recommendations
            to achieve your financial goals.
          </p>
          
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-8 py-6 bg-soft-mint text-white hover:brightness-105 shadow-soft-md">
              Start Tracking Free
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 md:mt-24"
        >
          {[
            { 
              icon: Wallet, 
              title: 'Easy Tracking', 
              desc: 'Add expenses in seconds with our intuitive interface', 
              color: 'bg-sky-blue-light text-sky-blue-dark' 
            },
            { 
              icon: TrendingUp, 
              title: 'Smart Analytics', 
              desc: 'Visualize spending patterns with beautiful charts', 
              color: 'bg-soft-mint-light text-soft-mint-dark' 
            },
            { 
              icon: Users, 
              title: 'Social Features', 
              desc: 'View and learn from others\' expense habits', 
              color: 'bg-lavender-light text-lavender-dark' 
            },
            { 
              icon: Shield, 
              title: 'Secure & Private', 
              desc: 'Your financial data is encrypted and protected', 
              color: 'bg-lemon-light text-lemon-dark' 
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="bg-paper p-6 rounded-2xl shadow-soft hover:shadow-soft-md transition-all"
            >
              <span className={`inline-flex p-3 rounded-lg ${feature.color} mb-4`}>
                <feature.icon className="h-6 w-6" />
              </span>
              <h3 className="text-xl font-semibold mb-2 text-ink">{feature.title}</h3>
              <p className="text-graphite">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-16 md:mt-24"
        >
          <div className="bg-paper p-8 md:p-10 rounded-2xl shadow-soft-md max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <span className="inline-flex p-3 bg-soft-mint-light text-soft-mint-dark rounded-lg mb-4">
                <Sparkles className="h-6 w-6" />
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-ink mb-3">
                🚀 Quick Setup Required
              </h2>
              <p className="text-graphite">
                To enable authentication and database features, configure Firebase in 5 minutes:
              </p>
            </div>
            
            <ol className="space-y-3 mb-6 text-left">
              {[
                'Create a Firebase project at console.firebase.google.com',
                'Enable Authentication (Email, Google, GitHub)',
                'Create a Firestore database',
                'Copy your Firebase config to .env file',
                'Restart the development server'
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-graphite">
                  <span className="flex-shrink-0 w-6 h-6 bg-soft-mint-light text-soft-mint-dark rounded-full flex items-center justify-center text-sm font-semibold">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            
            <div className="bg-lavender-light p-4 rounded-lg text-center">
              <p className="text-sm text-lavender-dark">
                📖 See <strong>QUICKSTART.md</strong> for detailed step-by-step instructions
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
