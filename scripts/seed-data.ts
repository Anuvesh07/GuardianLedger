/**
 * Seed Script for Expense Tracker
 * 
 * Creates sample expenses for testing and development.
 * 
 * Usage:
 * 1. Create a user account in your app
 * 2. Get your user ID from Firebase Console or browser console
 * 3. Run: USER_ID=your_user_id npx ts-node scripts/seed-data.ts
 * 
 * Or set USER_ID environment variable in your .env file
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { subDays } from 'date-fns';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const USER_ID = process.env.USER_ID || '';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleExpenses = [
  // This month
  { title: 'Grocery Shopping', amount: 85.50, category: 'Food & Dining', daysAgo: 1, notes: 'Weekly groceries' },
  { title: 'Gas Station', amount: 45.00, category: 'Transportation', daysAgo: 2 },
  { title: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', daysAgo: 3 },
  { title: 'Restaurant Dinner', amount: 67.80, category: 'Food & Dining', daysAgo: 4, notes: 'Dinner with friends' },
  { title: 'Uber Ride', amount: 18.50, category: 'Transportation', daysAgo: 5 },
  { title: 'Coffee Shop', amount: 5.75, category: 'Food & Dining', daysAgo: 6 },
  { title: 'Gym Membership', amount: 50.00, category: 'Healthcare', daysAgo: 7 },
  { title: 'Online Course', amount: 99.00, category: 'Education', daysAgo: 8 },
  { title: 'New Shoes', amount: 89.99, category: 'Shopping', daysAgo: 9 },
  { title: 'Electric Bill', amount: 120.00, category: 'Bills & Utilities', daysAgo: 10 },
  
  // Last month
  { title: 'Grocery Shopping', amount: 92.30, category: 'Food & Dining', daysAgo: 35 },
  { title: 'Gas Station', amount: 50.00, category: 'Transportation', daysAgo: 38 },
  { title: 'Movie Tickets', amount: 28.00, category: 'Entertainment', daysAgo: 40 },
  { title: 'Restaurant Lunch', amount: 45.00, category: 'Food & Dining', daysAgo: 42 },
  { title: 'Pharmacy', amount: 35.50, category: 'Healthcare', daysAgo: 45 },
  { title: 'Books', amount: 42.99, category: 'Education', daysAgo: 48 },
  { title: 'Clothing', amount: 125.00, category: 'Shopping', daysAgo: 50 },
  { title: 'Internet Bill', amount: 60.00, category: 'Bills & Utilities', daysAgo: 52 },
  
  // 2 months ago
  { title: 'Grocery Shopping', amount: 78.90, category: 'Food & Dining', daysAgo: 65 },
  { title: 'Gas Station', amount: 48.00, category: 'Transportation', daysAgo: 68 },
  { title: 'Concert Tickets', amount: 150.00, category: 'Entertainment', daysAgo: 70 },
  { title: 'Fast Food', amount: 12.50, category: 'Food & Dining', daysAgo: 72 },
  { title: 'Doctor Visit', amount: 75.00, category: 'Healthcare', daysAgo: 75 },
  { title: 'Weekend Trip', amount: 350.00, category: 'Travel', daysAgo: 78 },
];

async function seedData() {
  if (!USER_ID) {
    console.error('❌ USER_ID environment variable is required');
    console.log('\nUsage: USER_ID=your_user_id npx ts-node scripts/seed-data.ts');
    console.log('\nTo find your user ID:');
    console.log('1. Sign in to your app');
    console.log('2. Go to Firebase Console → Authentication');
    console.log('3. Copy your User UID\n');
    process.exit(1);
  }

  console.log('🌱 Starting to seed data...\n');

  try {
    const expensesRef = collection(db, 'expenses');
    let count = 0;

    for (const expense of sampleExpenses) {
      const date = subDays(new Date(), expense.daysAgo);
      
      await addDoc(expensesRef, {
        userId: USER_ID,
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: Timestamp.fromDate(date),
        notes: expense.notes || undefined,
        createdAt: Timestamp.now(),
      });

      count++;
      console.log(`✅ Added: ${expense.title} - $${expense.amount}`);
    }

    console.log(`\n🎉 Successfully added ${count} sample expenses!`);
    console.log('You can now view them in your dashboard.\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
