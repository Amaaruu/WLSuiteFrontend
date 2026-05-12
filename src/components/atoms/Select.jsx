import React from 'react';

const Select = ({ id, name, value, onChange, children, error, className = '', ...props }) => (
  <select
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all bg-gray-50/50 focus:bg-white
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-sapphire-500 focus:ring-sapphire-200'}
    ${className}`}
    {...props}
  >
    {children}
  </select>
);

export default Select;