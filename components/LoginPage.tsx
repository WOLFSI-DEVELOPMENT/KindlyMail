import React, { useState, useEffect, useRef } from 'react';
import { Heart, ArrowLeft, ArrowUp, Loader2, Mail, Lock, User, Ghost, Check, Image as ImageIcon, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { signInWithEmailPassword, signUpWithEmailPassword } from '../services/supabase';

// Add Google Type declaration
declare global {
  interface Window {
    google: any;
  }
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  // Animation States
  const [showUserMessage, setShowUserMessage] = useState(false);
  const [showAiMessage, setShowAiMessage] = useState(false);
  const [typingText, setTypingText] = useState("");
  const fullTypingText = "Make the logo larger and add more whitespace...";

  // Google Sign In Logic
  useEffect(() => {
    // JWT Decoder
    const parseJwt = (token: string) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    const handleGoogleResponse = (response: any) => {
        setIsLoading(true);
        const userObject = parseJwt(response.credential);
        
        if (userObject) {
            // Save Google User to LocalStorage (Simulating Session)
            localStorage.setItem('kindlymail_google_user', JSON.stringify({
                id: userObject.sub,
                email: userObject.email,
                name: userObject.name,
                picture: userObject.picture
            }));
            
            // Clear onboarding flag for existing users or force for new? 
            // For simplicity, we assume they need to onboard if not set.
            navigate('/app');
        } else {
            setMessage({ type: 'error', text: 'Failed to sign in with Google.' });
        }
        setIsLoading(false);
    };

    if (window.google && googleBtnRef.current) {
        window.google.accounts.id.initialize({
            client_id: "14206322756-1mqhu0ecati5kbuvcapdttsutb0v51lr.apps.googleusercontent.com",
            callback: handleGoogleResponse
        });

        window.google.accounts.id.renderButton(
            googleBtnRef.current,
            { theme: "outline", size: "large", width: "100%", text: isSignUp ? "signup_with" : "signin_with", shape: "pill" }
        );
    }
  }, [navigate, isSignUp]);

  useEffect(() => {
    // Sequence the chat bubbles
    const userMsgTimer = setTimeout(() => setShowUserMessage(true), 500);
    const aiMsgTimer = setTimeout(() => setShowAiMessage(true), 1500);

    // Typing effect loop
    let currentIndex = 0;
    let isDeleting = false;
    let typingInterval: ReturnType<typeof setTimeout>;

    const typeLoop = () => {
        if (!isDeleting && currentIndex <= fullTypingText.length) {
            setTypingText(fullTypingText.slice(0, currentIndex));
            currentIndex++;
            typingInterval = setTimeout(typeLoop, 50 + Math.random() * 50);
        } else if (isDeleting && currentIndex >= 0) {
            setTypingText(fullTypingText.slice(0, currentIndex));
            currentIndex--;
            typingInterval = setTimeout(typeLoop, 30);
        } else {
            // Switch direction
            isDeleting = !isDeleting;
            // Pause at ends
            if (!isDeleting) {
                 // Just finished deleting, start typing
                 currentIndex = 0;
                 typingInterval = setTimeout(typeLoop, 500);
            } else {
                 // Just finished typing, pause before deleting
                 typingInterval = setTimeout(typeLoop, 3000);
            }
        }
    };

    // Start typing after AI message appears
    const startTypingTimer = setTimeout(() => {
        typeLoop();
    }, 2500);

    return () => {
        clearTimeout(userMsgTimer);
        clearTimeout(aiMsgTimer);
        clearTimeout(startTypingTimer);
        clearTimeout(typingInterval);
    };
  }, []);

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
    <div className="min-h-screen w-full flex bg-white font-sans text-stone-900">
      <style>{`
        @keyframes float-y {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        .animate-float-y {
            animation: float-y 8s ease-in-out infinite;
        }
        @keyframes blob-pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
            50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.7; }
        }
        .animate-blob {
            animation: blob-pulse 10s ease-in-out infinite;
        }
      `}</style>
      
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 sm:p-12 lg:p-20 relative bg-white z-10">
        <button 
            onClick={() => navigate('/')}
            className="absolute top-8 left-8 text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-2 text-sm font-medium"
        >
            <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            <div className="flex items-center gap-3 mb-12">
                <img src="https://iili.io/fNbamD7.md.png" alt="KindlyMail Logo" className="w-10 h-10 rounded-xl shadow-lg" />
                <span className="font-display font-bold text-2xl tracking-tight">KindlyMail</span>
            </div>

            <div className="mb-10">
                <h1 className="font-display text-4xl md:text-5xl font-bold text-stone-900 mb-4 tracking-tight">
                    {isSignUp ? 'Create Account' : 'Welcome back'}
                </h1>
                <p className="text-lg text-stone-500">
                    {isSignUp ? 'Get started with your free account.' : 'Enter your details to access your workspace.'}
                </p>
            </div>

            {message && (
                <div className={`p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {message.type === 'success' ? <Check size={16} /> : null}
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input 
                    label="Email" 
                    type="email" 
                    placeholder="name@company.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="!bg-stone-50 !border-stone-200 focus:!bg-white focus:!border-stone-900 focus:!ring-0"
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
                        className="!bg-stone-50 !border-stone-200 focus:!bg-white focus:!border-stone-900 focus:!ring-0"
                    />
                </div>
                
                <Button type="submit" className="w-full !py-4 text-base rounded-2xl shadow-xl shadow-stone-200" isLoading={isLoading} disabled={isLoading}>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                </Button>
            </form>
            
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-stone-400 font-medium">Or continue with</span>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {/* Google Sign In Container */}
                <div className="w-full flex justify-center" ref={googleBtnRef}></div>

                {/* Guest / Demo Button */}
                <button 
                    type="button"
                    onClick={handleGuestLogin}
                    className="w-full flex items-center justify-center gap-3 bg-stone-50 border border-transparent text-stone-600 font-bold py-3.5 rounded-full hover:bg-stone-100 transition-all active:scale-[0.98]"
                >
                    <Ghost size={18} />
                    Continue as Guest
                </button>
            </div>

            <div className="mt-10 text-center text-sm">
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
        
        <div className="mt-auto pt-6 text-xs text-stone-400 font-medium">
            © 2026 KindlyMail AI Inc. Privacy Policy & Terms.
        </div>
      </div>

      {/* Right Side - Visuals */}
      <div className="hidden lg:flex w-1/2 bg-[#FAFAFA] relative items-center justify-center p-12 overflow-hidden">
         {/* Decorative Background */}
         <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-70"></div>
         
         {/* Gradient Glow */}
         <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-pink-100/50 rounded-full blur-3xl opacity-50 pointer-events-none animate-blob"></div>

         {/* Device Container - Clean, No Outline, Shorter */}
         <div className="relative w-full max-w-[480px] h-[640px] bg-white rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden z-10 border border-stone-100 animate-float-y">
            
            {/* Header */}
            <div className="h-20 flex items-center justify-between px-8 z-20 sticky top-0 bg-white/80 backdrop-blur-xl border-b border-stone-50">
               <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center">
                        <Heart size={18} className="text-stone-900" fill="currentColor" />
                   </div>
                   <div>
                       <span className="block text-sm font-bold text-stone-900 leading-none mb-1">KindlyMail</span>
                       <span className="block text-[10px] text-stone-400 font-medium">AI Copilot</span>
                   </div>
               </div>
               <div className="flex gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-stone-200"></div>
                   <div className="w-2 h-2 rounded-full bg-stone-200"></div>
                   <div className="w-2 h-2 rounded-full bg-stone-200"></div>
               </div>
            </div>

            {/* Chat Content */}
            <div className="flex-1 p-8 space-y-6 overflow-hidden flex flex-col justify-end pb-8">
               
               {/* User Message */}
               <div className={`flex flex-col items-end gap-2 transition-all duration-700 ease-out transform ${showUserMessage ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <div className="bg-stone-900 text-white px-6 py-4 rounded-[1.5rem] rounded-tr-sm text-sm font-medium shadow-xl shadow-stone-200/50 max-w-[90%] leading-relaxed">
                     Design a minimalist welcome email for "Lumina". Clean typography, lots of whitespace.
                  </div>
               </div>

               {/* AI Response with Mini Preview */}
               <div className={`flex flex-col items-start gap-2 transition-all duration-700 ease-out delay-100 transform ${showAiMessage ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <div className="flex items-center gap-2 ml-2">
                     <div className="w-4 h-4 bg-gradient-to-tr from-pink-500 to-orange-400 rounded-full animate-pulse"></div>
                     <span className="text-[10px] font-bold text-stone-400">Gemini • Just now</span>
                  </div>
                  
                  <div className="bg-white border border-stone-100 rounded-[1.5rem] rounded-tl-sm shadow-lg shadow-stone-100 max-w-[95%] w-full overflow-hidden group cursor-default">
                     <div className="px-6 py-5 border-b border-stone-50 bg-stone-50/30">
                        <p className="text-stone-600 text-sm leading-relaxed">
                            I've drafted a clean, monochrome layout focusing on contrast.
                        </p>
                     </div>
                     
                     <div className="p-2 bg-stone-50/50">
                        <div className="bg-white rounded-xl border border-stone-100 p-6 flex flex-col gap-4 transition-transform duration-500 group-hover:scale-[1.02]">
                            <div className="w-10 h-10 bg-stone-900 rounded-lg shadow-sm"></div>
                            <div className="space-y-2 mt-2">
                                <div className="h-4 w-3/4 bg-stone-100 rounded-full"></div>
                                <div className="h-4 w-1/2 bg-stone-100 rounded-full"></div>
                            </div>
                            <div className="h-10 w-32 bg-stone-900 rounded-full mt-4 shadow-md"></div>
                        </div>
                     </div>
                  </div>
               </div>

            </div>

            {/* Big Input Box */}
            <div className="p-6 bg-white z-20">
               <div className="w-full bg-stone-50 border border-stone-200 rounded-[2rem] p-5 flex flex-col gap-4 shadow-sm transition-all hover:shadow-md hover:border-stone-300 group">
                  <div className="h-20 text-stone-300 text-lg font-medium p-2 leading-relaxed">
                     <span className="text-stone-900">{typingText}</span>
                     <span className="animate-pulse text-pink-500 font-light">|</span>
                  </div>
                  
                  <div className="flex justify-between items-center px-1">
                     <div className="flex gap-2">
                         <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:border-stone-300 transition-colors cursor-pointer">
                             <ImageIcon size={18} />
                         </div>
                         <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:border-stone-300 transition-colors cursor-pointer">
                             <Globe size={18} />
                         </div>
                     </div>
                     <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white shadow-lg hover:bg-stone-800 hover:scale-105 transition-all cursor-pointer">
                         <ArrowUp size={24} />
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};