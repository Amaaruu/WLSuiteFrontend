import React from 'react';

const ReviewRow = ({ label, value, onEdit, emptyText = 'No especificado' }) => {
  const displayValue = value && value !== '' ? value : emptyText;
  const isEmpty = !value || value === '';

  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
        <p className={`text-sm leading-relaxed ${isEmpty ? 'text-gray-300 italic' : 'text-gray-800'}`}>
          {displayValue}
        </p>
      </div>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="flex-shrink-0 text-xs text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2 transition-colors"
        >
          Editar
        </button>
      )}
    </div>
  );
};

export default ReviewRow;