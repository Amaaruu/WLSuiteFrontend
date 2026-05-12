import React, { useState, useEffect } from 'react';
import Sidebar from '../components/organisms/Sidebar';
import api from '../services/api';
import StatusBadge from '../components/molecules/StatusBadge';
import { ExternalLink, Trash2, Layout } from 'lucide-react';

const UserDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data.content || response.data);
      } catch (err) {
        console.error("Error al cargar proyectos:", err);
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
        <header className="mb-10 text-left">
          <h1 className="text-3xl font-black text-sapphire-950">Mis Proyectos</h1>
          <p className="text-gray-500">Gestiona tus landing pages generadas por IA.</p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-white rounded-2xl animate-pulse border border-gray-100"></div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
            <Layout className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-gray-900">No tienes proyectos aún</h3>
            <p className="text-gray-500 mb-6">Crea tu primera página en segundos.</p>
            <a href="/planes" className="inline-block bg-sapphire-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-sapphire-700 transition-all">
              Crear mi primera landing
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.projectId} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col transition-all hover:shadow-md text-left">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-gray-900 truncate pr-4">{project.projectName}</h3>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-grow">{project.projectIdea}</p>
                <div className="flex gap-2">
                  <a 
                    href={project.signedUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className={`flex-grow flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all ${
                      project.status === 'Ready' 
                        ? 'bg-sapphire-50 text-sapphire-700 hover:bg-sapphire-100' 
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed pointer-events-none'
                    }`}
                  >
                    <ExternalLink size={16} /> Ver Landing
                  </a>
                  <button className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;