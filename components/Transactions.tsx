import React, { useState } from 'react';
import { Transaction, TransactionType, Account } from '../types';
import { formatCurrency, CATEGORY_COLORS } from '../constants';
import { ArrowDownLeft, ArrowUpRight, Search, Calendar, Star } from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  accounts: Account[];
  onToggleFavorite: (id: string) => void;
  showFavoritesOnly?: boolean;
}

export const Transactions: React.FC<TransactionsProps> = ({ 
  transactions, 
  accounts, 
  onToggleFavorite,
  showFavoritesOnly = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getAccountName = (id: string) => accounts.find(a => a.id === id)?.name || 'Unknown';
  
  // Sort by date desc
  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter based on Tab and Search
  const filtered = sorted.filter(t => {
    const matchesTab = !showFavoritesOnly || t.isFavorite;
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="bg-[#121212] border border-zinc-800 rounded-2xl overflow-hidden min-h-[400px]">
      <div className="p-6 border-b border-zinc-800 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-white">
              {showFavoritesOnly ? 'Favorite Transactions' : 'All Activity'}
            </h3>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black/40 border border-zinc-800 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-64"
              />
            </div>
        </div>
      </div>
      
      <div className="divide-y divide-zinc-800/50">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-300">
            {showFavoritesOnly ? (
                <>
                    <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4 ring-1 ring-yellow-500/20">
                        <Star className="w-8 h-8 text-yellow-500" fill="currentColor" fillOpacity={0.3} />
                    </div>
                    <h3 className="text-zinc-200 font-medium text-lg">No favorite transactions</h3>
                    <p className="text-zinc-500 text-sm mt-2 max-w-[280px]">
                        Tap the star icon on any transaction to pin it here for quick access.
                    </p>
                </>
            ) : (
                <>
                    <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-zinc-600" />
                    </div>
                    <p className="text-zinc-400">No transactions found matching your criteria.</p>
                </>
            )}
          </div>
        ) : (
          filtered.map((t) => {
            const isCredit = t.type === TransactionType.CREDIT;
            
            return (
              <div key={t.id} className="p-4 hover:bg-zinc-900/50 transition-colors flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isCredit ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}
                  >
                    {isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>
                  
                  <div>
                    <p className="text-white font-medium text-sm sm:text-base">{t.description || t.category}</p>
                    <div className="flex items-center space-x-2 text-xs text-zinc-500 mt-0.5">
                      <span className="flex items-center">
                         <Calendar size={10} className="mr-1" />
                         {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <span>•</span>
                      <span className="text-zinc-400">{getAccountName(t.accountId)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                    <p className={`font-semibold text-sm sm:text-base ${isCredit ? 'text-emerald-400' : 'text-white'}`}>
                        {isCredit ? '+' : '-'}{formatCurrency(t.amount)}
                    </p>
                    {t.description && (
                        <p className="text-xs text-zinc-500 mt-0.5 max-w-[150px] truncate ml-auto">
                            {t.description}
                        </p>
                    )}
                    <div className="flex items-center justify-end mt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                            {t.category}
                        </span>
                    </div>
                    </div>
                    
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(t.id);
                        }}
                        className={`p-2 rounded-full transition-all duration-200 transform active:scale-90 ${t.isFavorite ? 'text-yellow-400 bg-yellow-400/10' : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800'}`}
                        title={t.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <Star size={18} fill={t.isFavorite ? "currentColor" : "none"} />
                    </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};