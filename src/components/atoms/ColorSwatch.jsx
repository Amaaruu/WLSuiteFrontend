
// Selector visual de color. Muestra el color real como preview.
import React from 'react';

// Mapa de valores semánticos a hex reales para el preview visual.
export const COLOR_HEX_MAP = {
  'azul-marino':    '#1e3a5f',
  'azul-cielo':     '#3b82f6',
  'verde-bosque':   '#166534',
  'verde-menta':    '#10b981',
  'terracota':      '#b5541c',
  'rojo-vibrante':  '#dc2626',
  'morado':         '#7c3aed',
  'rosa':           '#db2777',
  'negro':          '#111827',
  'gris-oscuro':    '#374151',
  'gris-neutro':    '#9ca3af',
  'blanco':         '#ffffff',
  'crema':          '#fef9f0',
  'amarillo-dorado':'#d97706',
  'naranja':        '#ea580c',
  'cian':           '#0891b2',
};

export const COLOR_LABELS = {
  'azul-marino':    'Azul marino',
  'azul-cielo':     'Azul cielo',
  'verde-bosque':   'Verde bosque',
  'verde-menta':    'Verde menta',
  'terracota':      'Terracota',
  'rojo-vibrante':  'Rojo vibrante',
  'morado':         'Morado',
  'rosa':           'Rosa',
  'negro':          'Negro',
  'gris-oscuro':    'Gris oscuro',
  'gris-neutro':    'Gris neutro',
  'blanco':         'Blanco',
  'crema':          'Crema',
  'amarillo-dorado':'Dorado',
  'naranja':        'Naranja',
  'cian':           'Cian',
};

const ColorSwatch = ({ colorKey, selected, onClick, disabled = false }) => {
  const hex   = COLOR_HEX_MAP[colorKey] || '#cccccc';
  const label = COLOR_LABELS[colorKey]  || colorKey;
  const isLight = ['blanco', 'crema'].includes(colorKey);

  return (
    <button
      type="button"
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      title={label}
      aria-label={`Color ${label}${selected ? ' (seleccionado)' : ''}`}
      className={`
        relative w-10 h-10 rounded-full border-2 transition-all duration-150 flex-shrink-0
        ${selected
          ? 'border-blue-500 scale-110 shadow-md'
          : 'border-transparent hover:border-gray-300 hover:scale-105'
        }
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
        ${isLight ? 'border border-gray-200' : ''}
      `}
      style={{ backgroundColor: hex }}
    >
      {selected && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-4 h-4 drop-shadow"
            style={{ color: isLight ? '#374151' : '#ffffff' }}
            fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </button>
  );
};

export default ColorSwatch;