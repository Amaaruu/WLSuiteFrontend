// src/pages/ProjectResult.jsx
import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/organisms/Navbar';
import Footer from '../components/organisms/Footer';
import Button from '../components/atoms/Button';
import StatusBadge from '../components/molecules/StatusBadge';
import ProjectMetaCard from '../components/molecules/ProjectMetaCard';

const ProjectResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { project } = location.state || {};

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">?</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No hay proyecto para mostrar</h2>
            <p className="text-gray-500 mb-6">
              Esta página debe accederse después de generar una landing page.
            </p>
            <Button variant="primary" onClick={() => navigate('/planes')}>
              Crear mi primera landing
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isReady = project.status === 'Ready';
  const isFailed = project.status === 'Failed';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Header */}
          <div className="text-center space-y-3">
            <StatusBadge status={project.status} />
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              {isReady
                ? '¡Tu landing page está lista!'
                : isFailed
                ? 'Ocurrió un problema'
                : 'Generando tu landing...'}
            </h1>
            <p className="text-gray-500 text-lg">
              {isReady
                ? 'Revisa los detalles de tu proyecto y accede a tu página.'
                : isFailed
                ? 'La IA no pudo completar la generación. Puedes intentarlo de nuevo.'
                : 'La IA está trabajando en tu proyecto. Esto puede tomar un momento.'}
            </p>
          </div>

          {/* Tarjeta principal */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Nombre del proyecto */}
            <div className="px-8 py-6 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Proyecto</p>
              <h2 className="text-2xl font-bold text-gray-900">{project.projectName}</h2>
            </div>

            {/* Metadatos */}
            <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ProjectMetaCard
                label="Idea del negocio"
                value={project.projectIdea}
              />
              <ProjectMetaCard
                label="Call to Action"
                value={project.callToAction}
              />
              <ProjectMetaCard
                label="Sector"
                value={project.businessSector}
              />
              <ProjectMetaCard
                label="Tono de comunicación"
                value={project.communicationTone}
              />
            </div>

            {/* Ready — con URL */}
            {isReady && project.signedUrl && (
              <div className="px-8 py-6 bg-green-50 border-t border-green-100">
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">
                  Tu landing page
                </p>
                <a
                  href={project.signedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-700 font-semibold hover:underline break-all"
                >
                  {project.signedUrl}
                </a>
              </div>
            )}

            {/* Processing */}
            {!isReady && !isFailed && (
              <div className="px-8 py-6 bg-yellow-50 border-t border-yellow-100 flex items-center gap-3">
                <div className="animate-spin h-5 w-5 border-2 border-yellow-500 border-t-transparent rounded-full flex-shrink-0" />
                <p className="text-yellow-700 text-sm font-medium">
                  La IA sigue trabajando. Recibirás un correo cuando esté lista.
                </p>
              </div>
            )}

            {/* Failed */}
            {isFailed && (
              <div className="px-8 py-6 bg-red-50 border-t border-red-100">
                <p className="text-red-700 text-sm font-medium">
                  La generación falló. Nuestro equipo fue notificado. Puedes intentarlo de nuevo o contactar soporte.
                </p>
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isReady && project.signedUrl && (
              <a href={project.signedUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" className="w-full sm:w-auto px-8 py-3">
                  Ver mi landing page
                </Button>
              </a>
            )}

            {isFailed && (
              <Button
                variant="primary"
                className="w-full sm:w-auto px-8 py-3"
                onClick={() => navigate('/planes')}
              >
                Intentar de nuevo
              </Button>
            )}

            <Link to="/">
              <Button variant="secondary" className="w-full sm:w-auto px-8 py-3">
                Volver al inicio
              </Button>
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectResult;