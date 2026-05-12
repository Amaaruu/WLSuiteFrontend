import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Button from '../atoms/Button';
import PlanFeatureItem from '../molecules/PlanFeatureItem';
import api from '../../services/api';

const PricingCard = ({ plan, isPopular }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const features = plan.features || ['Soporte estándar', 'Generación web con IA', 'Hosting incluido'];

  console.log('Plan objeto completo:', plan);
  const handleSelectPlan = async () => {
    // Si no está logueado, lo mandamos a login primero
    if (!user) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      //Creamos la transacción en el backend
      const response = await api.post('/transactions', {
        userId: user.userId,
        planId: plan.planId,
        paymentMethod: 'online',
        status: 'completado',
      });

      const transactionId = response.data.transactionId;

      //Navegamos al formulario pasando el transactionId y el plan
      navigate('/create-landing', {
        state: {
          transactionId,
          selectedPlan: plan,
        },
      });
    } catch (err) {
      setError('No se pudo procesar el plan. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`relative flex flex-col p-8 bg-white rounded-2xl shadow-xl transition-transform duration-300 hover:-translate-y-2 ${
        isPopular ? 'border-2 border-blue-600' : 'border border-gray-100'
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
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

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      <div className="mt-auto">
        <Button
          onClick={handleSelectPlan}
          disabled={isLoading}
          className={`w-full py-4 text-lg font-bold rounded-xl transition-all ${
            isPopular
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-50 text-gray-900 hover:bg-gray-200'
          }`}
        >
          {isLoading ? 'Procesando...' : `Elegir ${plan.name}`}
        </Button>
      </div>
    </div>
  );
};

export default PricingCard;