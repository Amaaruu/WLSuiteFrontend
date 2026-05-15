import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

const ConfirmModal = ({
  title       = '¿Estás seguro?',
  description = 'Esta acción no se puede deshacer.',
  confirmLabel = 'Eliminar',
  onConfirm,
  onClose,
  isLoading = false,
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
    onClick={(e) => { if (e.target === e.currentTarget && !isLoading) onClose(); }}
  >
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
      <div className="px-6 pt-6 pb-5 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-red-500" />
        </div>
        <h2 className="text-base font-black text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      </div>

      <div className="px-6 pb-6 flex items-center gap-3">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Eliminando...
            </>
          ) : confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;