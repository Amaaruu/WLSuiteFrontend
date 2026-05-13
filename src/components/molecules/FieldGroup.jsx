import React from 'react';

const FieldGroup = ({ title, description, children, className = '' }) => {
  return (
    <fieldset className={`space-y-4 ${className}`}>
      {(title || description) && (
        <div className="space-y-0.5">
          {title && (
            <legend className="text-sm font-semibold text-gray-700">{title}</legend>
          )}
          {description && (
            <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-3">
        {children}
      </div>
    </fieldset>
  );
};

export default FieldGroup;