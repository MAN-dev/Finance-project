import React, { useEffect, useState } from 'react';
import { Check, X, Smartphone, ArrowRight } from 'lucide-react';
import { ParsedSms } from '../services/smsParser';

interface NotificationToastProps {
  data: ParsedSms | null;
  onAllow: () => void;
  onDecline: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ data, onAllow, onDecline }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (data) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [data]);

  if (!data || !isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] p-4 flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-[#18181b] border border-zinc-700 shadow-2xl shadow-black/50 rounded-2xl p-4 w-full max-w-lg animate-in slide-in-from-top-5 duration-300 flex flex-col gap-3">
        
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Smartphone size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-white">New Transaction Detected</h4>
                    <p className="text-xs text-zinc-400">via SMS • {data.bankName}</p>
                </div>
            </div>
            <button onClick={onDecline} className="text-zinc-500 hover:text-white">
                <X size={18} />
            </button>
        </div>

        <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800 flex items-center justify-between">
            <div>
                <p className="text-white font-medium">{data.description}</p>
                <p className="text-xs text-zinc-500 uppercase mt-1">{data.type}</p>
            </div>
            <div className={`text-lg font-bold ${data.type === 'CREDIT' ? 'text-emerald-400' : 'text-white'}`}>
                {data.type === 'CREDIT' ? '+' : '-'}₹{data.amount}
            </div>
        </div>

        <div className="flex gap-3">
            <button 
                onClick={onDecline}
                className="flex-1 py-2 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
            >
                Decline
            </button>
            <button 
                onClick={onAllow}
                className="flex-1 py-2 rounded-lg text-xs font-medium bg-primary text-white hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
            >
                <Check size={14} /> Record Transaction
            </button>
        </div>

      </div>
    </div>
  );
};