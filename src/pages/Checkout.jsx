// src/pages/Checkout.jsx
import React from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import Navbar from '../components/organisms/Navbar';
import Footer from '../components/organisms/Footer';
import CheckoutForm from '../components/organisms/CheckoutForm';
import { ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const location = useLocation();
  const { selectedPlan } = location.state || {};

  // Si llegan sin plan, redirigir a /planes
  if (!selectedPlan) {
    return <Navigate to="/planes" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 px-4">
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          {/* Breadcrumb / Volver */}
          <Link
            to="/planes"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#64748b',
              textDecoration: 'none',
              marginBottom: 28,
              padding: '6px 14px',
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 9999,
              transition: 'all 0.15s',
            }}
          >
            <ArrowLeft size={14} />
            Cambiar plan
          </Link>

          {/* Encabezado */}
          <div style={{ marginBottom: 32 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#2563eb',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 9999,
              padding: '4px 14px',
              marginBottom: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              <span style={{ width: 6, height: 6, background: '#3b82f6', borderRadius: '50%' }} />
              Checkout seguro
            </div>
            <h1 style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontWeight: 900,
              color: '#0f172a',
              margin: '0 0 8px',
              letterSpacing: '-0.025em',
              fontFamily: "'Fraunces', Georgia, serif",
            }}>
              Completa tu compra
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>
              Pago único · Sin suscripciones · Acceso inmediato tras confirmar
            </p>
          </div>

          {/* Paso visual */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 32,
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#94a3b8',
          }}>
            <span style={{ color: '#22c55e' }}>✓</span>
            <span style={{ color: '#0f172a' }}>Plan seleccionado</span>
            <span>—</span>
            <span style={{
              background: '#1d4ed8',
              color: '#fff',
              borderRadius: 9999,
              padding: '2px 12px',
              fontSize: '0.72rem',
            }}>Datos de pago</span>
            <span>—</span>
            <span>Crear landing</span>
          </div>

          {/* Formulario */}
          <div style={{
            background: '#fff',
            borderRadius: 24,
            border: '1px solid #e2e8f0',
            padding: 'clamp(20px, 4vw, 40px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}>
            <CheckoutForm plan={selectedPlan} />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;