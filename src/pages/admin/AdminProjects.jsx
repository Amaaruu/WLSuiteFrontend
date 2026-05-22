import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import Sidebar from '../../components/organisms/Sidebar';
import StatusBadge from '../../components/molecules/StatusBadge';
import ConfirmModal from '../../components/molecules/ConfirmModal';
import api from '../../services/api';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    api.get('/projects?size=500&sort=createdAt,desc')
      .then(res => setProjects(res.data.content || []))
      .catch(() => showToast('No se pudieron cargar los proyectos.', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleRequestDelete = (project) => {
    setProjectToDelete(project);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/projects/${projectToDelete.projectId}`);
      setProjects(prev => prev.filter(p => p.projectId !== projectToDelete.projectId));
      setConfirmOpen(false);
      setProjectToDelete(null);
      showToast(`Proyecto "${projectToDelete.projectName}" eliminado correctamente.`);
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        showToast('El proyecto no fue encontrado.', 'error');
      } else {
        showToast(err.response?.data?.message || 'No se pudo eliminar el proyecto.', 'error');
      }
      setConfirmOpen(false);
      setProjectToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (isDeleting) return;
    setConfirmOpen(false);
    setProjectToDelete(null);
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

      {/* Modal de confirmación */}
      {confirmOpen && (
        <ConfirmModal
          title={`¿Eliminar "${projectToDelete?.projectName}"?`}
          description="Esta acción eliminará permanentemente el proyecto y no se puede deshacer."
          confirmLabel="Sí, eliminar"
          onConfirm={handleConfirmDelete}
          onClose={handleCancelDelete}
          isLoading={isDeleting}
        />
      )}

      <main className="flex-grow ml-64 p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-gray-900">Gestión de Proyectos</h1>
          <p className="text-gray-500">
            {!loading
              ? `${projects.length} proyecto${projects.length !== 1 ? 's' : ''} registrado${projects.length !== 1 ? 's' : ''}.`
              : 'Cargando proyectos…'}
          </p>
        </header>

        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-10 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-3" />
              <p className="text-sm text-gray-400">Cargando proyectos…</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Proyecto</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Propietario</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
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
                              day: '2-digit', month: '2-digit', year: 'numeric',
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
                            onClick={() => handleRequestDelete(project)}
                            disabled={isDeleting && projectToDelete?.projectId === project.projectId}
                            title="Eliminar proyecto"
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-2 transition-colors disabled:opacity-40"
                          >
                            {isDeleting && projectToDelete?.projectId === project.projectId ? (
                              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              // Ícono SVG inline para no importar Trash2 dos veces si ya está en el bundle
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14H6L5 6"/>
                                <path d="M10 11v6M14 11v6"/>
                                <path d="M9 6V4h6v2"/>
                              </svg>
                            )}
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