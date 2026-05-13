import React, { useState, useEffect } from 'react';
import Sidebar from '../components/organisms/Sidebar';
import api from '../services/api';
import { Terminal, RefreshCw } from 'lucide-react';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/logs');
      setLogs(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-grow ml-64 p-10">
        <header className="flex justify-between items-end mb-10 text-left">
          <div>
            <h1 className="text-3xl font-black text-sapphire-950 flex items-center gap-3">
              <Terminal className="text-sapphire-600" /> Historial de Eventos
            </h1>
            <p className="text-gray-500">Monitoreo de actividad del sistema.</p>
          </div>
          <button onClick={fetchLogs} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Actualizar
          </button>
        </header>

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
                {logs.map((log) => (
                  <tr key={log.logId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-sapphire-700">{log.eventType}</td>
                    <td className="px-6 py-4 text-gray-600">{log.userEmail}</td>
                    <td className="px-6 py-4"><code className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-500">{log.ipClient}</code></td>
                    <td className="px-6 py-4 text-gray-400">{new Date(log.eventAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLogs;