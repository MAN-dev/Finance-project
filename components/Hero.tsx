import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatCurrency } from '../constants';

interface HeroProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}

export const Hero: React.FC<HeroProps> = ({ totalBalance, totalIncome, totalExpense }) => {
  return (
    <div className="w-full space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-3xl p-8 border border-zinc-800 shadow-xl">
        {/* Abstract Background Decoration */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />

        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-2">
            <div className="bg-primary/20 p-1.5 rounded-full">
               <Wallet className="w-4 h-4 text-primary" />
            </div>
            <span className="text-zinc-400 text-sm font-medium tracking-wide uppercase">Total Net Balance</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mt-4">
            {formatCurrency(totalBalance)}
          </h1>
          
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/5">
              <div className="flex items-center space-x-2 text-zinc-400 mb-1">
                <TrendingUp size={16} className="text-emerald-500" />
                <span className="text-xs font-medium uppercase">Income this month</span>
              </div>
              <p className="text-xl font-semibold text-emerald-400">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/5">
              <div className="flex items-center space-x-2 text-zinc-400 mb-1">
                <TrendingDown size={16} className="text-rose-500" />
                <span className="text-xs font-medium uppercase">Expense this month</span>
              </div>
              <p className="text-xl font-semibold text-rose-400">{formatCurrency(totalExpense)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};