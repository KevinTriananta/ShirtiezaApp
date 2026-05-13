import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'amber';
  className?: string;
  icon?: React.ReactNode;
}

export default function Badge({ 
  children, 
  variant = 'neutral', 
  className = '',
  icon 
}: BadgeProps) {
  const variants = {
    success: 'bg-green-50 text-green-600',
    warning: 'bg-yellow-50 text-yellow-600',
    error: 'bg-red-50 text-red-600',
    neutral: 'bg-neutral-50 text-neutral-500',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${variants[variant]} ${className}`}>
      {icon}
      {children}
    </span>
  );
}
