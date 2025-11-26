import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={`
            w-full px-4 py-3 rounded-lg border-2 
            bg-gray-50 focus:bg-white
            transition-colors duration-200
            focus:outline-none focus:ring-0
            ${error 
              ? 'border-red-500 text-red-900 placeholder-red-300 focus:border-red-500' 
              : 'border-gray-200 text-gray-900 focus:border-blue-500'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 ml-1 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};
