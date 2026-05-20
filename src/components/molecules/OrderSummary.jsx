// src/components/molecules/OrderSummary.jsx
import React from 'react';
import { ShieldCheck, Zap, Lock } from 'lucide-react';

const PLAN_DETAILS = {
  básico:     { emoji: '🌱', color: '#3b82f6', bg: '#eff6ff', features: ['Landing page con IA', 'Hero + características', 'Footer de contacto', 'HTML listo para publicar'] },
  basico:     { emoji: '🌱', color: '#3b82f6', bg: '#eff6ff', features: ['Landing page con IA', 'Hero + características', 'Footer de contacto', 'HTML listo para publicar'] },
  intermedio: { emoji: '🚀', color: '#6366f1', bg: '#eef2ff', features: ['Todo lo del plan Básico', 'Motor IA avanzado', 'Paleta de colores personalizable', 'Testimonios + FAQ + Urgencia', 'Control de tono y audiencia'] },
  premium:    { emoji: '✦', color: '#d97706', bg: '#fffbeb', features: ['Todo lo del plan Intermedio', 'Motor IA élite (Claude 3.5)', 'Control tipográfico completo', 'Animaciones y efectos avanzados', 'Copywriting nivel experto', 'Soporte prioritario'] },
};

const OrderSummary = ({ plan }) => {
  if (!plan) return null;

  const key     = plan.name?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') || 'basico';
  const details = PLAN_DETAILS[key] || PLAN_DETAILS.basico;
  const price   = Number(plan.price);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Cabecera del plan */}
      <div style={{
        background: details.bg,
        border: `1.5px solid ${details.color}22`,
        borderRadius: 16,
        padding: '20px 24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: '1.4rem' }}>{details.emoji}</span>
              <span style={{
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#0f172a',
              }}>
                Plan {plan.name}
              </span>
            </div>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: details.color,
              background: `${details.color}18`,
              padding: '2px 10px',
              borderRadius: 9999,
              border: `1px solid ${details.color}30`,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              Pago único · Sin suscripción
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: details.color, lineHeight: 1, letterSpacing: '-0.03em' }}>
              ${price.toLocaleString('en-US')}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>USD</div>
          </div>
        </div>

        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {details.features.map((f, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#334155' }}>
              <span style={{ color: details.color, fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>✓</span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Subtotal */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b' }}>
          <span>Subtotal</span>
          <span>${price.toLocaleString('en-US')} USD</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b' }}>
          <span>IVA (0%)</span>
          <span>$0.00</span>
        </div>
        <div style={{ height: 1, background: '#e2e8f0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
          <span>Total a pagar</span>
          <span style={{ color: details.color }}>${price.toLocaleString('en-US')} USD</span>
        </div>
      </div>

      {/* Garantías */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { icon: Lock,        text: 'Pago 100% seguro y encriptado' },
          { icon: ShieldCheck, text: 'Sin cargos recurrentes ni ocultos' },
          { icon: Zap,         text: 'Acceso inmediato tras el pago' },
        ].map(({ icon: Icon, text }, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem', color: '#64748b' }}>
            <Icon size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
            {text}
          </div>
        ))}
      </div>

    </div>
  );
};

export default OrderSummary;