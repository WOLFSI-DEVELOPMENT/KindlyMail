import React, { useState } from 'react';
import { Heart, ArrowLeft, Loader2, Mail } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { signInWithMagicLink, signInWithGoogle } from '../services/supabase';

interface LoginPageProps {
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const { error } = await signInWithMagicLink(email);
    
    setIsLoading(false);
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Check your email for the login link!' });
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
       setIsLoading(false);
       setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 sm:p-12 lg:p-20 relative">
        <button 
            onClick={onBack}
            className="absolute top-8 left-8 text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-2 text-sm font-medium"
        >
            <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            <div className="flex items-center gap-3 mb-10">
                <img src="https://iili.io/fNbamD7.md.png" alt="KindlyMail Logo" className="w-10 h-10 rounded-xl shadow-lg" />
                <span className="font-display font-bold text-2xl tracking-tight">KindlyMail</span>
            </div>

            <h1 className="font-display text-4xl font-bold text-stone-900 mb-2">Welcome back</h1>
            <p className="text-stone-500 mb-10">Enter your email to access your workspace.</p>

            {message && (
                <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleMagicLink} className="space-y-5">
                <Input 
                    label="Email" 
                    type="email" 
                    placeholder="name@company.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                />
                
                <Button type="submit" className="w-full !py-4 text-base" isLoading={isLoading} disabled={isLoading}>
                    <Mail size={18} className="mr-2" />
                    Send Magic Link
                </Button>
            </form>
            
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-stone-400">Or continue with</span>
                </div>
            </div>

            <button 
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-stone-50 border border-stone-200 text-stone-900 font-medium py-3.5 rounded-full hover:bg-stone-100 transition-all disabled:opacity-50"
            >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                Sign in with Google
            </button>
        </div>
        
        <div className="mt-auto pt-6 text-xs text-stone-400">
            © 2026 KindlyMail AI Inc. Privacy Policy & Terms.
        </div>
      </div>

      {/* Right Side - Visuals */}
      <div className="hidden lg:flex w-1/2 bg-stone-900 relative overflow-hidden items-center justify-center p-20">
         {/* Aurora Background */}
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse delay-1000"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

         <div className="relative z-10 max-w-lg">
             <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-12 shadow-2xl text-center">
                 <div className="flex justify-center gap-1 mb-8">
                    <Heart className="text-pink-400 fill-pink-400" size={24} />
                 </div>
                 <h2 className="text-3xl font-display font-medium text-white mb-8 leading-tight italic">
                    "Design is the silent ambassador of your brand."
                 </h2>
                 <div className="flex flex-col items-center gap-2">
                     <div className="w-12 h-1 bg-white/20 rounded-full"></div>
                     <div className="text-white font-bold tracking-wide uppercase text-sm">Paul Rand</div>
                     <div className="text-white/60 text-xs">Modernist Graphic Designer</div>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};