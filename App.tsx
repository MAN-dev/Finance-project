import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Bell, Settings, LogOut, PieChart, List, Star, Pencil, Trash2, Smartphone } from 'lucide-react';

import { Transaction, Account, TransactionType, FinancialState, User } from './types';
import { DEFAULT_ACCOUNTS, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from './constants';
import { loadData, saveData, loadUser, saveUser } from './services/storage';
import { parseSms, MOCK_SMS_MESSAGES, ParsedSms } from './services/smsParser';

import { Hero } from './components/Hero';
import { Accounts } from './components/Accounts';
import { Analytics } from './components/Analytics';
import { Transactions } from './components/Transactions';
import { AiAdvisor } from './components/AiAdvisor';
import { Modal } from './components/Modal';
import { Input, Select } from './components/Input';
import { Button } from './components/Button';
import { Login } from './components/Login';
import { ImageUpload } from './components/ImageUpload';
import { SmsPermissionModal } from './components/SmsPermissionModal';
import { NotificationToast } from './components/NotificationToast';
import { TransactionTicker } from './components/TransactionTicker';

type ViewMode = 'activity' | 'favorites' | 'analytics';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('activity');
  
  const [state, setState] = useState<FinancialState>({
    accounts: DEFAULT_ACCOUNTS,
    transactions: [],
  });

  // SMS Feature State
  const [smsPermission, setSmsPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [incomingSms, setIncomingSms] = useState<ParsedSms | null>(null);

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAccountManagerOpen, setIsAccountManagerOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Partial<Account> | null>(null);

  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: TransactionType.DEBIT,
    accountId: DEFAULT_ACCOUNTS[0].id,
    date: new Date().toISOString().split('T')[0],
  });

  // Load User & Data
  useEffect(() => {
    const loadedUser = loadUser();
    if (loadedUser) setUser(loadedUser);
    
    const data = loadData();
    if (data) setState(data);

    // Check SMS Permission
    const storedPermission = localStorage.getItem('credfin_sms_permission');
    if (storedPermission === 'granted' || storedPermission === 'denied') {
        setSmsPermission(storedPermission as any);
    } else {
        // Delay showing permission modal slightly for better UX
        setTimeout(() => setShowSmsModal(true), 2000);
    }
  }, []);

  // Save Data
  useEffect(() => {
    saveData(state);
  }, [state]);

  // SMS Simulation Effect
  useEffect(() => {
    if (smsPermission === 'granted' && user) {
        // SIMULATION: If permission is granted, simulate an incoming SMS after a delay
        // In a real mobile app, this would be a background event listener
        const randomTime = 8000; // 8 seconds
        const timer = setTimeout(() => {
            // Only show if we don't already have one pending
            if (!incomingSms) {
                const randomMsg = MOCK_SMS_MESSAGES[Math.floor(Math.random() * MOCK_SMS_MESSAGES.length)];
                const parsed = parseSms(randomMsg);
                if (parsed) setIncomingSms(parsed);
            }
        }, randomTime);

        return () => clearTimeout(timer);
    }
  }, [smsPermission, user, incomingSms]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    saveUser(userData);
    // Check permission again on login if not set
    if (localStorage.getItem('credfin_sms_permission') === null) {
        setTimeout(() => setShowSmsModal(true), 1500);
    }
  };

  const handleLogout = () => {
    setUser(null);
    saveUser(null);
  };

  const handleUpdateProfile = () => {
    if (user) {
      saveUser(user);
      setIsProfileModalOpen(false);
    }
  };

  // SMS Permission Handlers
  const handleAllowSms = () => {
      localStorage.setItem('credfin_sms_permission', 'granted');
      setSmsPermission('granted');
      setShowSmsModal(false);
  };

  const handleDeclineSms = () => {
      localStorage.setItem('credfin_sms_permission', 'denied');
      setSmsPermission('denied');
      setShowSmsModal(false);
  };

  const handleRecordSmsTransaction = () => {
      if (!incomingSms) return;

      const transaction: Transaction = {
          id: uuidv4(),
          accountId: state.accounts[0].id, // Default to first account
          amount: incomingSms.amount,
          type: incomingSms.type,
          description: incomingSms.description,
          category: 'Other', // Default category
          date: incomingSms.date,
          isFavorite: false
      };

      setState(prev => ({
          ...prev,
          transactions: [transaction, ...prev.transactions]
      }));

      setIncomingSms(null); // Clear notification
  };

  const handleSaveAccount = () => {
    if (!editingAccount || !editingAccount.name) return;

    setState(prev => {
      let updatedAccounts;
      if (editingAccount.id) {
        // Edit existing
        updatedAccounts = prev.accounts.map(acc => 
          acc.id === editingAccount.id ? { ...acc, ...editingAccount } as Account : acc
        );
      } else {
        // Add new
        const newAccount: Account = {
          id: `acc_${Date.now()}`,
          name: editingAccount.name!,
          color: editingAccount.color || '#8b5cf6',
          initialBalance: editingAccount.initialBalance || 0,
          avatar: editingAccount.avatar
        };
        updatedAccounts = [...prev.accounts, newAccount];
      }
      return { ...prev, accounts: updatedAccounts };
    });
    setEditingAccount(null);
  };

  const handleDeleteAccount = (id: string) => {
    if (confirm('Are you sure? This will hide the account but keep transactions.')) {
        setState(prev => ({
            ...prev,
            accounts: prev.accounts.filter(a => a.id !== id)
        }));
    }
  };

  // Derived State
  const accountBalances = useMemo(() => {
    const balances: Record<string, number> = {};
    state.accounts.forEach(acc => {
      balances[acc.id] = acc.initialBalance;
    });

    state.transactions.forEach(t => {
      if (!balances[t.accountId]) balances[t.accountId] = 0;
      if (t.type === TransactionType.CREDIT) {
        balances[t.accountId] += t.amount;
      } else {
        balances[t.accountId] -= t.amount;
      }
    });
    return balances;
  }, [state]);

  const totalBalance = Object.values(accountBalances).reduce((a: number, b: number) => a + b, 0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthTransactions = state.transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === TransactionType.CREDIT)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = currentMonthTransactions
    .filter(t => t.type === TransactionType.DEBIT)
    .reduce((sum, t) => sum + t.amount, 0);

  // Handlers
  const handleAddTransaction = () => {
    if (!newTransaction.amount || !newTransaction.description) return;

    const transaction: Transaction = {
      id: uuidv4(),
      accountId: newTransaction.accountId!,
      type: newTransaction.type || TransactionType.DEBIT,
      amount: Number(newTransaction.amount),
      description: newTransaction.description!,
      category: newTransaction.category || 'Other',
      date: newTransaction.date || new Date().toISOString().split('T')[0],
      isFavorite: false,
    };

    setState(prev => ({
      ...prev,
      transactions: [transaction, ...prev.transactions],
    }));
    
    setIsAddModalOpen(false);
    setNewTransaction({
      type: TransactionType.DEBIT,
      accountId: state.accounts[0].id,
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      description: '',
      category: 'Other'
    });
  };

  const handleToggleFavorite = (id: string) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => 
        t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
      )
    }));
  };

// Initialize demo user if no user exists
 // Initialize demo user if no user exists
 useEffect(() => {
    if (!user) {
      setUser({ name: 'Demo User', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo' });
    }
  }, []);


  
  return (
    <div className="min-h-screen pb-20 sm:pb-10">
      
      {/* SMS Permission Modal */}
      <SmsPermissionModal 
        isOpen={showSmsModal} 
        onAllow={handleAllowSms} 
        onDecline={handleDeclineSms} 
      />

      {/* Simulated Notification Bar */}
      <NotificationToast 
        data={incomingSms} 
        onAllow={handleRecordSmsTransaction} 
        onDecline={() => setIncomingSms(null)} 
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#09090b]/60 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 shrink-0">
            {/* New Logo */}
            <div className="w-8 h-8 rounded-lg overflow-hidden relative bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                 <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-br from-rose-500/20 to-rose-600/20" />
                 <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20" />
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M7 17L17 7" className="stroke-zinc-700" strokeWidth="2" />
                     <path d="M17 7H13" className="stroke-emerald-500" />
                     <path d="M17 7V11" className="stroke-emerald-500" />
                     <path d="M7 17H11" className="stroke-rose-500" />
                     <path d="M7 17V13" className="stroke-rose-500" />
                 </svg>
            </div>
            
            <div className="hidden sm:block text-xl font-bold tracking-tight">
                <span className="text-rose-500">Dr.</span>
                <span className="text-emerald-500">Cr</span>
            </div>
            <div className="sm:hidden text-xl font-bold tracking-tight">
                <span className="text-rose-500">D</span>
                <span className="text-emerald-500">C</span>
            </div>
          </div>

          {/* Ticker inserted here */}
          <TransactionTicker transactions={state.transactions} />

          <div className="flex items-center space-x-4 shrink-0">
            <div className="hidden sm:flex items-center space-x-2 mr-2">
               <span className="text-sm text-zinc-400">Hi, {user?.name}</span>
            </div>
            
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="relative group focus:outline-none"
            >
                {user.avata?r ? (
                <img src={user.avatar} alt="User" className="w-9 h-9 rounded-full border border-zinc-700 object-cover group-hover:border-primary transition-colors" />
                ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-accent border border-white/10 group-hover:border-primary transition-colors" />
                )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8 animate-in fade-in duration-500">
        
        <Hero 
          totalBalance={totalBalance} 
          totalIncome={totalIncome} 
          totalExpense={totalExpense} 
        />

        <Accounts 
          accounts={state.accounts} 
          accountBalances={accountBalances} 
          onManage={() => {
            setIsAccountManagerOpen(true);
            setEditingAccount(null); // Reset
          }}
        />

        <AiAdvisor transactions={state.transactions} accounts={state.accounts} />

        {/* Action Bar (Mobile Sticky) */}
        <div className="fixed bottom-6 right-6 z-40 sm:static sm:flex sm:justify-end">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            size="lg"
            className="shadow-2xl shadow-primary/30 rounded-full sm:rounded-lg px-6"
          >
             <Plus className="w-5 h-5 mr-2" /> Add Transaction
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-zinc-800 flex items-center space-x-8">
           <button
             onClick={() => setViewMode('activity')}
             className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${viewMode === 'activity' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
           >
             <List size={16} /> All Activity
             {viewMode === 'activity' && <div className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
           </button>
           <button
             onClick={() => setViewMode('favorites')}
             className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${viewMode === 'favorites' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
           >
             <Star size={16} /> Favorites
             {viewMode === 'favorites' && <div className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
           </button>
           <button
             onClick={() => setViewMode('analytics')}
             className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${viewMode === 'analytics' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
           >
             <PieChart size={16} /> Cash Flow
             {viewMode === 'analytics' && <div className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
           </button>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {viewMode === 'activity' && (
            <Transactions 
              transactions={state.transactions} 
              accounts={state.accounts} 
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          
          {viewMode === 'favorites' && (
             <Transactions 
               transactions={state.transactions} 
               accounts={state.accounts} 
               onToggleFavorite={handleToggleFavorite}
               showFavoritesOnly={true}
             />
          )}
          
          {viewMode === 'analytics' && (
            <Analytics transactions={state.transactions} />
          )}
        </div>
        
        <div className="h-10" /> {/* Spacer */}
      </main>

      {/* Add Transaction Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New Transaction"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              className={`py-2 rounded-lg text-sm font-medium transition-colors ${newTransaction.type === TransactionType.DEBIT ? 'bg-rose-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}
              onClick={() => setNewTransaction({ ...newTransaction, type: TransactionType.DEBIT })}
            >
              Expense
            </button>
            <button
              className={`py-2 rounded-lg text-sm font-medium transition-colors ${newTransaction.type === TransactionType.CREDIT ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}
              onClick={() => setNewTransaction({ ...newTransaction, type: TransactionType.CREDIT })}
            >
              Income
            </button>
          </div>

          <Input 
            label="Amount (₹)" 
            type="number" 
            placeholder="0.00" 
            value={newTransaction.amount || ''} 
            onChange={e => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })}
            autoFocus
          />

          <Input 
            label="Description" 
            placeholder="What is this for?" 
            value={newTransaction.description || ''} 
            onChange={e => setNewTransaction({ ...newTransaction, description: e.target.value })}
          />

          <Select 
            label="Category"
            value={newTransaction.category}
            onChange={e => setNewTransaction({ ...newTransaction, category: e.target.value })}
          >
            {(newTransaction.type === TransactionType.DEBIT ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>

          <Select 
            label="Account"
            value={newTransaction.accountId}
            onChange={e => setNewTransaction({ ...newTransaction, accountId: e.target.value })}
          >
            {state.accounts.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </Select>

          <Input 
            label="Date" 
            type="date" 
            value={newTransaction.date} 
            onChange={e => setNewTransaction({ ...newTransaction, date: e.target.value })}
          />

          <div className="pt-4">
            <Button fullWidth onClick={handleAddTransaction}>
              Save Transaction
            </Button>
          </div>
        </div>
      </Modal>

      {/* Profile Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Profile Settings"
      >
        <div className="space-y-6">
            <div className="flex justify-center">
                <ImageUpload 
                    currentImage={user.?avatar} 
                    onImageSelected={(img) => setUser({ ...user, avatar: img })}
                    label="Change Photo"
                />
            </div>
            
            <Input 
                label="Full Name"
                value={user.n?ame}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
            
             <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Smartphone className="text-zinc-400" size={20} />
                    <div>
                        <p className="text-sm font-medium text-white">SMS Automation</p>
                        <p className="text-xs text-zinc-500">{smsPermission === 'granted' ? 'Active' : 'Disabled'}</p>
                    </div>
                </div>
                {smsPermission !== 'granted' ? (
                     <button onClick={() => setShowSmsModal(true)} className="text-xs text-primary hover:underline">Enable</button>
                ) : (
                    <button onClick={() => setSmsPermission('denied')} className="text-xs text-zinc-500 hover:text-white">Disable</button>
                )}
            </div>
            
            <div className="pt-2 flex flex-col gap-3">
                <Button fullWidth onClick={handleUpdateProfile}>
                    Save Profile
                </Button>
                <Button fullWidth variant="outline" onClick={handleLogout} className="text-rose-500 border-rose-500/20 hover:bg-rose-500/10">
                    <LogOut size={16} className="mr-2" /> Sign Out
                </Button>
            </div>
        </div>
      </Modal>

      {/* Account Manager Modal */}
      <Modal
        isOpen={isAccountManagerOpen}
        onClose={() => {
            setIsAccountManagerOpen(false);
            setEditingAccount(null);
        }}
        title={editingAccount ? "Edit Account" : "Manage Accounts"}
      >
         {!editingAccount ? (
             <div className="space-y-4">
                 <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                     {state.accounts.map(acc => (
                         <div key={acc.id} className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800 flex items-center justify-center">
                                     {acc.avatar ? <img src={acc.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full" style={{ backgroundColor: acc.color }} />}
                                 </div>
                                 <span className="font-medium text-white">{acc.name}</span>
                             </div>
                             <div className="flex gap-2">
                                 <button onClick={() => setEditingAccount(acc)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg">
                                     <Pencil size={16} />
                                 </button>
                                 <button onClick={() => handleDeleteAccount(acc.id)} className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg">
                                     <Trash2 size={16} />
                                 </button>
                             </div>
                         </div>
                     ))}
                 </div>
                 <Button fullWidth onClick={() => setEditingAccount({ color: '#8b5cf6' })}>
                     <Plus size={16} className="mr-2" /> Add New Account
                 </Button>
             </div>
         ) : (
             <div className="space-y-4">
                 <div className="flex justify-center mb-4">
                     <ImageUpload 
                        currentImage={editingAccount.avatar}
                        onImageSelected={(img) => setEditingAccount({ ...editingAccount, avatar: img })}
                        label="Account Image"
                        shape="rect"
                     />
                 </div>
                 
                 <Input 
                    label="Account Name"
                    value={editingAccount.name || ''}
                    onChange={(e) => setEditingAccount({ ...editingAccount, name: e.target.value })}
                 />
                 
                 <div className="grid grid-cols-2 gap-4">
                     <Input 
                        label="Initial Balance"
                        type="number"
                        value={editingAccount.initialBalance || 0}
                        onChange={(e) => setEditingAccount({ ...editingAccount, initialBalance: parseFloat(e.target.value) })}
                     />
                     <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Color</label>
                        <input 
                            type="color"
                            value={editingAccount.color}
                            onChange={(e) => setEditingAccount({ ...editingAccount, color: e.target.value })}
                            className="w-full h-[42px] rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer"
                        />
                     </div>
                 </div>
                 
                 <div className="flex gap-3 pt-4">
                     <Button fullWidth variant="secondary" onClick={() => setEditingAccount(null)}>
                         Cancel
                     </Button>
                     <Button fullWidth onClick={handleSaveAccount}>
                         Save Account
                     </Button>
                 </div>
             </div>
         )}
      </Modal>
    </div>
  );
};

export default App;
