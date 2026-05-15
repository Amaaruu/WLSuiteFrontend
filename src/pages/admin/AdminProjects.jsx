import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/organisms/Sidebar';
import StatusBadge from '../../components/molecules/StatusBadge';
import ErrorBanner from '../../components/molecules/ErrorBanner';
import api from '../../services/api';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const DetailChip = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      <span className="text-xs font-medium text-gray-700 leading-snug">{value}</span>
    </div>
  );
};

const ProjectRow = ({ project }) => {
  const [expanded, setExpanded] = useState(false);

  const owner = project.transaction?.user || null;
  const ownerName = owner ? `${owner.name || ''} ${owner.lastName || ''}`.trim() : '—';
  const ownerEmail = owner?.email || '—';

  const dp = project.designPreferences || {};

  const formattedDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString('es-CL', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : '—';

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <td className="px-5 py-4 text-gray-400 text-xs font-mono">{project.projectId}</td>
        <td className="px-5 py-4">
          <p className="font-semibold text-gray-900 text-sm">{project.projectName}</p>
          <p className="text-xs text-gray-400 truncate max-w-[200px] mt-0.5">{project.projectIdea}</p>
        </td>
        <td className="px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-sapphire-100 flex items-center justify-center text-sapphire-700 font-bold text-xs uppercase flex-shrink-0">
              {(owner?.name || '?').charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{ownerName}</p>
              <p className="text-xs text-gray-400">{ownerEmail}</p>
            </div>
          </div>
        </td>
        <td className="px-5 py-4 text-xs text-gray-600">{project.businessSector || '—'}</td>
        <td className="px-5 py-4"><StatusBadge status={project.status} /></td>
        <td className="px-5 py-4 text-xs text-gray-400">{formattedDate}</td>
        <td className="px-5 py-4">
          <div className="flex items-center justify-end gap-2">
            {project.signedUrl && (
              <a
                href={project.signedUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <ExternalLink size={11} />
                Ver
              </a>
            )}
            <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </td>
      </tr>

      {expanded && (
        <tr className="bg-sapphire-50/40 border-b border-sapphire-100">
          <td colSpan={7} className="px-5 py-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <DetailChip label="CTA principal" value={project.callToAction} />
              <DetailChip label="Objetivo" value={project.landingGoal} />
              <DetailChip label="Público objetivo" value={project.targetAudience} />
              <DetailChip label="Posicionamiento" value={project.brandPositioning} />
              <DetailChip label="Tono de comunicación" value={project.communicationTone} />
              <DetailChip label="Formalidad" value={project.formalityLevel} />
              <DetailChip label="Etapa de marca" value={project.brandStage} />
              <DetailChip label="Color primario" value={dp.primaryColor} />
              <DetailChip label="Estilo visual" value={dp.visualStyle} />
              <DetailChip label="Animaciones" value={dp.animationLevel} />
              <DetailChip label="Layout" value={dp.layoutType} />
              <DetailChip label="Secciones activas" value={dp.sections} />
            </div>
            <div className="mt-3 pt-3 border-t border-sapphire-100 flex items-center gap-4 text-xs text-gray-400">
              <span>ID Transacción: <span className="font-mono text-gray-600">{project.transaction?.transactionId || '—'}</span></span>
              <span>Plan: <span className="font-semibold text-gray-600">{project.transaction?.plan?.name || '—'}</span></span>
              {project.signedUrl && (
                <span className="truncate max-w-xs">
                  URL: <a href={project.signedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{project.signedUrl}</a>
                </span>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    api.get('/projects?size=100&sort=createdAt,desc')
      .then(res => setProjects(res.data.content || []))
      .catch(() => setError('No se pudieron cargar los proyectos.'))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = projects.filter(p => {
    const owner = p.transaction?.user;
    const ownerName = owner ? `${owner.name || ''} ${owner.lastName || ''} ${owner.email || ''}`.toLowerCase() : '';
    const matchSearch =
      search === '' ||
      (p.projectName || '').toLowerCase().includes(search.toLowerCase()) ||
      ownerName.includes(search.toLowerCase()) ||
      (p.businessSector || '').toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      filterStatus === 'all' ||
      (p.status || '').toLowerCase() === filterStatus.toLowerCase();

    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-grow ml-64 p-10">
        <div className="max-w-7xl mx-auto space-y-6">

          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Proyectos</h1>
              <p className="text-gray-500 mt-1">
                {!isLoading && !error ? `${filtered.length} de ${projects.length} proyectos` : 'Todos los proyectos generados por la IA.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Buscar por nombre, usuario o sector..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sapphire-200 focus:border-sapphire-400 bg-white"
            />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sapphire-200 focus:border-sapphire-400"
            >
              <option value="all">Todos los estados</option>
              <option value="ready">Listos</option>
              <option value="processing">Procesando</option>
              <option value="failed">Con error</option>
            </select>
          </div>

          {isLoading && (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse h-20 bg-white rounded-2xl border border-gray-100" />
              ))}
            </div>
          )}

          {!isLoading && error && <ErrorBanner message={error} />}

          {!isLoading && !error && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">ID</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Proyecto</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Propietario</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Sector</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Estado</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Fecha</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map(p => (
                      <ProjectRow key={p.projectId} project={p} />
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <p className="text-center text-gray-400 py-10 text-sm">No hay proyectos que coincidan con los filtros.</p>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminProjects;