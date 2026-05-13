// Toggle on/off para activar o desactivar secciones de la landing.
import React from 'react';

const SectionToggle = ({ label, description, active, locked, onToggle }) => {
  return (
    <div className={`
      flex items-start justify-between gap-4 p-4 rounded-xl border transition-all
      ${locked
        ? 'bg-gray-50 border-gray-100 opacity-70'
        : active
          ? 'bg-blue-50 border-blue-200'
          : 'bg-white border-gray-200'
      }
    `}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${active ? 'text-blue-800' : 'text-gray-700'}`}>
            {label}
          </span>
          {locked && (
            <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
              Siempre activa
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5 leading-snug">{description}</p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={active}
        disabled={locked}
        onClick={onToggle}
        className={`
          relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200
          ${locked ? 'bg-blue-400 cursor-not-allowed' : active ? 'bg-blue-600 cursor-pointer' : 'bg-gray-200 cursor-pointer'}
        `}
      >
        <span className={`
          absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm
          transition-transform duration-200
          ${active ? 'translate-x-5' : 'translate-x-0'}
        `} />
      </button>
    </div>
  );
};

export default SectionToggle;