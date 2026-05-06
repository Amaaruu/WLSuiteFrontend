import React from 'react';
import Button from '../atoms/Button';

const TemplateCard = ({ template }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
      {/* Contenedor de la imagen con efecto de zoom al pasar el mouse */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img 
          src={template.imageUrl} 
          alt={template.title} 
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        {/* Etiqueta flotante para la categoría */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-900 shadow-sm">
          {template.category}
        </div>
      </div>
      
      {/* Contenido de la tarjeta */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{template.title}</h3>
        <p className="text-gray-500 text-sm mb-6 flex-grow">{template.description}</p>
        
        {/* Botón reutilizado de tus átomos */}
        <Button variant="outline" className="w-full py-2.5 border-2 hover:bg-gray-50 transition-colors">
          Ver demostración
        </Button>
      </div>
    </div>
  );
};

export default TemplateCard;