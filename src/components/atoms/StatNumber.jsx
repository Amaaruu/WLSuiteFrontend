import React from 'react';

const StatNumber = ({ value, label, sublabel }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-3xl font-extrabold text-gray-900">{value ?? '—'}</span>
    <span className="text-sm font-medium text-gray-700">{label}</span>
    {sublabel && <span className="text-xs text-gray-400">{sublabel}</span>}
  </div>
);

export default StatNumber;