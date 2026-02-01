import React from 'react';
import { Transaction, TransactionType } from '../types';
import { formatCurrency } from '../constants';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface TransactionTickerProps {
  transactions: Transaction[];
}

export const TransactionTicker: React.FC<TransactionTickerProps> = ({ transactions }) => {
  // Get last 10 transactions
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  if (recent.length === 0) return null;

  // Duplicate items to ensure smooth infinite scroll
  // We create a list long enough to fill the screen twice
  const marqueeItems = [...recent, ...recent, ...recent, ...recent];

  return (
    <div className="flex-1 overflow-hidden mx-8 hidden md:block ticker-mask h-8 relative">
      <div className="animate-marquee flex items-center gap-12 absolute top-0 left-0 h-full">
        {marqueeItems.map((t, index) => (
          <div key={`${t.id}-${index}`} className="flex items-center space-x-2 text-xs font-medium whitespace-nowrap">
             <span className="text-zinc-500 font-normal truncate max-w-[150px]">{t.description || t.category}</span>
             <span className={`flex items-center ${t.type === TransactionType.CREDIT ? "text-emerald-400" : "text-rose-400"}`}>
                {t.type === TransactionType.CREDIT ? (
                    <ArrowDownLeft size={12} className="mr-1" />
                ) : (
                    <ArrowUpRight size={12} className="mr-1" />
                )}
                {formatCurrency(t.amount)}
             </span>
          </div>
        ))}
      </div>
    </div>
  );
};