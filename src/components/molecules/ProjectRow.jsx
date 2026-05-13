import React from 'react';
import StatusBadge from './StatusBadge';
import Button from '../atoms/Button';

const ProjectRow = ({ project, showLink = true }) => {
  const formattedDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString('es-CL', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '—';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <StatusBadge status={project.status} />
        </div>
        <p className="font-semibold text-gray-900 truncate">{project.projectName}</p>
        <p className="text-sm text-gray-400 mt-0.5 truncate">{project.projectIdea}</p>
        <p className="text-xs text-gray-300 mt-1">{formattedDate}</p>
      </div>
      {showLink && project.signedUrl && (
        <a
          href={project.signedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0"
        >
          <Button variant="secondary" className="text-sm px-4 py-2">
            Ver página
          </Button>
        </a>
      )}
    </div>
  );
};

export default ProjectRow;