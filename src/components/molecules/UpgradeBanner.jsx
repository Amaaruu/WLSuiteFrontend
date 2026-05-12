// src/components/molecules/UpgradeBanner.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Props:
 *   planLevel {number} — nivel numérico del plan actual (1=Básico, 2=Intermedio, 3=Premium)
 */
const MESSAGES = {
  1: {
    nextPlan: 'Intermedio',
    text: 'Actualiza al Plan Intermedio para desbloquear el tono de comunicación, paleta de colores y estilo visual de tu landing.',
  },
  2: {
    nextPlan: 'Premium',
    text: 'Actualiza al Plan Premium para desbloquear el nivel de animación y todas las opciones avanzadas.',
  },
};

const UpgradeBanner = ({ planLevel }) => {
  const navigate = useNavigate();
  const config = MESSAGES[planLevel];

  // No mostrar si es Premium (nivel 3) o si no hay config
  if (!config) return null;

  return (
    <div className="flex items-start gap-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl px-5 py-4">
      <span className="text-2xl flex-shrink-0" aria-hidden="true">✨</span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-800 mb-0.5">
          Desbloquea más funciones con el Plan {config.nextPlan}
        </p>
        <p className="text-xs text-amber-700 leading-relaxed">
          {config.text}
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate('/planes')}
        className="flex-shrink-0 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 transition-colors px-3 py-1.5 rounded-lg"
      >
        Ver planes
      </button>
    </div>
  );
};

export default UpgradeBanner;