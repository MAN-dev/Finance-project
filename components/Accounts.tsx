import React from 'react';
import { Account } from '../types';
import { formatCurrency } from '../constants';
import { CreditCard, Plus, Settings2 } from 'lucide-react';

interface AccountsProps {
  accounts: Account[];
  accountBalances: Record<string, number>;
  onManage: () => void;
}

export const Accounts: React.FC<AccountsProps> = ({ accounts, accountBalances, onManage }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-semibold text-white">Your Accounts</h2>
        <button 
          onClick={onManage}
          className="text-primary text-sm font-medium hover:text-violet-400 transition-colors flex items-center gap-1"
        >
           <Settings2 size={16} /> Manage
        </button>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {accounts.map((acc) => {
           const balance = accountBalances[acc.id] || 0;
           return (
            <div 
              key={acc.id} 
              onClick={onManage}
              className="min-w-[280px] bg-[#18181b] border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-zinc-700 transition-all cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <CreditCard size={80} color={acc.color} />
              </div>

              {/* Background Image if available */}
              {acc.avatar && (
                 <div className="absolute inset-0 z-0">
                    <img src={acc.avatar} alt="" className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity blur-sm" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-[#18181b]/80 to-transparent" />
                 </div>
              )}
              
              <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/50 border border-white/5 overflow-hidden shrink-0" style={{ color: acc.color }}>
                    {acc.avatar ? (
                        <img src={acc.avatar} alt={acc.name} className="w-full h-full object-cover" />
                    ) : (
                        <CreditCard size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white truncate max-w-[150px]">{acc.name}</h3>
                    <p className="text-xs text-zinc-500">Savings Account</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Available Funds</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(balance)}</p>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: acc.color }} />
            </div>
          );
        })}
        
        {/* Add Account Placeholder */}
        <div className="min-w-[100px] flex items-center justify-center">
            <button 
                onClick={onManage}
                className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 transition-all"
            >
                <Plus size={24} />
            </button>
        </div>
      </div>
    </div>
  );
};