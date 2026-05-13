import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/organisms/Navbar';
import Footer from '../../components/organisms/Footer';
import Button from '../../components/atoms/Button';
import ProjectRow from '../../components/molecules/ProjectRow';
import ErrorBanner from '../../components/molecules/ErrorBanner';
import EmptyState from '../../components/molecules/EmptyState';
import api from '../../services/api';

const UserProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/projects?size=50&sort=createdAt,desc')
      .then(res => setProjects(res.data.content || []))
      .catch(() => setError('No se pudieron cargar tus proyectos. Intenta de nuevo.'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto space-y-6">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Mis proyectos</h1>
              <p className="text-gray-500 mt-1">Historial de todas tus landing pages generadas.</p>
            </div>
            <Link to="/planes">
              <Button variant="primary">+ Nueva landing</Button>
            </Link>
          </div>

          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse h-24 bg-white rounded-2xl border border-gray-100" />
              ))}
            </div>
          )}

          {!isLoading && error && <ErrorBanner message={error} />}

          {!isLoading && !error && projects.length === 0 && (
            <EmptyState
              message="No tienes proyectos todavía."
              actionLabel="Crear mi primera landing"
              actionTo="/planes"
            />
          )}

          {!isLoading && !error && projects.map(project => (
            <ProjectRow key={project.projectId} project={project} />
          ))}

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProjects;