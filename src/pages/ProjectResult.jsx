// src/pages/ProjectResult.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '../components/organisms/Navbar';
import Footer from '../components/organisms/Footer';
import api from '../services/api';

const STATUS_CONFIG = {
  Ready: {
    label:  'Lista',
    bg:     '#f0fdf4',
    border: '#bbf7d0',
    color:  '#15803d',
    dot:    '#22c55e',
  },
  Processing: {
    label:  'Generando',
    bg:     '#fffbeb',
    border: '#fde68a',
    color:  '#b45309',
    dot:    '#f59e0b',
  },
  Failed: {
    label:  'Error',
    bg:     '#fef2f2',
    border: '#fecaca',
    color:  '#b91c1c',
    dot:    '#ef4444',
  },
};

function MetaChip({ label, value, icon }) {
  if (!value) return null;
  return (
    <div style={{
      background:    '#f8fafc',
      border:        '1px solid #e2e8f0',
      borderRadius:  '12px',
      padding:       '16px 20px',
      display:       'flex',
      flexDirection: 'column',
      gap:           '4px',
    }}>
      <span style={{
        fontSize:      '0.72rem',
        fontWeight:    '700',
        color:         '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        {icon && <span style={{ marginRight: '4px' }}>{icon}</span>}
        {label}
      </span>
      <span style={{
        fontSize:   '0.9rem',
        fontWeight: '600',
        color:      '#0f172a',
        lineHeight: '1.4',
      }}>
        {value}
      </span>
    </div>
  );
}

const ProjectResult = () => {
  const location  = useLocation();
  const navigate  = useNavigate();

  const { projectId } = useParams();

  const initialProject = location.state?.project || null;

  const [project,   setProject]   = useState(initialProject);
  const [isLoading, setIsLoading] = useState(!initialProject);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    if (initialProject) return;

    if (!projectId) {
      setError('No se encontró información del proyecto.');
      setIsLoading(false);
      return;
    }

    api.get(`/projects/${projectId}`)
      .then(res => setProject(res.data))
      .catch(() => setError('No se pudo cargar el proyecto. Verifica que tengas acceso.'))
      .finally(() => setIsLoading(false));
  }, [projectId, initialProject]);

  const fetchProject = useCallback(async () => {
    if (!project?.projectId) return;
    try {
      const res = await api.get(`/projects/${project.projectId}`);
      setProject(res.data);
    } catch {
    }
  }, [project?.projectId]);

  useEffect(() => {
    if (!project || project.status !== 'Processing') return;
    const interval = setInterval(fetchProject, 5000);
    return () => clearInterval(interval);
  }, [project, fetchProject]);

  // ── Estados de carga / error ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Cargando proyecto…</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl border border-red-100 p-10 max-w-md text-center shadow-sm">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Proyecto no encontrado</h2>
            <p className="text-red-600 text-sm mb-6">{error}</p>
            <Link
              to="/dashboard/projects"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition"
            >
              Ver mis proyectos
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isReady      = project.status === 'Ready';
  const isProcessing = project.status === 'Processing';
  const isFailed     = project.status === 'Failed';
  const statusCfg    = STATUS_CONFIG[project.status] || STATUS_CONFIG.Processing;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 px-4">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* ── Header de estado ─────────────────────────────── */}
          <div className="text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4"
              style={{
                background: statusCfg.bg,
                color:      statusCfg.color,
                border:     `1px solid ${statusCfg.border}`,
              }}
            >
              <span style={{
                width:       '8px',
                height:      '8px',
                borderRadius:'50%',
                background:  statusCfg.dot,
                flexShrink:  0,
                animation:   isProcessing ? 'pulse 1.5s ease infinite' : 'none',
              }} />
              {isProcessing ? 'IA generando tu landing…' : `Estado: ${statusCfg.label}`}
            </div>

            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {isReady
                ? '¡Tu landing page está lista!'
                : isFailed
                ? 'Ocurrió un problema'
                : 'Procesando tu landing…'}
            </h1>
            <p className="text-gray-400 mt-2">
              {isReady
                ? 'Accede, visualiza y descarga tu página generada por IA.'
                : isFailed
                ? 'La IA no pudo completar la generación. Intenta de nuevo.'
                : 'Esto puede tomar entre 30 y 60 segundos. No cierres esta ventana.'}
            </p>
          </div>

          {/* ── Tarjeta principal ─────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Encabezado del proyecto */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Proyecto
                </p>
                <h2 className="text-2xl font-black text-gray-900">
                  {project.projectName}
                </h2>
              </div>
              <div
                className="px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: statusCfg.bg, color: statusCfg.color }}
              >
                {statusCfg.label}
              </div>
            </div>

            {/* Metadatos */}
            <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MetaChip label="Idea del negocio"  value={project.projectIdea}    icon="💡" />
              <MetaChip label="Call to Action"    value={project.callToAction}   icon="🎯" />
              <MetaChip label="Sector"            value={project.businessSector} icon="🏢" />
              <MetaChip label="Objetivo"          value={project.landingGoal}    icon="📈" />
            </div>

            {/* ── Estado: Ready ────────────────────────────────── */}
            {isReady && project.signedUrl && (
              <div className="px-8 py-6 bg-green-50 border-t border-green-100">
                <p className="text-sm font-bold text-green-800 mb-3">
                  ✓ Tu landing page está generada y disponible
                </p>
                
                {/* LA ETIQUETA <a FALTABA AQUÍ */}
                <a
                  href={project.signedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition"
                >
                  Ver mi landing page →
                </a>
                <p className="text-xs text-green-600 mt-3">
                  Este enlace es válido por 24 horas. Descarga tu proyecto para tenerlo de forma permanente.
                </p>
              </div>
            )}

            {/* ── Estado: Processing ───────────────────────────── */}
            {isProcessing && (
              <div className="px-8 py-6 bg-amber-50 border-t border-amber-100">
                <div className="flex items-start gap-4">
                  <div className="animate-spin h-6 w-6 border-2 border-amber-400 border-t-transparent rounded-full flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-800 text-sm mb-1">
                      IA trabajando en tu proyecto…
                    </p>
                    <p className="text-amber-600 text-sm">
                      Estamos analizando tu negocio, generando el copy y construyendo la estructura visual.
                      La página se actualizará automáticamente.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {['Analizando negocio', 'Generando copy', 'Construyendo diseño'].map((step, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-md font-medium"
                        >
                          {step}…
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Estado: Failed ───────────────────────────────── */}
            {isFailed && (
              <div className="px-8 py-6 bg-red-50 border-t border-red-100">
                <p className="font-bold text-red-800 text-sm mb-2">
                  ⚠ La generación no pudo completarse
                </p>
                <p className="text-red-600 text-sm mb-4">
                  Nuestro equipo fue notificado del problema. Puedes intentar generar una nueva landing.
                </p>
                <Link
                  to="/planes"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition"
                >
                  Intentar de nuevo
                </Link>
              </div>
            )}

          </div>

          {/* ── Acciones secundarias ──────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/dashboard/projects"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition text-sm"
            >
              ← Mis proyectos
            </Link>
            <Link
              to="/planes"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition text-sm"
            >
              + Nueva landing page
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectResult;