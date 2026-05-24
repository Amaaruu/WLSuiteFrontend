import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import PlanFeatureItem from '../molecules/PlanFeatureItem';
import { getPlanConfig } from '../../config/plansConfig';
import api from '../../services/api';

const PricingCard = ({ plan, isPopular }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isProcessing, setIsProcessing] = useState(false);

  const config   = getPlanConfig(plan.name);
  const features = config.features.length > 0
    ? config.features
    : (plan.features || []).map(f => ({ text: f, included: true, highlight: false }));

  const isPremium = plan.name?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === 'premium';
  const isFree = Number(plan.price) === 0;

  const handleSelectPlan = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (isFree) {
      setIsProcessing(true);
      try {
        const response = await api.post('/transactions', {
          planId: plan.planId,
          paymentMethod: 'gratis',
          status: 'completado',
        });
        navigate('/create-landing', {
          state: { transactionId: response.data.transactionId, selectedPlan: plan },
        });
      } catch (err) {
        console.error('Error al procesar el plan gratuito:', err);
        setIsProcessing(false);
      }
    } else {
      navigate('/checkout', { state: { selectedPlan: plan } });
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
            {isFree ? 'Gratis' : `$${Number(plan.price).toLocaleString('en-US')}`}
          </span>
          {!isFree && (
            <span
              className={`text-sm font-medium ${
                isPremium ? 'text-sapphire-400' : 'text-gray-400'
              }`}
            >
              USD / único
            </span>
          )}
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

      <div className={`mx-8 h-px ${isPremium ? 'bg-sapphire-700' : 'bg-gray-100'}`} />

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

      <div className="px-8 pb-8">
        <button
          onClick={handleSelectPlan}
          disabled={isProcessing}
          className={`
            w-full py-4 rounded-xl text-base font-bold transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${isPremium
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 hover:from-amber-300 hover:to-amber-400 focus:ring-amber-400 focus:ring-offset-sapphire-950 shadow-lg shadow-amber-500/20'
              : isPopular
                ? 'bg-gradient-to-r from-sapphire-600 to-sapphire-700 text-white hover:from-sapphire-500 hover:to-sapphire-600 focus:ring-sapphire-500 shadow-lg shadow-sapphire-600/25'
                : 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-700'
            }
            ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}
          `}
        >
          {isProcessing ? 'Procesando...' : isFree ? 'Comenzar Gratis' : config.ctaLabel}
        </button>
      </div>
    </div>
  );
};

export default PricingCard;