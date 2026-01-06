import React, { useState } from 'react';
import { Heart, ArrowLeft, Loader2, Mail, Lock, User, Ghost } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { signInWithEmailPassword, signUpWithEmailPassword } from '../services/supabase';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (isSignUp) {
        const { error } = await signUpWithEmailPassword(email, password);
        setIsLoading(false);
        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Account created! Please check your email to confirm.' });
            setIsSignUp(false);
        }
    } else {
        const { data, error } = await signInWithEmailPassword(email, password);
        setIsLoading(false);
        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            // Success - Redirect to App, which will handle onboarding check
            navigate('/app');
        }
    }
  };

  const handleGuestLogin = () => {
      // Simulate a login for demo purposes since Auth might be flaky in preview
      localStorage.setItem('kindlymail_guest', 'true');
      localStorage.removeItem('kindlymail_onboarded'); // Force onboarding for guest
      navigate('/onboarding');
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 sm:p-12 lg:p-20 relative">
        <button 
            onClick={() => navigate('/')}
            className="absolute top-8 left-8 text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-2 text-sm font-medium"
        >
            <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            <div className="flex items-center gap-3 mb-10">
                <img src="https://iili.io/fNbamD7.md.png" alt="KindlyMail Logo" className="w-10 h-10 rounded-xl shadow-lg" />
                <span className="font-display font-bold text-2xl tracking-tight">KindlyMail</span>
            </div>

            <h1 className="font-display text-4xl font-bold text-stone-900 mb-2">
                {isSignUp ? 'Create Account' : 'Welcome back'}
            </h1>
            <p className="text-stone-500 mb-10">
                {isSignUp ? 'Get started with your free account.' : 'Enter your details to access your workspace.'}
            </p>

            {message && (
                <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <Input 
                    label="Email" 
                    type="email" 
                    placeholder="name@company.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                />
                
                <div className="space-y-2">
                    <Input 
                        label="Password" 
                        type="password" 
                        placeholder="••••••••" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                
                <Button type="submit" className="w-full !py-4 text-base" isLoading={isLoading} disabled={isLoading}>
                    {isSignUp ? <User size={18} className="mr-2" /> : <Lock size={18} className="mr-2" />}
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                </Button>
            </form>
            
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-stone-400">Or try demo mode</span>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {/* Guest / Demo Button */}
                <button 
                    type="button"
                    onClick={handleGuestLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-dashed border-stone-300 text-stone-500 font-medium py-3.5 rounded-full hover:bg-stone-50 hover:text-stone-900 hover:border-stone-400 transition-all"
                >
                    <Ghost size={18} />
                    Continue as Guest
                </button>
            </div>

            <div className="mt-8 text-center text-sm">
                <span className="text-stone-500">
                    {isSignUp ? "Already have an account? " : "Don't have an account? "}
                </span>
                <button 
                    type="button"
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setMessage(null);
                        setEmail('');
                        setPassword('');
                    }}
                    className="font-bold text-stone-900 hover:underline"
                >
                    {isSignUp ? "Sign In" : "Sign Up"}
                </button>
            </div>
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