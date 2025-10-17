
import React from 'react';
import type { ButtonProps } from '../types';

const Button: React.FC<ButtonProps> = ({ onClick, children, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-3 
        font-semibold text-white 
        rounded-lg 
        shadow-md 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
        transition-all duration-300 ease-in-out
        transform hover:-translate-y-1 hover:shadow-lg
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
