import React from 'react';

const PlanBadge = ({ planName, transactionId }) => (
  <div className="flex items-center gap-3 bg-sapphire-50 border border-sapphire-100 rounded-xl px-4 py-3">
    <span className="text-sapphire-600 text-lg">✦</span>
    <div>
      <p className="text-sm font-semibold text-sapphire-800">
        Plan {planName} activado
      </p>
      <p className="text-xs text-sapphire-500">Transacción #{transactionId}</p>
    </div>
  </div>
);

export default PlanBadge;