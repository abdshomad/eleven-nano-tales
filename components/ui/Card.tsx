
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const hoverStyles = onClick ? 'hover:shadow-lg hover:border-indigo-500 cursor-pointer' : '';
  
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 shadow-sm transition-all p-6 ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
};
