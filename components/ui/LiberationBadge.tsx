import React from 'react';

interface LiberationBadgeProps {
  className?: string;
  label: string;
}

export function LiberationBadge({ className = '', label }: LiberationBadgeProps) {
  return (
    <div 
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full 
        text-xs font-medium bg-gradient-to-r from-red-500/80 to-yellow-500/80
        text-white shadow-sm
        ${className}
      `}
    >
      <span className="mr-1 opacity-80">★</span>
      {label}
      <span className="ml-1 opacity-80">★</span>
    </div>
  );
} 