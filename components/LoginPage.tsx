import React from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBack }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    setTimeout(() => {
        onLoginSuccess();
    }, 800);
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
            <p className="text-stone-500 mb-10">Enter your details to access your workspace.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
                <Input label="Email" type="email" placeholder="name@company.com" required />
                <Input label="Password" type="password" placeholder="••••••••" required />
                
                <div className="flex justify-between items-center text-sm">
                    <label className="flex items-center gap-2 cursor-pointer text-stone-600">
                        <input type="checkbox" className="rounded border-stone-300 text-black focus:ring-black" />
                        Remember me
                    </label>
                    <a href="#" className="text-stone-900 font-medium hover:underline">Forgot password?</a>
                </div>

                <Button type="submit" className="w-full !py-4 text-base">Sign In</Button>
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
                onClick={() => onLoginSuccess()} // Shortcut for demo
                className="w-full flex items-center justify-center gap-3 bg-stone-50 border border-stone-200 text-stone-900 font-medium py-3.5 rounded-full hover:bg-stone-100 transition-all"
            >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                Sign in with Google
            </button>

            <p className="text-center mt-10 text-sm text-stone-500">
                Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onLoginSuccess(); }} className="text-stone-900 font-bold hover:underline">Sign up for free</a>
            </p>
        </div>
        
        <div className="mt-auto pt-6 text-xs text-stone-400">
            © 2024 KindlyMail AI Inc. Privacy Policy & Terms.
        </div>
      </div>

      {/* Right Side - Visuals */}
      <div className="hidden lg:flex w-1/2 bg-stone-900 relative overflow-hidden items-center justify-center p-20">
         {/* Aurora Background */}
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse delay-1000"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

         <div className="relative z-10 max-w-lg">
             <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-10 shadow-2xl">
                 <div className="flex gap-1 mb-6">
                    <Heart className="text-pink-400 fill-pink-400" size={24} />
                    <Heart className="text-pink-400 fill-pink-400" size={24} />
                    <Heart className="text-pink-400 fill-pink-400" size={24} />
                 </div>
                 <h2 className="text-3xl font-display font-bold text-white mb-6 leading-tight">
                    "KindlyMail changed how our design team works. We ship 10x faster now."
                 </h2>
                 <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-full overflow-hidden border-2 border-white/20">
                         <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="User" className="w-full h-full object-cover" />
                     </div>
                     <div>
                         <div className="text-white font-bold">Sarah Jenkins</div>
                         <div className="text-white/60 text-sm">Product Designer @ Linear</div>
                     </div>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};