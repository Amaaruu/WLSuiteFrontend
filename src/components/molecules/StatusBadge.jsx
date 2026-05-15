import React from 'react';

const STATUS_MAP = {
  ready: {
    label: 'Listo',
    classes: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
  },
  processing: {
    label: 'Procesando',
    classes: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    dot: 'bg-yellow-400',
  },
  failed: {
    label: 'Error en generación',
    classes: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
  },
};

const StatusBadge = ({ status }) => {
  const key = status?.toLowerCase() || 'processing';
  const config = STATUS_MAP[key] || STATUS_MAP['processing'];

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${config.classes}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;