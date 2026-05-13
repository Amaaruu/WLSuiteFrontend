import React from 'react';

const ErrorBanner = ({ message }) => (
  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-xl">
    <p className="text-red-700 text-sm">{message}</p>
  </div>
);

export default ErrorBanner;