import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/organisms/Navbar';
import Footer from '../../components/organisms/Footer';
import Button from '../../components/atoms/Button';
import ProjectRow from '../../components/molecules/ProjectRow';
import ErrorBanner from '../../components/molecules/ErrorBanner';
import EmptyState from '../../components/molecules/EmptyState';
import ConfirmModal from '../../components/molecules/ConfirmModal';
import api from '../../services/api';

const UserProjects = () => {
  const { user } = useContext(AuthContext);

  const [projects,   setProjects]   = useState([]);
  const [isLoading,  setIsLoading]  = useState(true);
  const [error,      setError]      = useState(null);
  const [confirmOpen,     setConfirmOpen]     = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting,      setIsDeleting]      = useState(false);
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };
  const loadProjects = useCallback(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    api.get('/projects?size=50&sort=createdAt,desc')
      .then(res => setProjects(res.data.content || []))
      .catch(() => setError('No se pudieron cargar tus proyectos. Intenta de nuevo.'))
      .finally(() => setIsLoading(false));
  }, [user]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);
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
      if (status === 403) {
        showToast('No tienes permisos para eliminar este proyecto.', 'error');
      } else if (status === 404) {
        showToast('El proyecto no fue encontrado.', 'error');
      } else {
        showToast('No se pudo eliminar el proyecto. Intenta de nuevo.', 'error');
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

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Toast de feedback */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-lg text-sm font-semibold border transition-all ${
            toast.type === 'error'
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-green-50 text-green-700 border-green-200'
          }`}
        >
          {toast.type === 'error' ? '✕ ' : '✓ '}{toast.message}
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {confirmOpen && (
        <ConfirmModal
          title="¿Eliminar este proyecto?"
          description={`Estás a punto de eliminar "${projectToDelete?.projectName}". Esta acción no se puede deshacer.`}
          confirmLabel="Sí, eliminar"
          onConfirm={handleConfirmDelete}
          onClose={handleCancelDelete}
          isLoading={isDeleting}
        />
      )}

      <main className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Cabecera */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Mis proyectos</h1>
              <p className="text-gray-500 mt-1">
                {!isLoading && !error
                  ? `${projects.length} proyecto${projects.length !== 1 ? 's' : ''} registrado${projects.length !== 1 ? 's' : ''}.`
                  : 'Historial de todas tus landing pages generadas.'}
              </p>
            </div>
            <Link to="/planes">
              <Button variant="primary">+ Nueva landing</Button>
            </Link>
          </div>

          {/* Estado de carga */}
          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse h-24 bg-white rounded-2xl border border-gray-100" />
              ))}
            </div>
          )}

          {/* Error */}
          {!isLoading && error && <ErrorBanner message={error} />}

          {/* Sin proyectos */}
          {!isLoading && !error && projects.length === 0 && (
            <EmptyState
              message="No tienes proyectos todavía."
              actionLabel="Crear mi primera landing"
              actionTo="/planes"
            />
          )}

          {/* Lista de proyectos */}
          {!isLoading && !error && projects.map(project => (
            <ProjectRow
              key={project.projectId}
              project={project}
              onDelete={handleRequestDelete}
              isDeleting={isDeleting && projectToDelete?.projectId === project.projectId}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProjects;