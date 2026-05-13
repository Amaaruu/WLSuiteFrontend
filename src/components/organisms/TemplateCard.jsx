import React from 'react';

const TemplateCard = ({ template }) => {
  return (
    <div className="group relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-sapphire-900/10 transition-all duration-500 hover:-translate-y-2 flex flex-col">
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={template.imageUrl}
          alt={template.title}
          className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sapphire-950/70 via-sapphire-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-sapphire-800 shadow-sm border border-white/50">
          {template.category}
        </div>
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
          <button className="w-full py-2.5 bg-white text-sapphire-900 font-bold text-sm rounded-xl hover:bg-sapphire-50 transition-colors shadow-lg">
            Ver demostración
          </button>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-sapphire-700 transition-colors">
            {template.title}
          </h3>
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-sapphire-50 group-hover:border-sapphire-100 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-sapphire-600">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
        <p className="text-gray-400 text-sm flex-grow leading-relaxed">{template.description}</p>
        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === 0 ? 'w-8 bg-sapphire-500 group-hover:w-10' : i === 1 ? 'w-4 bg-sapphire-300 group-hover:w-6' : 'w-2 bg-sapphire-200'}`} />
            ))}
          </div>
          <span className="text-xs text-gray-300 font-medium">Responsive</span>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;