// src/pages/Plans.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/organisms/Navbar';
import PricingCard from '../components/organisms/PricingCard';
import Footer from '../components/organisms/Footer';
import api from '../services/api';
import { useScrollReveal } from '../hooks/useScrollReveal';

const RevealOnScroll = ({ children, className = '', delay = '' }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${delay} ${className}`}
    >
      {children}
    </div>
  );
};

const CompareRow = ({ label, basic, intermediate, premium }) => (
  <tr className="border-b border-gray-100 last:border-0">
    <td className="py-3 pr-4 text-sm font-medium text-gray-700">{label}</td>
    <td className="py-3 px-4 text-center text-sm text-gray-500">{basic}</td>
    <td className="py-3 px-4 text-center text-sm font-semibold text-sapphire-700 bg-sapphire-50/50">{intermediate}</td>
    <td className="py-3 px-4 text-center text-sm font-semibold text-amber-700">{premium}</td>
  </tr>
);

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/plans');
        const order = ['básico', 'basico', 'intermedio', 'premium'];
        const sorted = [...response.data].sort((a, b) => {
          const ai = order.findIndex(o => a.name?.toLowerCase().includes(o));
          const bi = order.findIndex(o => b.name?.toLowerCase().includes(o));
          return ai - bi;
        });
        setPlans(sorted);
      } catch (err) {
        setError(err.response?.data?.message || 'No se pudieron cargar los planes.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow">

        {/* ── Hero de precios ───────────────────────────────────────────── */}
        <section className="pt-36 pb-16 px-4 text-center relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sapphire-50 via-white to-white"
          />

          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 bg-sapphire-50 border border-sapphire-100 rounded-full px-4 py-2 text-sm font-semibold text-sapphire-700 mb-6">
              <span>✦</span>
              <span>Pago único · Sin suscripciones · Sin sorpresas</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 font-display mb-6 max-w-4xl mx-auto leading-[1.05]">
              El plan perfecto para
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sapphire-600 to-indigo-600">
                cada etapa de tu negocio
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Crea tu landing page con IA en minutos. Elige el nivel de personalización que necesitas
              y obtén resultados profesionales desde el primer día.
            </p>
          </RevealOnScroll>
        </section>

        {/* ── Grid de planes ────────────────────────────────────────────── */}
        <section className="px-4 pb-20">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-24 gap-4">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-sapphire-100 border-t-sapphire-600" />
              <p className="text-sm text-gray-400 font-medium">Cargando planes...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 p-8 max-w-xl mx-auto rounded-2xl text-center">
              <p className="text-red-600 font-semibold">{error}</p>
              <p className="text-sm text-red-400 mt-2">Intenta recargar la página.</p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {plans.map((plan, idx) => {
                  const isPopular = plan.name?.toLowerCase().includes('intermedio');
                  return (
                    <RevealOnScroll
                      key={plan.planId}
                      delay={`delay-[${idx * 120}ms]`}
                      className={isPopular ? 'md:-mt-4' : ''}
                    >
                      <PricingCard plan={plan} isPopular={isPopular} />
                    </RevealOnScroll>
                  );
                })}
              </div>

              <RevealOnScroll className="mt-8 text-center">
                <p className="text-sm text-gray-400">
                  Todos los planes son de <strong className="text-gray-600">pago único</strong>.
                  No hay cobros recurrentes ni cargos ocultos.
                </p>
              </RevealOnScroll>
            </div>
          )}
        </section>

        {/* ── Comparador de planes ──────────────────────────────────────── */}
        {!isLoading && !error && plans.length > 0 && (
          <section className="px-4 pb-20">
            <RevealOnScroll className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 font-display mb-3">
                  ¿Cuál plan es para ti?
                </h2>
                <p className="text-gray-500">Compara las funcionalidades de cada nivel en detalle.</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500 w-2/5">Funcionalidad</th>
                      <th className="py-4 px-4 text-center text-sm font-bold text-gray-700">Básico</th>
                      <th className="py-4 px-4 text-center text-sm font-bold text-sapphire-700 bg-sapphire-50/50">Intermedio</th>
                      <th className="py-4 px-4 text-center text-sm font-bold text-amber-700">Premium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <CompareRow label="Landing page con IA"          basic="✓" intermediate="✓" premium="✓" />
                    <CompareRow label="Motor de IA"                  basic="Básico" intermediate="GPT-4o Mini" premium="Claude 3.5" />
                    <CompareRow label="Personalización de colores"   basic="—" intermediate="✓" premium="✓" />
                    <CompareRow label="Sección testimonios"          basic="—" intermediate="✓" premium="✓" />
                    <CompareRow label="FAQ de conversión"            basic="—" intermediate="✓" premium="✓" />
                    <CompareRow label="Urgencia y escasez"           basic="—" intermediate="✓" premium="✓" />
                    <CompareRow label="Control tipográfico"          basic="—" intermediate="—" premium="✓" />
                    <CompareRow label="Animaciones avanzadas"        basic="—" intermediate="—" premium="✓" />
                    <CompareRow label="Sección de precios integrada" basic="—" intermediate="—" premium="✓" />
                    <CompareRow label="Copywriting nivel experto"    basic="—" intermediate="—" premium="✓" />
                    <CompareRow label="Soporte prioritario"          basic="—" intermediate="—" premium="✓" />
                  </tbody>
                </table>
              </div>
            </RevealOnScroll>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default Plans;