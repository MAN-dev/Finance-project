import React, { useState } from 'react';
import { generateFinancialInsights } from '../services/gemini';
import { Transaction, Account } from '../types';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface AiAdvisorProps {
  transactions: Transaction[];
  accounts: Account[];
}

export const AiAdvisor: React.FC<AiAdvisorProps> = ({ transactions, accounts }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetAdvice = async () => {
    setLoading(true);
    const result = await generateFinancialInsights(transactions, accounts);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-violet-900/20 to-fuchsia-900/20 border border-violet-500/20 rounded-2xl p-6 relative overflow-hidden">
       {/* Decorative glow */}
       <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-[50px] rounded-full" />

       <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
               <div className="p-2 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg shadow-lg shadow-violet-900/50">
                  <Sparkles size={20} className="text-white" />
               </div>
               <div>
                 <h3 className="font-bold text-white text-lg">AI Financial Advisor</h3>
                 <p className="text-zinc-400 text-sm">Powered by Gemini 3.0</p>
               </div>
            </div>
            
            <Button 
                onClick={handleGetAdvice} 
                disabled={loading}
                variant="primary"
                size="sm"
                className="bg-violet-600 hover:bg-violet-700"
            >
               {loading ? <RefreshCw className="animate-spin w-4 h-4 mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
               {loading ? 'Analyzing...' : 'Get Insights'}
            </Button>
          </div>

          {advice ? (
             <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-violet-500/20 text-zinc-200 text-sm leading-relaxed whitespace-pre-line animate-in fade-in slide-in-from-bottom-2">
                {advice}
             </div>
          ) : (
             <div className="flex items-center space-x-2 text-zinc-500 text-sm bg-black/20 p-4 rounded-xl border border-white/5">
                <AlertCircle size={16} />
                <p>Tap "Get Insights" to analyze your spending patterns and receive personalized saving tips.</p>
             </div>
          )}
       </div>
    </div>
  );
};