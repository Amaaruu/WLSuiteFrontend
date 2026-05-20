import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/organisms/Sidebar';
import StatusBadge from '../../components/molecules/StatusBadge';
import api from '../../services/api';
import { ExternalLink, Trash2 } from 'lucide-react';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects?size=500&sort=createdAt,desc');
        setProjects(response.data.content || []);
      } catch (err) {
        console.error('[AdminProjects] Error al cargar proyectos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async (projectId, projectName) => {
    if (!window.confirm(`¿Eliminar el proyecto "${projectName}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(projectId);
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects(prev => prev.filter(p => p.projectId !== projectId));
      showToast(`Proyecto "${projectName}" eliminado correctamente.`);
    } catch (err) {
      showToast(
        err.response?.data?.message || 'No se pudo eliminar el proyecto.',
        'error'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      {/* Toast de feedback */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-lg text-sm font-semibold border ${
          toast.type === 'error'
            ? 'bg-red-50 text-red-700 border-red-200'
            : 'bg-green-50 text-green-700 border-green-200'
        }`}>
          {toast.type === 'error' ? '✕ ' : '✓ '}{toast.message}
        </div>
      )}

      <main className="flex-grow ml-64 p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-gray-900">Gestión de Proyectos</h1>
          <p className="text-gray-500">
            {!loading ? `${projects.length} proyecto${projects.length !== 1 ? 's' : ''} registrado${projects.length !== 1 ? 's' : ''}.` : 'Cargando proyectos…'}
          </p>
        </header>

        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-10 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-sapphire-600 border-t-transparent" />
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Proyecto</th>
                  <th className="px-6 py-4">Propietario</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                      No hay proyectos registrados.
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project.projectId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 max-w-[200px]">
                        <p className="truncate" title={project.projectName}>{project.projectName}</p>
                        {project.businessSector && (
                          <p className="text-xs text-gray-400 font-normal mt-0.5">{project.businessSector}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          {/* CORRECCIÓN: el DTO usa ownerName y ownerEmail, no project.user */}
                          <span className="text-sm font-semibold text-gray-900">
                            {project.ownerName || '—'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {project.ownerEmail || '—'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={project.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {project.createdAt
                          ? new Date(project.createdAt).toLocaleDateString('es-CL', {
                              day: '2-digit', month: '2-digit', year: 'numeric'
                            })
                          : '—'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {project.status === 'Ready' && project.signedUrl && (
                            <a
                              href={project.signedUrl}
                              target="_blank"
                              rel="noreferrer"
                              title="Ver landing"
                              className="text-sapphire-600 hover:bg-sapphire-50 rounded-lg p-2 transition-colors"
                            >
                              <ExternalLink size={18} />
                            </a>
                          )}
                          <button
                            onClick={() => handleDelete(project.projectId, project.projectName)}
                            disabled={deletingId === project.projectId}
                            title="Eliminar proyecto"
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-2 transition-colors disabled:opacity-40"
                          >
                            {deletingId === project.projectId
                              ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                              : <Trash2 size={18} />
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminProjects;