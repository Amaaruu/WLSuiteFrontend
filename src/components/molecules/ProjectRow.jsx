// src/components/molecules/ProjectRow.jsx
import React from 'react';
import { Trash2, ExternalLink } from 'lucide-react';
import StatusBadge from './StatusBadge';
import Button from '../atoms/Button';

const ProjectRow = ({ project, showLink = true, onDelete, isDeleting = false }) => {
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

      <div className="flex items-center gap-2 flex-shrink-0">
        {showLink && project.signedUrl && (
          <a
            href={project.signedUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" className="text-sm px-4 py-2 flex items-center gap-1.5">
              <ExternalLink size={14} />
              Ver página
            </Button>
          </a>
        )}

        {onDelete && (
          <button
            onClick={() => onDelete(project)}
            disabled={isDeleting}
            title="Eliminar proyecto"
            className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectRow;