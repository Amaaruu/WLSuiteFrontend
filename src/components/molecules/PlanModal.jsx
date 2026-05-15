import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

const PlanModal = ({ plan, onSave, onClose, isSaving, error }) => {
  const isEditing = !!plan;

  const [form, setForm] = useState({
    name:        '',
    description: '',
    price:       '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Precarga datos al editar
  useEffect(() => {
    if (plan) {
      setForm({
        name:        plan.name        || '',
        description: plan.description || '',
        price:       plan.price       != null ? String(plan.price) : '',
      });
    }
  }, [plan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim() || form.name.trim().length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres.';
    }
    if (!form.description.trim()) {
      errors.description = 'La descripción es obligatoria.';
    }
    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      errors.price = 'El precio debe ser un número positivo.';
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    onSave({
      name:        form.name.trim(),
      description: form.description.trim(),
      price:       parseFloat(form.price),
    });
  };

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black text-gray-900">
              {isEditing ? 'Editar plan' : 'Nuevo plan'}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {isEditing
                ? `Modificando: ${plan.name}`
                : 'Completa los campos para crear un nuevo plan.'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 py-6 space-y-5">

            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nombre del plan
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Básico, Intermedio, Premium"
                disabled={isSaving}
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-gray-900 placeholder-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-sapphire-500 focus:border-transparent disabled:opacity-60 ${
                  validationErrors.name
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              />
              {validationErrors.name && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{validationErrors.name}</p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Descripción
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe brevemente qué incluye este plan..."
                rows={3}
                disabled={isSaving}
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-gray-900 placeholder-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-sapphire-500 focus:border-transparent resize-none disabled:opacity-60 ${
                  validationErrors.description
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              />
              {validationErrors.description && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{validationErrors.description}</p>
              )}
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Precio (CLP)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">$</span>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  disabled={isSaving}
                  className={`w-full pl-8 pr-4 py-3 rounded-xl border text-sm font-medium text-gray-900 placeholder-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-sapphire-500 focus:border-transparent disabled:opacity-60 ${
                    validationErrors.price
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                />
              </div>
              {validationErrors.price && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{validationErrors.price}</p>
              )}
            </div>

            {/* Error API */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <span className="text-red-500 text-sm">⚠</span>
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-sapphire-600 rounded-xl hover:bg-sapphire-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={15} />
                  {isEditing ? 'Guardar cambios' : 'Crear plan'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanModal;