import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/organisms/Sidebar';
import api from '../../services/api';
import { Terminal, RefreshCw, AlertCircle } from 'lucide-react';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = () => {
    setLoading(true);
    setError(null);
    api.get('/logs/all')
      .then(res => {
        console.debug('[AdminLogs] Logs recibidos:', res.data?.length ?? 0);
        setLogs(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error(
          '[AdminLogs] Error al obtener logs:',
          err.response?.status,
          err.response?.data ?? err.message
        );

        setError(
          err.response?.status === 403
            ? 'Sin permisos para ver los logs. Verifica que tu sesión de administrador esté activa.'
            : err.response?.status === 401
            ? 'Sesión expirada. Por favor, inicia sesión nuevamente.'
            : `Error al cargar logs: ${err.response?.data?.message ?? err.message}`
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getEventBadgeClass = (eventType) => {
    const type = eventType?.toUpperCase() ?? '';

    if (type.includes('LOGIN'))   return 'bg-blue-100 text-blue-700';
    if (type.includes('REGISTER')) return 'bg-green-100 text-green-700';
    if (type.includes('DELETE'))  return 'bg-red-100 text-red-700';
    if (type.includes('CREATE') || type.includes('PROJECT')) return 'bg-purple-100 text-purple-700';

    return 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-grow ml-64 p-10">
        <div className="max-w-6xl mx-auto space-y-6">

          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                <Terminal className="text-sapphire-600" size={28} />
                Historial de Eventos
              </h1>

              <p className="text-gray-500 mt-1">
                {!loading && !error
                  ? `${logs.length} evento${logs.length !== 1 ? 's' : ''} registrado${logs.length !== 1 ? 's' : ''}.`
                  : 'Monitoreo de actividad del sistema.'
                }
              </p>
            </div>

            <button
              onClick={fetchLogs}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Actualizar
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">No se pudieron cargar los logs</p>
                <p className="text-red-500 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Evento</th>
                    <th className="px-6 py-4">Usuario</th>
                    <th className="px-6 py-4">IP Cliente</th>
                    <th className="px-6 py-4">Fecha</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50 text-sm">
                  {loading ? (
                    [...Array(4)].map((_, i) => (
                      <tr key={i}>
                        <td colSpan={4} className="px-6 py-4">
                          <div className="animate-pulse h-4 bg-gray-100 rounded w-full" />
                        </td>
                      </tr>
                    ))
                  ) : error ? null : logs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-gray-400 text-sm">
                        No hay eventos registrados aún. Los logs aparecerán aquí tras el primer login o registro en el sistema.
                      </td>
                    </tr>
                  ) : (
                    logs.map(log => (
                      <tr key={log.logId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getEventBadgeClass(log.eventType)}`}>
                            {log.eventType}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {log.userEmail}
                        </td>

                        <td className="px-6 py-4">
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-500">
                            {log.ipClient ?? '—'}
                          </code>
                        </td>

                        <td className="px-6 py-4 text-gray-400 text-xs">
                          {log.eventAt
                            ? new Date(log.eventAt).toLocaleString('es-CL', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : '—'
                          }
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminLogs;