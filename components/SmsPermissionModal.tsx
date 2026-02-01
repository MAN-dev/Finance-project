import React from 'react';
import { MessageSquare, ShieldCheck, X } from 'lucide-react';
import { Button } from './Button';

interface SmsPermissionModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onDecline: () => void;
}

export const SmsPermissionModal: React.FC<SmsPermissionModalProps> = ({ isOpen, onAllow, onDecline }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#18181b] border border-zinc-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
        
        <div className="bg-gradient-to-br from-indigo-900/50 to-primary/20 p-6 flex flex-col items-center text-center border-b border-white/5 relative">
          <button 
            onClick={onDecline} 
            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-md border border-white/10 shadow-lg shadow-primary/20">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Automate Your Tracking</h2>
          <p className="text-indigo-200 text-sm mt-1">SMS Transaction Detection</p>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-zinc-300 text-sm leading-relaxed text-center">
            CREDFIN can detect transaction SMS from your bank (UPI, Debit, Credit) and automatically prepare them for your review.
          </p>

          <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 space-y-3">
            <div className="flex items-start gap-3">
               <div className="mt-0.5 min-w-[20px]"><ShieldCheck size={18} className="text-emerald-500" /></div>
               <p className="text-xs text-zinc-400"><strong>Privacy First:</strong> We only process messages locally on your device. Your personal messages are never stored on our servers.</p>
            </div>
            <div className="flex items-start gap-3">
               <div className="mt-0.5 min-w-[20px]"><MessageSquare size={18} className="text-blue-500" /></div>
               <p className="text-xs text-zinc-400"><strong>You are in control:</strong> You will receive a notification for every detected transaction to "Allow" or "Decline" the recording.</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Button fullWidth onClick={onAllow} size="lg">
              Allow SMS Access
            </Button>
            <button 
              onClick={onDecline}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              No, I'll enter manually
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};