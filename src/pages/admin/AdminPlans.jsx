// src/pages/admin/AdminPlans.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, RefreshCw, Tag } from 'lucide-react';
import Sidebar from '../../components/organisms/Sidebar';
import PlanModal from '../../components/molecules/PlanModal';
import ConfirmModal from '../../components/molecules/ConfirmModal';
import ErrorBanner from '../../components/molecules/ErrorBanner';
import api from '../../services/api';

// ── Componente de fila de plan ─────────────────────────────────────────────
const PlanRow = ({ plan, onEdit, onDelete }) => (
  <tr className="hover:bg-gray-50 transition-colors group">
    <td className="px-6 py-4 text-sm text-gray-400 font-mono">#{plan.planId}</td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-sapphire-400 flex-shrink-0" />
        <span className="text-sm font-bold text-gray-900">{plan.name}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
      <p className="truncate" title={plan.description}>
        {plan.description || <span className="italic text-gray-300">Sin descripción</span>}
      </p>
    </td>
    <td className="px-6 py-4">
      <span className="text-sm font-black text-gray-900">
        ${Number(plan.price).toLocaleString('en-US')}
      </span>
      <span className="text-xs text-gray-400 ml-1">USD</span>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(plan)}
          title="Editar plan"
          className="p-2 rounded-lg text-sapphire-600 hover:bg-sapphire-50 transition-colors"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => onDelete(plan)}
          title="Eliminar plan"
          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </td>
  </tr>
);

// ── Página principal ───────────────────────────────────────────────────────
const AdminPlans = () => {
  const [plans,     setPlans]     = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState(null);

  const [modalOpen,   setModalOpen]   = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isSaving,    setIsSaving]    = useState(false);
  const [saveError,   setSaveError]   = useState(null);

  const [confirmOpen,  setConfirmOpen]  = useState(false);
  const [deletingPlan, setDeletingPlan] = useState(null);
  const [isDeleting,   setIsDeleting]   = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/plans');
      setPlans(res.data);
    } catch (err) {
      const status = err.response?.status;
      if (status === 403) setError('No tienes permisos para ver los planes.');
      else setError('No se pudieron cargar los planes. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setSaveError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setSaveError(null);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      if (editingPlan) {
        const res = await api.put(`/plans/${editingPlan.planId}`, formData);
        setPlans(prev =>
          prev.map(p => p.planId === editingPlan.planId ? res.data : p)
        );
        showToast(`Plan "${res.data.name}" actualizado correctamente.`);
      } else {
        const res = await api.post('/plans', formData);
        setPlans(prev => [...prev, res.data]);
        showToast(`Plan "${res.data.name}" creado correctamente.`);
      }
      setModalOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.description;
      setSaveError(msg || 'Ocurrió un error al guardar. Intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenDelete = (plan) => {
    setDeletingPlan(plan);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingPlan) return;
    setIsDeleting(true);
    try {
      await api.delete(`/plans/${deletingPlan.planId}`);
      setPlans(prev => prev.filter(p => p.planId !== deletingPlan.planId));
      showToast(`Plan "${deletingPlan.name}" eliminado.`, 'warning');
      setConfirmOpen(false);
      setDeletingPlan(null);
    } catch (err) {
      const msg = err.response?.data?.message;
      showToast(msg || 'No se pudo eliminar el plan. Puede tener transacciones activas.', 'error');
      setConfirmOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-grow ml-64 p-10">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* ── Header ──────────────────────────────────────────────────── */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Planes</h1>
              <p className="text-gray-500 mt-1">
                {!isLoading && !error
                  ? `${plans.length} plan${plans.length !== 1 ? 'es' : ''} activo${plans.length !== 1 ? 's' : ''}.`
                  : 'Gestión de planes de precios del sistema.'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchPlans}
                disabled={isLoading}
                title="Recargar planes"
                className="p-2.5 text-gray-400 hover:text-sapphire-600 hover:bg-sapphire-50 rounded-xl border border-gray-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              </button>

              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-2 px-5 py-2.5 bg-sapphire-600 hover:bg-sapphire-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-sapphire-600/20"
              >
                <Plus size={16} />
                Nuevo plan
              </button>
            </div>
          </div>

          {/* ── Error de carga ───────────────────────────────────────────── */}
          {error && <ErrorBanner message={error} />}

          {/* ── Skeleton de carga ───────────────────────────────────────── */}
          {isLoading && (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse h-16 bg-white rounded-xl border border-gray-100" />
              ))}
            </div>
          )}

          {/* ── Tabla de planes ──────────────────────────────────────────── */}
          {!isLoading && !error && (
            <>
              {plans.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Tag size={22} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No hay planes creados aún.</p>
                  <p className="text-sm text-gray-400 mt-1">Crea el primer plan haciendo clic en "Nuevo plan".</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide w-16">ID</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Nombre</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Descripción</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide w-36">Precio (USD)</th>
                        <th className="px-6 py-3 w-24" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {plans.map(plan => (
                        <PlanRow
                          key={plan.planId}
                          plan={plan}
                          onEdit={handleOpenEdit}
                          onDelete={handleOpenDelete}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {plans.length > 0 && (
                <div className="flex items-start gap-3 bg-sapphire-50 border border-sapphire-100 rounded-xl px-4 py-3">
                  <span className="text-sapphire-500 mt-0.5 flex-shrink-0">ℹ</span>
                  <p className="text-sm text-sapphire-700">
                    Los cambios de nombre afectan el matching visual del frontend. Los nombres reconocidos son{' '}
                    <strong>Básico</strong>, <strong>Intermedio</strong> y <strong>Premium</strong>.
                    Otros nombres mostrarán el diseño genérico de fallback.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ── Modal crear/editar ─────────────────────────────────────────────── */}
      {modalOpen && (
        <PlanModal
          plan={editingPlan}
          onSave={handleSave}
          onClose={() => !isSaving && setModalOpen(false)}
          isSaving={isSaving}
          error={saveError}
        />
      )}

      {/* ── Modal de confirmación de borrado ──────────────────────────────── */}
      {confirmOpen && (
        <ConfirmModal
          title={`¿Eliminar el plan "${deletingPlan?.name}"?`}
          description="Esta acción desactivará el plan en el sistema (borrado lógico). Las transacciones existentes no se verán afectadas."
          confirmLabel="Sí, eliminar"
          onConfirm={handleConfirmDelete}
          onClose={() => !isDeleting && setConfirmOpen(false)}
          isLoading={isDeleting}
        />
      )}

      {/* ── Toast de feedback ──────────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold transition-all duration-300 ${
            toast.type === 'error'
              ? 'bg-red-500 text-white'
              : toast.type === 'warning'
              ? 'bg-amber-500 text-white'
              : 'bg-gray-900 text-white'
          }`}
        >
          <span>
            {toast.type === 'error' ? '⚠' : toast.type === 'warning' ? '🗑' : '✓'}
          </span>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default AdminPlans;