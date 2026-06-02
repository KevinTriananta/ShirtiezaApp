import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  icon,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold uppercase tracking-widest transition-all duration-300 rounded-xl disabled:opacity-50 disabled:pointer-events-none active:scale-95';
  
  const variants = {
    primary: 'bg-black text-white hover:shadow-lg hover:shadow-black/20',
    secondary: 'bg-neutral-100 text-black hover:bg-neutral-200',
    outline: 'bg-white border border-neutral-200 text-neutral-600 hover:border-black hover:text-black',
    ghost: 'text-neutral-400 hover:text-black hover:bg-neutral-50',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-5 py-3 text-[11px]',
    lg: 'px-8 py-4 text-[12px]',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
    </button>
  );
}
