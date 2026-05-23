import React, { useState } from 'react';

const CATEGORY_COLORS = {
  'Tecnología':   { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
  'E-commerce':   { bg: '#faf5ff', text: '#7c3aed', border: '#e9d5ff' },
  'Salud':        { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
  'Freelance':    { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
  'Gastronomía':  { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  'Inmobiliaria': { bg: '#f0f9ff', text: '#0284c7', border: '#bae6fd' },
};

const DEFAULT_COLOR = { bg: '#eef2ff', text: '#4f46e5', border: '#c7d2fe' };

// ── Fallback local sin dependencias externas ───────────────────────────────
const ImageFallback = ({ title, catColor }) => (
  <div style={{
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: '10px',
    background: `linear-gradient(135deg, ${catColor.bg} 0%, #f8fafc 100%)`,
    borderBottom: `1px solid ${catColor.border}`,
  }}>
    <svg
      width="44" height="44" viewBox="0 0 24 24"
      fill="none" stroke={catColor.text}
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ opacity: 0.45 }}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
    <span style={{
      fontSize: '0.72rem', fontWeight: 700,
      color: catColor.text, opacity: 0.55,
      letterSpacing: '0.03em', textAlign: 'center',
      padding: '0 16px',
    }}>
      {title}
    </span>
  </div>
);

const TemplateCard = ({ template }) => {
  const [hovered, setHovered]   = useState(false);
  const [imgError, setImgError] = useState(false); // ← nuevo
  const catColor = CATEGORY_COLORS[template.category] || DEFAULT_COLOR;

  return (
    <div
      className="group relative flex flex-col overflow-hidden cursor-pointer select-none"
      style={{
        borderRadius: '20px',
        background: '#ffffff',
        border: hovered ? '1px solid #cbd5e1' : '1px solid #e2e8f0',
        boxShadow: hovered
          ? '0 20px 48px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)'
          : '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
        transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Bloque de imagen ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height: '210px', flexShrink: 0 }}>

        {imgError ? (
          <ImageFallback title={template.title} catColor={catColor} />
        ) : (
          // Imagen normal
          <img
            src={template.imageUrl}
            alt={template.title}
            loading="lazy"
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'top',
              transform: hovered ? 'scale(1.07)' : 'scale(1)',
              transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
              display: 'block',
            }}
            onError={() => setImgError(true)} // ← activa fallback local
          />
        )}

        {/* Gradiente inferior — solo cuando imagen carga OK */}
        {!imgError && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.35) 100%)',
            pointerEvents: 'none',
          }} />
        )}

        {/* Overlay "Ver demo" en hover — solo cuando imagen carga OK */}
        {!imgError && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(15,23,42,0.55)',
            backdropFilter: 'blur(2px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: hovered ? 'auto' : 'none',
          }}>
            <button style={{
              padding: '10px 26px',
              background: '#ffffff',
              color: '#0f172a',
              fontWeight: '800',
              fontSize: '0.8rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transform: hovered ? 'translateY(0)' : 'translateY(10px)',
              transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            }}>
              Próximamente...
            </button>
          </div>
        )}

        {/* Badge de categoría — siempre visible */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          padding: '4px 12px',
          background: catColor.bg,
          color: catColor.text,
          border: `1px solid ${catColor.border}`,
          borderRadius: '9999px',
          fontSize: '0.68rem', fontWeight: '700',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          {template.category}
        </div>

        {/* Badge "Responsive" — siempre visible */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '4px 10px',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(8px)',
          borderRadius: '9999px',
          border: '1px solid rgba(0,0,0,0.08)',
        }}>
          <span style={{
            width: '6px', height: '6px',
            background: '#22c55e', borderRadius: '50%', flexShrink: 0,
          }} />
          <span style={{ color: '#475569', fontSize: '0.68rem', fontWeight: '600' }}>
            Responsive
          </span>
        </div>
      </div>

      {/* ── Info card ───────────────────────────────────────────────────── */}
      <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <h3 style={{
            margin: 0, fontSize: '0.97rem', fontWeight: '700',
            color: '#0f172a', lineHeight: '1.3', letterSpacing: '-0.01em',
          }}>
            {template.title}
          </h3>

          <div style={{
            flexShrink: 0, width: '28px', height: '28px', borderRadius: '8px',
            background: hovered ? catColor.bg : '#f8fafc',
            border: `1px solid ${hovered ? catColor.border : '#e2e8f0'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: hovered ? 'rotate(-45deg)' : 'rotate(0deg)',
            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            color: hovered ? catColor.text : '#94a3b8',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        <p style={{
          margin: 0, fontSize: '0.82rem',
          color: '#64748b', lineHeight: '1.6', flex: 1,
        }}>
          {template.description}
        </p>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: '12px', borderTop: '1px solid #f1f5f9',
        }}>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {[8, 14, 6, 10, 5].map((w, i) => (
              <div key={i} style={{
                width: `${hovered ? w + 3 : w}px`, height: '3px',
                borderRadius: '9999px',
                background: i === 1 ? catColor.text : '#e2e8f0',
                transition: `width ${0.2 + i * 0.06}s ease`,
              }} />
            ))}
          </div>
          <span style={{ fontSize: '0.68rem', color: '#cbd5e1', fontWeight: '600', letterSpacing: '0.05em' }}>
            IA-Ready
          </span>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;