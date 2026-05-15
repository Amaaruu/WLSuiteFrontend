import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/organisms/Sidebar';
import ErrorBanner from '../../components/molecules/ErrorBanner';
import api from '../../services/api';

const ConfirmModal = ({ isOpen, title, message, confirmLabel, confirmClass, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-sm mx-4">
        <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  const [modal, setModal] = useState({
    isOpen: false,
    type: null,
    userId: null,
    userName: '',
    currentRole: '',
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadUsers = () => {
    setIsLoading(true);
    setError(null);
    api.get('/users')
      .then(res => {
        const data = res.data;
        if (Array.isArray(data)) setUsers(data);
        else if (data?.content) setUsers(data.content);
        else setUsers([]);
      })
      .catch(err => {
        const status = err.response?.status;
        if (status === 500) setError('El servidor encontró un error. Por favor, intenta más tarde.');
        else if (status === 403) setError('No tienes permisos para ver esta información.');
        else setError('No se pudieron cargar los usuarios. Intenta de nuevo.');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const openDeleteModal = (user) => {
    setModal({ isOpen: true, type: 'delete', userId: user.userId, userName: `${user.name} ${user.lastName || ''}`.trim(), currentRole: user.role });
  };

  const openRoleModal = (user) => {
    setModal({ isOpen: true, type: 'role', userId: user.userId, userName: `${user.name} ${user.lastName || ''}`.trim(), currentRole: user.role });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null, userId: null, userName: '', currentRole: '' });
  };

  const handleDeleteConfirm = async () => {
    const { userId, userName } = modal;
    closeModal();
    setActionLoading(userId);
    try {
      await api.delete(`/users/${userId}`);
      setUsers(prev => prev.filter(u => u.userId !== userId));
      showToast(`Usuario "${userName}" eliminado correctamente.`);
    } catch {
      showToast('No se pudo eliminar el usuario. Intenta de nuevo.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleConfirm = async () => {
    const { userId, userName, currentRole } = modal;
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    closeModal();
    setActionLoading(userId);
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u.userId === userId ? { ...u, role: newRole } : u));
      showToast(`Rol de "${userName}" cambiado a ${newRole === 'admin' ? 'Administrador' : 'Usuario'}.`);
    } catch {
      showToast('No se pudo cambiar el rol. Intenta de nuevo.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-grow ml-64 p-10">
        <div className="max-w-6xl mx-auto space-y-6">

          {toast && (
            <div className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-lg text-sm font-semibold border transition-all ${
              toast.type === 'error'
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-green-50 text-green-700 border-green-200'
            }`}>
              {toast.type === 'error' ? '✕ ' : '✓ '}{toast.message}
            </div>
          )}

          <ConfirmModal
            isOpen={modal.isOpen && modal.type === 'delete'}
            title="Eliminar usuario"
            message={`¿Estás seguro de que deseas eliminar a "${modal.userName}"? Esta acción no se puede deshacer.`}
            confirmLabel="Eliminar"
            confirmClass="bg-red-600 hover:bg-red-700"
            onConfirm={handleDeleteConfirm}
            onCancel={closeModal}
          />

          <ConfirmModal
            isOpen={modal.isOpen && modal.type === 'role'}
            title="Cambiar rol de usuario"
            message={`¿Cambiar el rol de "${modal.userName}" de ${modal.currentRole === 'admin' ? 'Administrador a Usuario' : 'Usuario a Administrador'}?`}
            confirmLabel="Confirmar cambio"
            confirmClass="bg-sapphire-600 hover:bg-sapphire-700"
            onConfirm={handleRoleConfirm}
            onCancel={closeModal}
          />

          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Usuarios</h1>
              <p className="text-gray-500 mt-1">
                {!isLoading && !error ? `${users.length} usuarios registrados.` : 'Gestión de usuarios del sistema.'}
              </p>
            </div>
            <button
              onClick={loadUsers}
              className="px-4 py-2 text-sm font-semibold text-sapphire-600 border border-sapphire-200 rounded-lg hover:bg-sapphire-50 transition-colors"
            >
              Actualizar
            </button>
          </div>

          {isLoading && (
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse h-16 bg-white rounded-xl border border-gray-100" />
              ))}
            </div>
          )}

          {!isLoading && error && (
            <div className="space-y-4">
              <ErrorBanner message={error} />
              <button
                onClick={loadUsers}
                className="px-4 py-2 text-sm font-semibold text-sapphire-600 border border-sapphire-200 rounded-lg hover:bg-sapphire-50 transition-colors"
              >
                Reintentar
              </button>
            </div>
          )}

          {!isLoading && !error && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">ID</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Nombre</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Rol</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Registro</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(u => (
                    <tr key={u.userId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-400 text-xs">{u.userId}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-sapphire-100 flex items-center justify-center text-sapphire-700 font-bold text-xs uppercase flex-shrink-0">
                            {u.name?.charAt(0) || '?'}
                          </div>
                          <span className="font-medium text-gray-900">{u.name} {u.lastName || ''}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {u.role === 'admin' ? 'Administrador' : 'Usuario'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {u.registeredAt ? new Date(u.registeredAt).toLocaleDateString('es-CL') : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openRoleModal(u)}
                            disabled={actionLoading === u.userId}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-sapphire-200 text-sapphire-600 hover:bg-sapphire-50 transition-colors disabled:opacity-40"
                          >
                            {u.role === 'admin' ? 'Quitar admin' : 'Dar admin'}
                          </button>
                          <button
                            onClick={() => openDeleteModal(u)}
                            disabled={actionLoading === u.userId}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                          >
                            {actionLoading === u.userId ? '...' : 'Eliminar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <p className="text-center text-gray-400 py-8 text-sm">No hay usuarios registrados.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;