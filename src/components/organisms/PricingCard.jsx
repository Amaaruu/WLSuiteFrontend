// src/components/organisms/PricingCard.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import PlanFeatureItem from '../molecules/PlanFeatureItem';
import api from '../../services/api';
import { getPlanConfig } from '../../config/plansConfig';

const PricingCard = ({ plan, isPopular }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const config = getPlanConfig(plan.name);
  const features = config.features.length > 0
    ? config.features
    : (plan.features || []).map(f => ({ text: f, included: true, highlight: false }));

  const isPremium = plan.name?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === 'premium';

  const handleSelectPlan = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/transactions', {
        userId: user.userId,
        planId: plan.planId,
        paymentMethod: 'online',
        status: 'completado',
      });
      const transactionId = response.data.transactionId;
      navigate('/create-landing', {
        state: { transactionId, selectedPlan: plan },
      });
    } catch (err) {
      setError('No se pudo procesar el plan. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`
        relative flex flex-col rounded-2xl transition-all duration-300
        hover:-translate-y-2 hover:shadow-2xl
        ${isPremium
          ? 'bg-gradient-to-b from-sapphire-900 to-sapphire-950 text-white shadow-xl shadow-sapphire-900/30 border border-sapphire-700'
          : isPopular
            ? 'bg-white border-2 border-sapphire-500 shadow-xl shadow-sapphire-100'
            : 'bg-white border border-gray-200 shadow-md'
        }
      `}
    >
      {/* Badge superior */}
      {config.badge && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <span
            className={`
              px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg
              ${isPremium
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950'
                : 'bg-gradient-to-r from-sapphire-600 to-sapphire-700 text-white'
              }
            `}
          >
            {config.badge}
          </span>
        </div>
      )}

      {/* Cabecera */}
      <div className={`px-8 pb-6 ${config.badge ? 'pt-10' : 'pt-8'}`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl" aria-hidden="true">{config.icon}</span>
          <h3
            className={`text-xl font-black tracking-tight font-display ${
              isPremium ? 'text-white' : 'text-gray-900'
            }`}
          >
            {plan.name}
          </h3>
        </div>

        <p
          className={`text-sm font-semibold mb-3 ${
            isPremium ? 'text-sapphire-300' : isPopular ? 'text-sapphire-600' : 'text-gray-500'
          }`}
        >
          {config.tagline}
        </p>

        <p
          className={`text-sm leading-relaxed mb-6 ${
            isPremium ? 'text-sapphire-200/80' : 'text-gray-500'
          }`}
        >
          {config.description || plan.description}
        </p>

        <div className="flex items-baseline gap-1 mb-1">
          <span
            className={`text-5xl font-black tracking-tighter ${
              isPremium ? 'text-white' : isPopular ? 'text-sapphire-700' : 'text-gray-900'
            }`}
          >
            ${Number(plan.price).toLocaleString('en-US')}
          </span>
          <span
            className={`text-sm font-medium ${
              isPremium ? 'text-sapphire-400' : 'text-gray-400'
            }`}
          >
            USD / único
          </span>
        </div>

        {config.idealFor && (
          <p
            className={`text-xs mt-2 ${
              isPremium ? 'text-sapphire-400' : 'text-gray-400'
            }`}
          >
            <span className="font-semibold">Ideal para:</span> {config.idealFor}
          </p>
        )}
      </div>

      {/* Separador */}
      <div className={`mx-8 h-px ${isPremium ? 'bg-sapphire-700' : 'bg-gray-100'}`} />

      {/* Features */}
      <div className="px-8 py-6 flex-1">
        <ul className="space-y-3">
          {features.map((feat, index) => (
            <PlanFeatureItem
              key={index}
              feature={isPremium && typeof feat === 'object' ? { ...feat, _dark: true } : feat}
            />
          ))}
        </ul>
      </div>

      {/* Footer de la card */}
      <div className="px-8 pb-8">
        {error && (
          <p className="text-red-400 text-sm text-center mb-3">{error}</p>
        )}

        <button
          onClick={handleSelectPlan}
          disabled={isLoading}
          className={`
            w-full py-4 rounded-xl text-base font-bold transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed
            ${isPremium
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 hover:from-amber-300 hover:to-amber-400 focus:ring-amber-400 focus:ring-offset-sapphire-950 shadow-lg shadow-amber-500/20'
              : isPopular
                ? 'bg-gradient-to-r from-sapphire-600 to-sapphire-700 text-white hover:from-sapphire-500 hover:to-sapphire-600 focus:ring-sapphire-500 shadow-lg shadow-sapphire-600/25'
                : 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-700'
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Procesando...
            </span>
          ) : (
            config.ctaLabel
          )}
        </button>
      </div>
    </div>
  );
};

export default PricingCard;