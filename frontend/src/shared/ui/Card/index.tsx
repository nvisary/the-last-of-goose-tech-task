import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 p-8 ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};
