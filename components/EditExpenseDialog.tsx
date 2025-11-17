'use client';

import { useState, useEffect } from 'react';
import { updateExpense } from '@/lib/firestore';
import { CATEGORIES } from '@/lib/types';
import type { Expense } from '@/lib/types';
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

interface EditExpenseDialogProps {
  expense: Expense;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditExpenseDialog({ expense, open, onClose, onSuccess }: EditExpenseDialogProps) {
  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(expense.amount.toString());
  const [displayAmount, setDisplayAmount] = useState(expense.amount.toString());
  const [category, setCategory] = useState(expense.category);
  const [date, setDate] = useState(expense.date.toISOString().split('T')[0]);
  const [notes, setNotes] = useState(expense.notes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Evaluate mathematical expression
  const evaluateExpression = (expr: string): number | null => {
    try {
      const sanitized = expr.replace(/[^0-9+\-*/().\s]/g, '');
      if (!sanitized) return null;
      
      const result = Function(`'use strict'; return (${sanitized})`)();
      
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return Math.round(result * 100) / 100;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const handleAmountChange = (value: string) => {
    setDisplayAmount(value);
    setAmount(value);
  };

  const handleAmountBlur = () => {
    if (displayAmount) {
      const calculated = evaluateExpression(displayAmount);
      if (calculated !== null) {
        setAmount(calculated.toString());
        setDisplayAmount(calculated.toString());
      }
    }
  };

  const handleAmountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAmountBlur();
    }
  };

  useEffect(() => {
    setTitle(expense.title);
    setAmount(expense.amount.toString());
    setDisplayAmount(expense.amount.toString());
    setCategory(expense.category);
    setDate(expense.date.toISOString().split('T')[0]);
    setNotes(expense.notes || '');
  }, [expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await updateExpense(expense.id, {
        title,
        amount: parseFloat(amount),
        category,
        date: new Date(date),
        notes: notes || undefined,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to update expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogDescription>Update your expense details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount</Label>
              <Input
                id="edit-amount"
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
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue />
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
            <Label htmlFor="edit-notes">Notes (optional)</Label>
            <Input
              id="edit-notes"
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
              {loading ? 'Updating...' : 'Update Expense'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
