import React from 'react';

const PlanFeatureItem = ({ feature }) => {
  const isObject  = typeof feature === 'object' && feature !== null;
  const text      = isObject ? feature.text      : feature;
  const included  = isObject ? feature.included  : true;
  const highlight = isObject ? feature.highlight : false;
  const dark      = isObject ? feature._dark     : false;

  if (!included) {
    return (
      <li className="flex items-center gap-3 py-0.5 opacity-35">
        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
        <span className="text-sm text-gray-400 line-through">{text}</span>
      </li>
    );
  }

  return (
    <li
      className={`flex items-center gap-3 py-0.5 rounded-lg transition-colors ${
        highlight && !dark ? 'bg-sapphire-50 -mx-2 px-2' : ''
      } ${highlight && dark ? 'bg-white/5 -mx-2 px-2' : ''}`}
    >
      <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
        <svg
          className={`w-5 h-5 ${
            dark
              ? highlight ? 'text-amber-400' : 'text-emerald-400'
              : highlight ? 'text-sapphire-600' : 'text-emerald-500'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <span
        className={`text-sm leading-relaxed ${
          dark
            ? highlight ? 'font-semibold text-white' : 'font-medium text-sapphire-200'
            : highlight ? 'font-semibold text-sapphire-800' : 'font-medium text-gray-700'
        }`}
      >
        {text}
        {highlight && (
          <span
            className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wide ${
              dark
                ? 'bg-amber-400/20 text-amber-300'
                : 'bg-sapphire-100 text-sapphire-700'
            }`}
          >
            {dark ? '★ Élite' : 'Exclusivo'}
          </span>
        )}
      </span>
    </li>
  );
};

export default PlanFeatureItem;