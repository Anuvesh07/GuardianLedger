'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createExpense } from '@/lib/firestore';
import { CATEGORIES } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddExpenseDialog({ open, onClose, onSuccess }: AddExpenseDialogProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState(''); // For showing the expression
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Evaluate mathematical expression
  const evaluateExpression = (expr: string): number | null => {
    try {
      // Remove any non-math characters except numbers, operators, parentheses, and decimal points
      const sanitized = expr.replace(/[^0-9+\-*/().\s]/g, '');
      if (!sanitized) return null;
      
      // Use Function constructor for safe evaluation (better than eval)
      const result = Function(`'use strict'; return (${sanitized})`)();
      
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return Math.round(result * 100) / 100; // Round to 2 decimal places
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  // Handle amount input change
  const handleAmountChange = (value: string) => {
    setDisplayAmount(value);
    setAmount(value);
  };

  // Handle amount blur (when user leaves the field)
  const handleAmountBlur = () => {
    if (displayAmount) {
      const calculated = evaluateExpression(displayAmount);
      if (calculated !== null) {
        setAmount(calculated.toString());
        setDisplayAmount(calculated.toString());
      }
    }
  };

  // Handle Enter key in amount field
  const handleAmountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAmountBlur();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setLoading(true);

    try {
      await createExpense({
        userId: user.id,
        title,
        amount: parseFloat(amount),
        category,
        date: new Date(date),
        notes: notes || undefined,
      });

      // Reset form
      setTitle('');
      setAmount('');
      setDisplayAmount('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>Track a new expense to your account</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Grocery shopping"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="text"
                placeholder="66+66 or 100"
                value={displayAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                onBlur={handleAmountBlur}
                onKeyDown={handleAmountKeyDown}
                required
              />
              <p className="text-xs text-graphite">
                💡 Tip: You can use math! Try 66+66 or 50*2
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              placeholder="Additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && <div className="text-sm text-destructive">{error}</div>}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
