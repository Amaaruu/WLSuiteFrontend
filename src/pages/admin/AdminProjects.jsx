import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/organisms/Sidebar';
import StatusBadge from '../../components/molecules/StatusBadge';
import api from '../../services/api';
import { ExternalLink, Trash2 } from 'lucide-react';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects?size=500');
        setProjects(response.data.content || response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-grow ml-64 p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-gray-900">Gestión de Proyectos</h1>
          <p className="text-gray-500">Supervisa todos los proyectos generados en la plataforma.</p>
        </header>

        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-10 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-sapphire-600 border-t-transparent"></div>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4">Proyecto</th>
                  <th className="px-6 py-4">Propietario</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project) => (
                  <tr key={project.projectId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 truncate max-w-[200px]">
                      {project.projectName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{project.user?.name || 'Usuario'}</span>
                        <span className="text-xs text-gray-500">{project.user?.email || 'Sin correo'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      {project.status === 'Ready' && (
                        <a href={project.signedUrl} target="_blank" rel="noreferrer" className="text-sapphire-600 hover:bg-sapphire-50 rounded-lg p-2 transition-colors">
                          <ExternalLink size={18} />
                        </a>
                      )}
                      <button className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-2 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminProjects;