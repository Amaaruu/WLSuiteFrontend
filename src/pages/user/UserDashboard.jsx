import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/organisms/Navbar';
import Footer from '../../components/organisms/Footer';
import Button from '../../components/atoms/Button';
import ProjectRow from '../../components/molecules/ProjectRow';
import ErrorBanner from '../../components/molecules/ErrorBanner';
import EmptyState from '../../components/molecules/EmptyState';
import api from '../../services/api';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects,  setProjects]  = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    api.get('/projects', { params: { size: 5, page: 0, sort: 'createdAt,desc' } })
      .then(res => setProjects(res.data.content || []))
      .catch(() => setError('No se pudieron cargar tus proyectos.'))
      .finally(() => setIsLoading(false));
  }, [user]);

  const lastProject = projects[0] || null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Hola, {user?.name} 👋</h1>
            <p className="text-gray-500 mt-1">Desde aquí gestionas tus landing pages.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/planes">
              <div className="bg-blue-600 hover:bg-blue-700 transition-colors text-white p-6 rounded-2xl cursor-pointer h-full">
                <p className="text-sm font-medium opacity-80 mb-1">Crear nueva</p>
                <p className="text-xl font-bold">+ Nueva landing page</p>
              </div>
            </Link>
            <Link to="/dashboard/projects">
              <div className="bg-white border border-gray-200 hover:border-blue-300 transition-colors p-6 rounded-2xl cursor-pointer h-full">
                <p className="text-sm font-medium text-gray-400 mb-1">Ver historial</p>
                <p className="text-xl font-bold text-gray-800">Mis proyectos</p>
              </div>
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-800">Último proyecto</h2>
              {projects.length > 0 && (
                <Link to="/dashboard/projects" className="text-xs text-blue-600 hover:underline font-medium">
                  Ver todos →
                </Link>
              )}
            </div>

            {isLoading && <div className="animate-pulse h-16 bg-gray-100 rounded-xl" />}
            {!isLoading && error && <ErrorBanner message={error} />}
            {!isLoading && !error && lastProject && <ProjectRow project={lastProject} />}
            {!isLoading && !error && !lastProject && (
              <EmptyState
                message="Todavía no tienes proyectos."
                actionLabel="Crear mi primera landing"
                actionTo="/planes"
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;