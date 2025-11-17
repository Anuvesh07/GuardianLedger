'use client';

import { useCurrency } from '@/contexts/CurrencyContext';

interface CurrencyDisplayProps {
  amount: number;
  className?: string;
}

export default function CurrencyDisplay({ amount, className = '' }: CurrencyDisplayProps) {
  const { formatAmount } = useCurrency();
  
  return <span className={className}>{formatAmount(amount)}</span>;
}
