import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/organisms/Navbar';
import Footer from '../components/organisms/Footer';
import Button from '../components/atoms/Button';
import StatusBadge from '../components/molecules/StatusBadge';
import ProjectMetaCard from '../components/molecules/ProjectMetaCard';
import api from '../services/api';

const ProjectResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [project, setProject] = useState(location.state?.project || null);

  // Redirigir si no hay proyecto inicial
  useEffect(() => {
    if (!project) {
      navigate('/planes', { replace: true });
    }
  }, [project, navigate]);

  // Sistema de Polling (Consulta automática al backend cada 5 segundos)
  useEffect(() => {
    let intervalId;

    // Solo consultar si el proyecto existe y NO ha terminado (ni Ready ni Failed)
    if (project && project.status !== 'Ready' && project.status !== 'READY' && project.status !== 'Failed' && project.status !== 'FAILED') {
      intervalId = setInterval(async () => {
        try {
          // Asume que tienes un endpoint GET /api/v1/projects/{id}
          const response = await api.get(`/projects/${project.projectId || project.id}`);
          const updatedProject = response.data;
          
          setProject(updatedProject);

          // Si ya terminó, detenemos el intervalo
          if (updatedProject.status === 'Ready' || updatedProject.status === 'READY' || updatedProject.status === 'Failed' || updatedProject.status === 'FAILED') {
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error("Error consultando el estado del proyecto:", error);
          // Opcional: Podrías detener el intervalo si hay demasiados errores
        }
      }, 5000); // 5000ms = 5 segundos
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [project]);

  if (!project) return null; // Evita un render parpadeante antes del redireccionamiento

  // Estandarizamos el check a mayúsculas para evitar errores de case sensitivity con Java
  const currentStatus = project.status?.toUpperCase() || 'PROCESSING';
  const isReady = currentStatus === 'READY';
  const isFailed = currentStatus === 'FAILED';

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
                : 'La IA está trabajando en tu proyecto. Actualizaremos esta pantalla en unos segundos.'}
            </p>
          </div>

          {/* Tarjeta principal */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            <div className="px-8 py-6 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Proyecto</p>
              <h2 className="text-2xl font-bold text-gray-900">{project.projectName}</h2>
            </div>

            <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ProjectMetaCard label="Idea del negocio" value={project.projectIdea} />
              <ProjectMetaCard label="Call to Action" value={project.callToAction} />
              <ProjectMetaCard label="Sector" value={project.businessSector || 'General'} />
              <ProjectMetaCard label="Tono de comunicación" value={project.communicationTone || 'Profesional'} />
            </div>

            {/* Estado: Ready */}
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

            {/* Estado: Processing */}
            {!isReady && !isFailed && (
              <div className="px-8 py-6 bg-yellow-50 border-t border-yellow-100 flex items-center gap-3">
                <div className="animate-spin h-5 w-5 border-2 border-yellow-500 border-t-transparent rounded-full flex-shrink-0" />
                <p className="text-yellow-700 text-sm font-medium">
                  Analizando parámetros y escribiendo código. Por favor, no cierres esta ventana...
                </p>
              </div>
            )}

            {/* Estado: Failed */}
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