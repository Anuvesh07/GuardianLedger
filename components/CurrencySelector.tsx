'use client';

import { useCurrency, CURRENCIES, type Currency } from '@/contexts/CurrencyContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DollarSign } from 'lucide-react';

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (currencyCode: string) => {
    const selected = CURRENCIES.find(c => c.code === currencyCode);
    if (selected) {
      setCurrency(selected);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-graphite" />
        <label className="text-sm font-medium text-ink">Currency</label>
      </div>
      <Select value={currency.code} onValueChange={handleCurrencyChange}>
        <SelectTrigger className="w-full">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{currency.symbol}</span>
              <span>{currency.code}</span>
              <span className="text-graphite">- {currency.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {CURRENCIES.map((curr) => (
            <SelectItem key={curr.code} value={curr.code}>
              <div className="flex items-center gap-2">
                <span className="font-semibold w-6">{curr.symbol}</span>
                <span className="font-medium w-12">{curr.code}</span>
                <span className="text-graphite">- {curr.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-graphite">
        All amounts will be displayed in {currency.name}
      </p>
    </div>
  );
}
