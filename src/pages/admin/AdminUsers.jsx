import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/organisms/Sidebar';
import ErrorBanner from '../../components/molecules/ErrorBanner';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/users')
      .then(res => {
        const data = res.data;
        if (Array.isArray(data)) setUsers(data);
        else if (data?.content) setUsers(data.content);
        else setUsers([]);
      })
      .catch(err => {
        const status = err.response?.status;
        if (status === 500) {
          setError('El servidor encontró un error al procesar la solicitud. Por favor, intenta más tarde.');
        } else if (status === 403) {
          setError('No tienes permisos para ver esta información.');
        } else {
          setError('No se pudieron cargar los usuarios. Intenta de nuevo.');
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-grow ml-64 p-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Usuarios</h1>
            <p className="text-gray-500 mt-1">
              {!isLoading && !error ? `${users.length} usuarios registrados.` : 'Gestión de usuarios del sistema.'}
            </p>
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
                onClick={() => { setIsLoading(true); setError(null); }}
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(u => (
                    <tr key={u.userId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-400">{u.userId}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{u.name} {u.lastName}</td>
                      <td className="px-6 py-4 text-gray-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {u.registeredAt ? new Date(u.registeredAt).toLocaleDateString('es-CL') : '—'}
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