import React from 'react';

const ProjectMetaCard = ({ icon, label, value }) => {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
      <span className="text-xl mt-0.5">{icon}</span>
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default ProjectMetaCard;