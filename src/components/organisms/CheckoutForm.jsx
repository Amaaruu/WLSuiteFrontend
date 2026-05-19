// src/components/organisms/CheckoutForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreditCard from '../molecules/CreditCard';
import OrderSummary from '../molecules/OrderSummary';
import api from '../../services/api';

// ── Helpers de formato ──────────────────────────────────────────────────────

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

function formatCvv(value) {
  return value.replace(/\D/g, '').slice(0, 4);
}

function luhnCheck(number) {
  const digits = number.replace(/\s/g, '');
  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i]);
    if (isEven) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

function validateExpiry(value) {
  const parts = value.split('/');
  if (parts.length !== 2) return false;
  const month = parseInt(parts[0]);
  const year  = parseInt('20' + parts[1]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const exp = new Date(year, month - 1, 1);
  return exp >= new Date(now.getFullYear(), now.getMonth(), 1);
}

// ── Pantalla de procesando ─────────────────────────────────────────────────

const ProcessingScreen = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 24, padding: '48px 24px',
    textAlign: 'center',
  }}>
    <div style={{ position: 'relative', width: 72, height: 72 }}>
      <div style={{
        position: 'absolute', inset: 0,
        border: '4px solid #e2e8f0',
        borderTopColor: '#3b82f6',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
    <div>
      <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
        Procesando pago…
      </p>
      <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
        No cierres esta ventana. Esto tarda solo un momento.
      </p>
    </div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ── Pantalla de éxito ──────────────────────────────────────────────────────

const SuccessScreen = ({ planName }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 20, padding: '48px 24px',
    textAlign: 'center',
  }}>
    <div style={{
      width: 80, height: 80,
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 16px 40px rgba(34,197,94,0.35)',
      animation: 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
    }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
    <div>
      <p style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>
        ¡Pago completado!
      </p>
      <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 4px' }}>
        Plan <strong>{planName}</strong> activado correctamente
      </p>
      <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
        Redirigiendo al formulario de tu landing…
      </p>
    </div>
    <style>{`
      @keyframes popIn {
        from { transform: scale(0.5); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    `}</style>
  </div>
);

// ── Pantalla de error ──────────────────────────────────────────────────────

const ErrorScreen = ({ message, onRetry }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 20, padding: '48px 24px',
    textAlign: 'center',
  }}>
    <div style={{
      width: 72, height: 72,
      background: '#fef2f2',
      border: '2px solid #fecaca',
      borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    </div>
    <div>
      <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
        Error al procesar el pago
      </p>
      <p style={{ fontSize: '0.85rem', color: '#ef4444', margin: '0 0 20px' }}>{message}</p>
      <button
        onClick={onRetry}
        style={{
          padding: '10px 28px',
          background: '#0f172a',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          fontWeight: 700,
          fontSize: '0.875rem',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        Intentar de nuevo
      </button>
    </div>
  </div>
);

// ── Componente principal ───────────────────────────────────────────────────

const CheckoutForm = ({ plan }) => {
  const navigate = useNavigate();

  const [step, setStep]   = useState('form'); // 'form' | 'processing' | 'success' | 'error'
  const [errMsg, setErrMsg] = useState('');

  const [fields, setFields] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});
  const [isFlipped, setIsFlipped] = useState(false);

  // Validación en tiempo real
  useEffect(() => {
    const newErrors = {};
    if (touched.number) {
      const raw = fields.number.replace(/\s/g, '');
      if (!raw) newErrors.number = 'Número de tarjeta requerido';
      else if (raw.length < 16) newErrors.number = 'Número incompleto (16 dígitos)';
      else if (!luhnCheck(raw)) newErrors.number = 'Número de tarjeta inválido';
    }
    if (touched.name) {
      if (!fields.name.trim()) newErrors.name = 'Nombre requerido';
      else if (fields.name.trim().length < 3) newErrors.name = 'Ingresa tu nombre completo';
    }
    if (touched.expiry) {
      if (!fields.expiry) newErrors.expiry = 'Fecha requerida';
      else if (!validateExpiry(fields.expiry)) newErrors.expiry = 'Fecha inválida o vencida';
    }
    if (touched.cvv) {
      if (!fields.cvv) newErrors.cvv = 'CVV requerido';
      else if (fields.cvv.length < 3) newErrors.cvv = 'CVV inválido';
    }
    setErrors(newErrors);
  }, [fields, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === 'number') formatted = formatCardNumber(value);
    if (name === 'expiry') formatted = formatExpiry(value);
    if (name === 'cvv')    formatted = formatCvv(value);
    if (name === 'name')   formatted = value.toUpperCase();
    setFields(prev => ({ ...prev, [name]: formatted }));
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
    if (e.target.name === 'cvv') setIsFlipped(false);
  };

  const handleFocus = (e) => {
    if (e.target.name === 'cvv') setIsFlipped(true);
    else setIsFlipped(false);
  };

  const isFormValid = () => {
    const raw = fields.number.replace(/\s/g, '');
    return (
      raw.length === 16 &&
      luhnCheck(raw) &&
      fields.name.trim().length >= 3 &&
      validateExpiry(fields.expiry) &&
      fields.cvv.length >= 3
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ number: true, name: true, expiry: true, cvv: true });
    if (!isFormValid()) return;

    setStep('processing');

    // Simula delay de procesamiento bancario (1.5s - 2.5s)
    await new Promise(res => setTimeout(res, 1500 + Math.random() * 1000));

    try {
      const response = await api.post('/transactions', {
        planId:        plan.planId,
        paymentMethod: 'online',
        status:        'completado',
      });
      const transactionId = response.data.transactionId;

      setStep('success');

      await new Promise(res => setTimeout(res, 1800));

      navigate('/create-landing', {
        state: { transactionId, selectedPlan: plan },
      });

    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo completar la transacción. Intenta de nuevo.';
      setErrMsg(msg);
      setStep('error');
    }
  };

  // ── Render de estados ────────────────────────────────────────────────────

  if (step === 'processing') return <ProcessingScreen />;
  if (step === 'success')    return <SuccessScreen planName={plan?.name} />;
  if (step === 'error')      return <ErrorScreen message={errMsg} onRetry={() => setStep('form')} />;

  // ── Estilos de campo ─────────────────────────────────────────────────────

  const fieldStyle = (name) => ({
    width: '100%',
    padding: '13px 16px',
    background: '#f8fafc',
    border: `1.5px solid ${errors[name] ? '#fca5a5' : touched[name] && !errors[name] ? '#86efac' : '#e2e8f0'}`,
    borderRadius: 12,
    fontSize: '0.95rem',
    fontWeight: 500,
    color: '#0f172a',
    fontFamily: name === 'number' || name === 'expiry' || name === 'cvv' ? "'Courier New', monospace" : 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
    letterSpacing: name === 'number' ? '0.08em' : 'normal',
  });

  const labelStyle = {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#475569',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  };

  const errorStyle = {
    fontSize: '0.72rem',
    color: '#ef4444',
    fontWeight: 600,
    marginTop: 5,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  };

  return (
    <div>
      {/* Layout: 2 columnas en desktop */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
        gap: 32,
        alignItems: 'start',
      }} className="checkout-grid">

        {/* ── Columna izquierda: Formulario ── */}
        <div>
          {/* Tarjeta visual */}
          <div style={{ marginBottom: 28 }}>
            <CreditCard
              number={fields.number}
              name={fields.name}
              expiry={fields.expiry}
              cvv={fields.cvv}
              isFlipped={isFlipped}
            />
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Número */}
              <div>
                <label style={labelStyle}>Número de tarjeta</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="number"
                    value={fields.number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    placeholder="1234 5678 9012 3456"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    style={fieldStyle('number')}
                  />
                  {/* Ícono de red */}
                  <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: '#94a3b8' }}>
                    💳
                  </div>
                </div>
                {errors.number && touched.number && (
                  <p style={errorStyle}>⚠ {errors.number}</p>
                )}
              </div>

              {/* Nombre */}
              <div>
                <label style={labelStyle}>Nombre en la tarjeta</label>
                <input
                  type="text"
                  name="name"
                  value={fields.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  placeholder="NOMBRE APELLIDO"
                  autoComplete="cc-name"
                  style={fieldStyle('name')}
                />
                {errors.name && touched.name && (
                  <p style={errorStyle}>⚠ {errors.name}</p>
                )}
              </div>

              {/* Vencimiento + CVV */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Vencimiento</label>
                  <input
                    type="text"
                    name="expiry"
                    value={fields.expiry}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    placeholder="MM/AA"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    style={fieldStyle('expiry')}
                  />
                  {errors.expiry && touched.expiry && (
                    <p style={errorStyle}>⚠ {errors.expiry}</p>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={fields.cvv}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    placeholder="•••"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    style={fieldStyle('cvv')}
                  />
                  {errors.cvv && touched.cvv && (
                    <p style={errorStyle}>⚠ {errors.cvv}</p>
                  )}
                </div>
              </div>

              {/* Tarjetas demo */}
              <div style={{
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: 12,
                padding: '12px 16px',
                fontSize: '0.78rem',
                color: '#0369a1',
              }}>
                <p style={{ fontWeight: 700, margin: '0 0 6px' }}>🧪 Tarjetas de prueba:</p>
                <p style={{ margin: '0 0 3px', fontFamily: 'monospace' }}>Visa: <strong>4539 1488 0343 6467</strong> · Exp: 12/28 · CVV: 123</p>
                <p style={{ margin: 0, fontFamily: 'monospace' }}>Mastercard: <strong>5425 2334 3010 9903</strong> · Exp: 06/27 · CVV: 456</p>
              </div>

              {/* Botón de pago */}
              <button
                type="submit"
                disabled={!isFormValid()}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  background: isFormValid()
                    ? 'linear-gradient(135deg, #1d4ed8, #1e40af)'
                    : '#e2e8f0',
                  color: isFormValid() ? '#fff' : '#94a3b8',
                  border: 'none',
                  borderRadius: 14,
                  fontSize: '1rem',
                  fontWeight: 800,
                  cursor: isFormValid() ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  boxShadow: isFormValid() ? '0 8px 24px rgba(29,78,216,0.35)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  letterSpacing: '-0.01em',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Pagar ${Number(plan?.price || 0).toLocaleString('en-US')} USD
              </button>

              {/* Seguridad */}
              <p style={{
                textAlign: 'center',
                fontSize: '0.73rem',
                color: '#94a3b8',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Encriptado SSL · Pago seguro · No guardamos datos de tarjeta
              </p>
            </div>
          </form>
        </div>

        {/* ── Columna derecha: Resumen ── */}
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 20,
          padding: 28,
          position: 'sticky',
          top: 100,
        }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
            Resumen de compra
          </h3>
          <OrderSummary plan={plan} />
        </div>
      </div>

      {/* Responsive: en mobile el resumen queda debajo */}
      <style>{`
        @media (max-width: 768px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutForm;