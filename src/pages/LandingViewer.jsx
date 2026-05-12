import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const LandingViewer = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [landingData, setLandingData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      if (!token) {
        setError('Acceso denegado: Token no proporcionado.');
        setIsLoading(false);
        return;
      }

      try {
        const envBase = import.meta.env.VITE_API_BASE_URL || 'https://landingbackend-s1rk.onrender.com/api/v1';
        const serverUrl = envBase.replace(/\/api\/v1\/?$/, '');
        
        const response = await axios.get(`${serverUrl}/landings/${id}?token=${token}`);
        setLandingData(response.data.aiMetadata);
      } catch (err) {
        setError(err.response?.data?.message || 'El enlace ha expirado o no es válido.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLandingData();
  }, [id, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Página no disponible</h2>
          <p className="text-red-600 font-medium mb-6">{error}</p>
          <a href="/" className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  if (!landingData) return null;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100">
      
      {landingData.hero && (
        <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gray-50 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-8">
              {landingData.hero.headline}
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              {landingData.hero.subheadline}
            </p>
            <button className="px-10 py-5 bg-blue-600 text-white font-bold text-lg rounded-full hover:bg-blue-700 transition shadow-xl shadow-blue-600/20">
              {landingData.hero.ctaButton}
            </button>
          </div>
        </header>
      )}

      {landingData.socialProof && (
        <section className="py-8 bg-blue-600 text-white text-center px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-center items-center gap-6 font-medium">
            <span>🚀 {landingData.socialProof.urgencyText}</span>
            <span className="hidden md:inline">•</span>
            <span>📦 {landingData.socialProof.shippingText}</span>
          </div>
        </section>
      )}

      {landingData.features && landingData.features.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">Por qué elegirnos</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {landingData.features.map((feature, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-gray-50 border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl font-black mb-6">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {landingData.faq && landingData.faq.length > 0 && (
        <section className="py-24 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-16">Preguntas Frecuentes</h2>
            <div className="space-y-6">
              {landingData.faq.map((faq, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h4 className="text-lg font-bold mb-2">{faq.question}</h4>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {landingData.pricing && landingData.pricing.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-16">Nuestros Planes</h2>
            <div className="grid md:grid-cols-2 gap-8 justify-center">
              {landingData.pricing.map((plan, idx) => (
                <div key={idx} className="p-8 rounded-3xl border border-gray-200 text-center">
                  <h3 className="text-2xl font-bold mb-2">{plan.planName}</h3>
                  <p className="text-4xl font-black mb-6">{plan.price}</p>
                  <ul className="space-y-3 mb-8 text-gray-600">
                    {plan.benefits.map((b, i) => <li key={i}>✓ {b}</li>)}
                  </ul>
                  <button className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800">
                    Elegir Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {landingData.footer && (
        <footer className="py-12 bg-gray-900 text-gray-400 text-center">
          <p className="mb-2">¿Tienes dudas? Escríbenos a:</p>
          <a href={`mailto:${landingData.footer.contact}`} className="text-white font-bold hover:underline">
            {landingData.footer.contact}
          </a>
        </footer>
      )}
    </div>
  );
};

export default LandingViewer;