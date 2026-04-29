import React from 'react';

const TextArea = ({ id, placeholder, rows = 4, error, className = '', ...props }) => (
  <textarea
    id={id}
    rows={rows}
    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all bg-gray-50/50 focus:bg-white resize-none
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-sapphire-500 focus:ring-sapphire-200'}
    ${className}`}
    placeholder={placeholder}
    {...props}
  />
);

export default TextArea;