import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  updateDoc,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { User, Expense, ExpenseFilters } from './types';

// User operations
export async function createUserProfile(userId: string, data: Omit<User, 'id' | 'createdAt'>) {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...data,
    createdAt: Timestamp.now(),
  });
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) return null;
  
  const data = userSnap.data();
  return {
    id: userSnap.id,
    ...data,
    createdAt: data.createdAt.toDate(),
  } as User;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('username', '==', username));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt.toDate(),
  } as User;
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const user = await getUserByUsername(username);
  return user === null;
}

// Expense operations
export async function createExpense(expense: Omit<Expense, 'id' | 'createdAt'>) {
  const expensesRef = collection(db, 'expenses');
  const docRef = await addDoc(expensesRef, {
    ...expense,
    date: Timestamp.fromDate(expense.date),
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateExpense(expenseId: string, data: Partial<Expense>) {
  const expenseRef = doc(db, 'expenses', expenseId);
  const updateData: any = { ...data };
  
  if (data.date) {
    updateData.date = Timestamp.fromDate(data.date);
  }
  
  await updateDoc(expenseRef, updateData);
}

export async function deleteExpense(expenseId: string) {
  const expenseRef = doc(db, 'expenses', expenseId);
  await deleteDoc(expenseRef);
}

export async function getUserExpenses(userId: string, filters?: ExpenseFilters): Promise<Expense[]> {
  const expensesRef = collection(db, 'expenses');
  let q = query(expensesRef, where('userId', '==', userId), orderBy('date', 'desc'));
  
  const snapshot = await getDocs(q);
  let expenses = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: data.date.toDate(),
      createdAt: data.createdAt.toDate(),
    } as Expense;
  });
  
  // Apply filters
  if (filters) {
    if (filters.category) {
      expenses = expenses.filter(e => e.category === filters.category);
    }
    if (filters.startDate) {
      expenses = expenses.filter(e => e.date >= filters.startDate!);
    }
    if (filters.endDate) {
      expenses = expenses.filter(e => e.date <= filters.endDate!);
    }
    if (filters.minAmount !== undefined) {
      expenses = expenses.filter(e => e.amount >= filters.minAmount!);
    }
    if (filters.maxAmount !== undefined) {
      expenses = expenses.filter(e => e.amount <= filters.maxAmount!);
    }
  }
  
  return expenses;
}

export async function getExpense(expenseId: string): Promise<Expense | null> {
  const expenseRef = doc(db, 'expenses', expenseId);
  const expenseSnap = await getDoc(expenseRef);
  
  if (!expenseSnap.exists()) return null;
  
  const data = expenseSnap.data();
  return {
    id: expenseSnap.id,
    ...data,
    date: data.date.toDate(),
    createdAt: data.createdAt.toDate(),
  } as Expense;
}
