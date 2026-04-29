import React from 'react';

const Input = ({ type = 'text', id, placeholder, error, className = '', ...props }) => (
  <input
    type={type}
    id={id}
    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all bg-gray-50/50 focus:bg-white
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-sapphire-500 focus:ring-sapphire-200'}
    ${className}`}
    placeholder={placeholder}
    {...props}
  />
);

export default Input;