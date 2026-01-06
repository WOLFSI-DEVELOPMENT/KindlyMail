import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Cloud, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-stone-900">
      
      {/* Subtle Background Decorations */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>

      <div className="relative z-10 text-center max-w-md mx-auto">
        <div className="flex justify-center mb-8 relative">
           <div className="w-24 h-24 bg-stone-50 rounded-[2rem] flex items-center justify-center border border-stone-100 shadow-sm rotate-3">
              <Cloud size={40} className="text-stone-300" />
           </div>
           <div className="absolute -right-4 -top-4 bg-stone-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg -rotate-6">
              404 Error
           </div>
        </div>

        <h1 className="font-display text-5xl font-bold mb-4 tracking-tight">
          Drifting in the clouds.
        </h1>
        
        <p className="text-stone-500 text-lg mb-10 leading-relaxed">
          We couldn't find the page you were looking for. It might have been moved, deleted, or never existed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
                onClick={() => navigate(-1)}
                className="px-6 py-3.5 rounded-full border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 hover:text-stone-900 transition-all flex items-center justify-center gap-2"
            >
                <ArrowLeft size={18} />
                Go Back
            </button>
            <button 
                onClick={() => navigate('/')}
                className="px-8 py-3.5 rounded-full bg-black text-white font-medium hover:bg-stone-800 shadow-lg shadow-stone-200 transition-all flex items-center justify-center gap-2"
            >
                <Home size={18} />
                Return Home
            </button>
        </div>
      </div>

      <div className="absolute bottom-8 text-xs text-stone-300 font-medium">
        KindlyMail AI
      </div>
    </div>
  );
};