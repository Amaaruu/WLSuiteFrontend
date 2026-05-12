import React, { useState, useEffect } from 'react';
import Navbar from '../components/organisms/Navbar';
import PricingCard from '../components/organisms/PricingCard';
import Footer from '../components/organisms/Footer';
import api from '../services/api'; 

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/plans');
        setPlans(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'No se pudieron cargar los planes desde el servidor.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-20">
        
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-900 mb-6">
            Precios Transparentes, Resultados Increíbles
          </h1>
          <p className="text-lg text-gray-600">
            Impulsa tu presencia digital con páginas web generadas por IA. Paga solo por lo que usas, sin suscripciones ocultas.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            <p className="text-gray-500 font-medium">Cargando planes...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 max-w-2xl mx-auto rounded-md shadow-sm text-center">
            <h3 className="text-red-800 font-bold text-lg mb-2">Ups, tuvimos un problema</h3>
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {plans.map((plan) => (
              <PricingCard 
                key={plan.planId}
                plan={plan} 
                isPopular={plan.name.toLowerCase() === 'intermedio'} 
              />
            ))}
          </div>
        )}
      </main>
      <Footer/>
    </div>
  );
};

export default Plans;