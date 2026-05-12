import React, { useState, useEffect } from 'react';
import Navbar from '../components/organisms/Navbar';
import PricingCard from '../components/organisms/PricingCard';
import Footer from '../components/organisms/Footer';
import api from '../services/api'; 
import { useScrollReveal } from '../hooks/useScrollReveal';

const RevealOnScroll = ({ children, className = "", delay = "" }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${delay} ${className}`}>
      {children}
    </div>
  );
};

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
        setError(err.response?.data?.message || 'No se pudieron cargar los planes.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-40 pb-20">
        <RevealOnScroll>
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sapphire-700 via-blue-600 to-indigo-600">
              Precios Transparentes, Resultados Increíbles
            </h1>
            <p className="text-xl text-gray-600">
              Impulsa tu presencia digital con el poder de la IA. Paga solo por lo que usas.
            </p>
          </div>
        </RevealOnScroll>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-sapphire-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 max-w-2xl mx-auto rounded-xl text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 relative z-10">
            {plans.map((plan, idx) => (
              <RevealOnScroll key={plan.planId} delay={`delay-[${idx * 200}ms]`}>
                <PricingCard plan={plan} isPopular={plan.name.toLowerCase() === 'intermedio'} />
              </RevealOnScroll>
            ))}
          </div>
        )}
      </main>
      <Footer/>
    </div>
  );
};

export default Plans;