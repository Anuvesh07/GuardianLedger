'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserByUsername } from '@/lib/firestore';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [searchedUsername, setSearchedUsername] = useState('');

  if (!loading && !user) {
    router.push('/auth/login');
    return null;
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSearching(true);
    
    const username = searchQuery.trim().toLowerCase();
    setSearchedUsername(username);

    try {
      if (username.length < 3) {
        setError('Username must be at least 3 characters');
        setSearching(false);
        return;
      }

      const foundUser = await getUserByUsername(username);
      
      if (!foundUser) {
        setError(`User "${username}" not found. Make sure the username is correct.`);
      } else {
        router.push(`/user/${username}`);
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search user. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-6 w-6" />
                Find Users
              </CardTitle>
              <CardDescription>
                Search for other users by their username to view their expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter username..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={searching}>
                    {searching ? 'Searching...' : 'Search'}
                  </Button>
                </div>

                {error && (
                  <div className="p-4 bg-warm-coral-light border border-warm-coral/20 rounded-lg">
                    <p className="text-sm text-warm-coral-dark font-medium">{error}</p>
                    {searchedUsername && (
                      <p className="text-xs text-warm-coral-dark/80 mt-1">
                        Tip: Usernames are case-sensitive and must match exactly
                      </p>
                    )}
                  </div>
                )}
                
                {user && (
                  <div className="p-4 bg-soft-mint-light rounded-lg">
                    <p className="text-sm text-soft-mint-dark">
                      <strong>Your username:</strong> @{user.username}
                    </p>
                    <p className="text-xs text-soft-mint-dark/80 mt-1">
                      Share this with others so they can find you!
                    </p>
                  </div>
                )}
              </form>

              <div className="mt-8">
                <h3 className="text-sm font-medium mb-4">How it works</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Search for any user by their unique username</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>View their expense history and spending patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Analyze their top categories and monthly summaries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Get insights from their spending behavior</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
