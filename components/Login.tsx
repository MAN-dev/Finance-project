import React, { useState } from 'react';
import { Mail, ArrowRight, X, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { ImageUpload } from './ImageUpload';

interface LoginProps {
  onLogin: (user: User) => void;
}

// Simulated accounts that "exist" on the device
const DETECTED_GOOGLE_ACCOUNTS = [
  {
    id: 'g_1',
    name: 'Suhas K',
    email: 'suhas.dev@gmail.com',
    avatar: 'https://ui-avatars.com/api/?name=Suhas+K&background=0D8ABC&color=fff&rounded=true&bold=true'
  },
  {
    id: 'g_2',
    name: 'Dr.Cr Demo',
    email: 'demo@drcr.app',
    avatar: 'https://ui-avatars.com/api/?name=Dr+Cr+Demo&background=6d28d9&color=fff&rounded=true&bold=true'
  }
];

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerAvatar, setRegisterAvatar] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [showGoogleSelector, setShowGoogleSelector] = useState(false);

  const isRegistering = activeTab === 'register';

  const handleGoogleClick = () => {
    setShowGoogleSelector(true);
  };

  const selectGoogleAccount = (account: typeof DETECTED_GOOGLE_ACCOUNTS[0]) => {
    setLoading(true);
    setShowGoogleSelector(false);
    
    // Simulate network delay for auth
    setTimeout(() => {
      onLogin({
        id: account.id,
        name: account.name,
        email: account.email,
        avatar: account.avatar,
      });
      setLoading(false);
    }, 800);
  };

  const handleUseAnotherAccount = () => {
    setLoading(true);
    setShowGoogleSelector(false);
    setTimeout(() => {
        onLogin({
            id: `g_${Date.now()}`,
            name: 'New User',
            email: 'new.user@gmail.com',
            avatar: 'https://ui-avatars.com/api/?name=New+User&background=random&rounded=true&bold=true'
        });
        setLoading(false);
    }, 800);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setTimeout(() => {
      let name = email.split('@')[0];
      name = name.charAt(0).toUpperCase() + name.slice(1);
      
      const mockUser: User = {
        id: 'u_' + Date.now(),
        name: isRegistering && registerName ? registerName : name,
        email: email,
        avatar: isRegistering && registerAvatar ? registerAvatar : `https://ui-avatars.com/api/?name=${name}&background=14b8a6&color=fff`,
      };
      onLogin(mockUser);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-md z-10 space-y-8">
        <div className="text-center space-y-2">
          {/* Logo Box */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#18181b] border border-zinc-800 rounded-2xl mb-6 shadow-2xl relative overflow-hidden">
             <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-br from-rose-500/20 to-rose-600/20" />
             <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20" />
             <svg width="36" height="36" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M7 17L17 7" className="stroke-zinc-700" strokeWidth="2" />
                 <path d="M17 7H13" className="stroke-emerald-500" />
                 <path d="M17 7V11" className="stroke-emerald-500" />
                 <path d="M7 17H11" className="stroke-rose-500" />
                 <path d="M7 17V13" className="stroke-rose-500" />
             </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-rose-500">Dr.</span>
            <span className="text-emerald-500">Cr</span>
          </h1>
          <p className="text-zinc-400">Premium Financial Management</p>
        </div>

        <div className="bg-[#121212]/80 backdrop-blur-xl border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-zinc-800">
             <button
               onClick={() => setActiveTab('signin')}
               className={`flex-1 py-4 text-sm font-medium transition-colors relative ${activeTab === 'signin' ? 'text-white bg-white/5' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}`}
             >
               Sign In
               {activeTab === 'signin' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(109,40,217,0.5)]" />}
             </button>
             <button
               onClick={() => setActiveTab('register')}
               className={`flex-1 py-4 text-sm font-medium transition-colors relative ${activeTab === 'register' ? 'text-white bg-white/5' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}`}
             >
               Register
               {activeTab === 'register' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(109,40,217,0.5)]" />}
             </button>
          </div>

          <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                {isRegistering ? 'Create an account' : 'Welcome back'}
              </h2>

              <div className="space-y-4">
                {isRegistering ? (
                   <div className="flex justify-center mb-2">
                      <ImageUpload 
                        onImageSelected={setRegisterAvatar} 
                        currentImage={registerAvatar}
                        label="Add Photo"
                      />
                   </div>
                ) : (
                    <button 
                    onClick={handleGoogleClick}
                    disabled={loading}
                    className="w-full bg-white text-black hover:bg-zinc-200 font-semibold py-3 rounded-xl flex items-center justify-center space-x-3 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                        </svg>
                    )}
                    <span>Sign in with Google</span>
                    </button>
                )}

                {!isRegistering && (
                    <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-zinc-800"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-transparent text-zinc-500">Or continue with email</span>
                    </div>
                    </div>
                )}

                <form onSubmit={handleEmailLogin} className="space-y-4">
                  {isRegistering && (
                      <Input 
                        placeholder="Full Name" 
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                      />
                  )}
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-zinc-500" size={18} />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0B0B0B] border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-zinc-600 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                      required
                    />
                  </div>
                  <Button fullWidth type="submit" disabled={loading}>
                    {loading ? 'Processing...' : (
                      <span className="flex items-center">
                        {isRegistering ? 'Create Account' : 'Sign In'} <ArrowRight size={16} className="ml-2" />
                      </span>
                    )}
                  </Button>
                </form>
              </div>

               <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
                <p className="text-[10px] text-zinc-600 leading-relaxed">
                  By continuing, you agree to Dr.Cr's <a href="#" className="hover:text-zinc-400 underline">Terms of Service</a> and <a href="#" className="hover:text-zinc-400 underline">Privacy Policy</a>.
                </p>
              </div>
          </div>
        </div>
      </div>

      {/* Google Account Selector Modal (Simulation) */}
      {showGoogleSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white text-black w-full max-w-[400px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 scale-100">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6">
                    <svg viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                </div>
                <span className="font-medium text-lg text-gray-700">Sign in with Google</span>
              </div>
              <button 
                onClick={() => setShowGoogleSelector(false)} 
                className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 py-2">
              <div className="px-2 py-4">
                 <p className="text-gray-700 font-medium">Choose an account</p>
                 <p className="text-gray-500 text-sm">to continue to <span className="font-semibold text-primary">Dr.Cr</span></p>
              </div>

              <div className="flex flex-col gap-1 mb-2">
                {DETECTED_GOOGLE_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => selectGoogleAccount(acc)}
                    className="flex items-center gap-4 w-full p-3 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-lg transition-all text-left group"
                  >
                    <img src={acc.avatar} alt={acc.name} className="w-10 h-10 rounded-full border border-gray-200" />
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{acc.name}</span>
                      <span className="text-sm text-gray-500">{acc.email}</span>
                    </div>
                  </button>
                ))}
                
                <button
                    onClick={handleUseAnotherAccount}
                    className="flex items-center gap-4 w-full p-3 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-lg transition-all text-left group"
                >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-200">
                        <UserIcon size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">Use another account</span>
                    </div>
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                To continue, Google will share your name, email address, and profile picture with Dr.Cr. Before using this app, you can review Dr.Cr's <a href="#" className="text-blue-700 hover:underline">Privacy Policy</a> and <a href="#" className="text-blue-700 hover:underline">Terms of Service</a>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};