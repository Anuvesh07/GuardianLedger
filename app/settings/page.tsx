'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Navbar from '@/components/Navbar';
import ShareProfileButton from '@/components/ShareProfileButton';
import CurrencySelector from '@/components/CurrencySelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { User, Moon, Sun, Settings as SettingsIcon, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  
  // Safely get theme context
  let theme = 'light';
  let toggleTheme = () => {};
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    toggleTheme = themeContext.toggleTheme;
  } catch (error) {
    // ThemeProvider not available
  }

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      try {
        await signOut();
        router.push('/');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Display Name</Label>
                <p className="text-lg font-medium">{user.displayName}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Username</Label>
                <p className="text-lg font-medium">@{user.username}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Email</Label>
                <p className="text-lg font-medium">{user.email}</p>
              </div>
              <div className="pt-4 border-t border-stone/60 dark:border-stone/20">
                <Label className="text-sm text-muted-foreground mb-2 block">Share Your Profile</Label>
                <p className="text-sm text-graphite mb-3">
                  Let others view your expenses and spending patterns
                </p>
                <ShareProfileButton username={user.username} variant="default" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Preferences
              </CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Setting */}
              <div className="flex items-center justify-between pb-6 border-b border-stone/60 dark:border-stone/20">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {theme === 'dark' ? <Moon className="h-4 w-4 text-graphite" /> : <Sun className="h-4 w-4 text-graphite" />}
                    <Label>Theme</Label>
                  </div>
                  <p className="text-sm text-graphite">
                    Current: {theme === 'dark' ? 'Dark' : 'Light'} mode
                  </p>
                </div>
                <Button onClick={toggleTheme} variant="outline">
                  {theme === 'dark' ? (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      Light
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      Dark
                    </>
                  )}
                </Button>
              </div>

              {/* Currency Setting */}
              <div>
                <CurrencySelector />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warm-coral-dark">
                <LogOut className="h-5 w-5" />
                Account Actions
              </CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-ink mb-2 block">Sign Out</Label>
                  <p className="text-sm text-graphite mb-3">
                    Sign out of your account on this device
                  </p>
                  <Button 
                    onClick={handleSignOut} 
                    variant="destructive"
                    className="w-full sm:w-auto"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
