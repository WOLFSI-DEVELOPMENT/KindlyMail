import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading = false,
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  // Pill shape as requested
  const shapeStyles = variant === 'icon' ? "rounded-full p-2" : "rounded-full px-6 py-3";

  const variants = {
    primary: "bg-black text-white hover:bg-stone-800 shadow-lg shadow-stone-200 hover:shadow-xl",
    secondary: "bg-stone-100 text-stone-900 hover:bg-stone-200 border border-transparent",
    ghost: "bg-transparent text-stone-500 hover:text-stone-900 hover:bg-stone-50",
    icon: "bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-black border border-stone-200"
  };

  return (
    <button 
      className={`${baseStyles} ${shapeStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Thinking...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};