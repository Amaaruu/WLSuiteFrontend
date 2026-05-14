import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/organisms/Sidebar';
import StatusBadge from '../../components/molecules/StatusBadge';
import ErrorBanner from '../../components/molecules/ErrorBanner';
import api from '../../services/api';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/projects?size=100&sort=createdAt,desc')
      .then(res => setProjects(res.data.content || []))
      .catch(() => setError('No se pudieron cargar los proyectos.'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-grow ml-64 p-10">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Proyectos</h1>
            <p className="text-gray-500 mt-1">Todos los proyectos generados por la IA.</p>
          </div>

          {isLoading && (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse h-20 bg-white rounded-2xl border border-gray-100" />
              ))}
            </div>
          )}

          {!isLoading && error && <ErrorBanner message={error} />}

          {!isLoading && !error && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">ID</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Proyecto</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Sector</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Estado</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Fecha</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">URL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {projects.map(p => (
                    <tr key={p.projectId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-400">{p.projectId}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{p.projectName}</p>
                        <p className="text-xs text-gray-400 truncate max-w-xs">{p.projectIdea}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{p.businessSector || '—'}</td>
                      <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                      <td className="px-6 py-4 text-gray-400">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString('es-CL') : '—'}
                      </td>
                      <td className="px-6 py-4">
                        {p.signedUrl
                          ? <a href={p.signedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">Ver</a>
                          : <span className="text-gray-300 text-xs">—</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {projects.length === 0 && (
                <p className="text-center text-gray-400 py-8 text-sm">No hay proyectos.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminProjects;