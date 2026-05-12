import React from 'react';

const FormSection = ({ title, badge }) => (
  <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
    <h3 className="text-base font-semibold text-gray-800">{title}</h3>
    {badge && (
      <span className="text-xs font-medium text-sapphire-600 bg-sapphire-50 px-2 py-0.5 rounded-full border border-sapphire-100">
        {badge}
      </span>
    )}
  </div>
);

export default FormSection;