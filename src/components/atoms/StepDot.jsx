// Punto individual del stepper. Muestra estado: completado, activo o pendiente.
import React from 'react';

const StepDot = ({ stepNumber, label, status }) => {
  const isCompleted = status === 'completed';
  const isActive    = status === 'active';

  const circleClass = isCompleted
    ? 'bg-blue-600 border-blue-600 text-white'
    : isActive
      ? 'bg-white border-blue-600 text-blue-600'
      : 'bg-white border-gray-200 text-gray-400';

  const labelClass = isActive
    ? 'text-gray-900 font-medium'
    : isCompleted
      ? 'text-gray-600'
      : 'text-gray-400';

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all duration-200 ${circleClass}`}>
        {isCompleted ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          stepNumber
        )}
      </div>
      <span className={`text-xs whitespace-nowrap ${labelClass}`}>{label}</span>
    </div>
  );
};

export default StepDot;