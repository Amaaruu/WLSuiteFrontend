import React from 'react';
import Button from '../atoms/Button';
import PlanFeatureItem from '../molecules/PlanFeatureItem';

const PricingCard = ({ plan, isPopular }) => {
  // Si el backend aún no envía la lista de 'features', usamos unas por defecto para que no se rompa
  const features = plan.features || ['Soporte estándar', 'Generación web con IA', 'Hosting incluido en la plataforma'];

  return (
    <div className={`relative flex flex-col p-8 bg-white rounded-2xl shadow-xl transition-transform duration-300 hover:-translate-y-2 ${isPopular ? 'border-2 border-primary' : 'border border-gray-100'}`}>
      
      {isPopular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="bg-primary text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
            Más Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-extrabold text-gray-900">{plan.name}</h3>
        <p className="mt-2 text-sm text-gray-500 min-h-[40px]">{plan.description}</p>
      </div>

      <div className="text-center mb-8">
        <span className="text-5xl font-extrabold text-gray-900">${plan.price}</span>
        <span className="text-gray-500 font-medium">/único</span>
      </div>

      <ul className="flex-1 space-y-4 mb-8">
        {features.map((feat, index) => (
          <PlanFeatureItem key={index} feature={feat} />
        ))}
      </ul>

      <div className="mt-auto">
        <Button 
          className={`w-full py-4 text-lg font-bold rounded-xl transition-all ${isPopular ? 'bg-primary text-white hover:bg-blue-700 hover:shadow-lg' : 'bg-gray-50 text-gray-900 hover:bg-gray-200'}`}
        >
          Elegir {plan.name}
        </Button>
      </div>
    </div>
  );
};

export default PricingCard;