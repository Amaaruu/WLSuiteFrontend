import React from 'react';
import Label from '../atoms/Label';
import LockIcon from '../atoms/LockIcon';

/**
 * Props:
 *   label        {string} — etiqueta del campo bloqueado
 *   requiredPlan {string} — nombre del plan que lo desbloquea (ej: "Intermedio")
 *   variant      {string} — "intermedio" | "premium"
 */
const VARIANT_STYLES = {
  intermedio: 'bg-blue-50 text-blue-700 border-blue-200',
  premium:    'bg-amber-50 text-amber-700 border-amber-200',
};

const LockedField = ({ label, requiredPlan, variant = 'intermedio' }) => (
  <div className="space-y-2">
    <Label className="text-gray-400">{label}</Label>

    <div className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-dashed border-gray-200 bg-gray-50/60 cursor-not-allowed select-none">
      <span className="text-sm text-gray-400 italic">
        Disponible en Plan {requiredPlan}
      </span>

      <span
        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${VARIANT_STYLES[variant] ?? VARIANT_STYLES.intermedio}`}
      >
        <LockIcon size={11} />
        Plan {requiredPlan}
      </span>
    </div>
  </div>
);

export default LockedField;