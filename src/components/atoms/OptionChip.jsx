import React from 'react';

const OptionChip = ({ label, description, selected, onClick, disabled = false }) => {
  const base = 'relative flex flex-col gap-0.5 px-4 py-3 rounded-xl border text-left transition-all duration-150 cursor-pointer';

  const state = disabled
    ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
    : selected
      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100'
      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50';

  return (
    <button
      type="button"
      className={`${base} ${state}`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      aria-pressed={selected}
    >
      {selected && (
        <span className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
      <span className="text-sm font-medium leading-tight pr-4">{label}</span>
      {description && (
        <span className="text-xs text-gray-400 leading-snug">{description}</span>
      )}
    </button>
  );
};

export default OptionChip;