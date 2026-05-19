// src/components/molecules/CreditCard.jsx
import React from 'react';

const CARD_NETWORKS = {
  visa:       { label: 'VISA',       color: '#1a1f71' },
  mastercard: { label: 'MASTERCARD', color: '#eb001b' },
  amex:       { label: 'AMEX',       color: '#007bc1' },
  default:    { label: '',           color: '#1e293b' },
};

function detectNetwork(number) {
  const n = number.replace(/\s/g, '');
  if (n.startsWith('4'))         return 'visa';
  if (/^5[1-5]/.test(n))        return 'mastercard';
  if (/^3[47]/.test(n))         return 'amex';
  return 'default';
}

const CreditCard = ({ number = '', name = '', expiry = '', cvv = '', isFlipped = false }) => {
  const network    = detectNetwork(number);
  const netConfig  = CARD_NETWORKS[network];
  const displayNum = number.padEnd(19, ' ').replace(/(.{4})/g, '$1 ').trim();

  return (
    <div
      style={{
        perspective: '1000px',
        width: '100%',
        maxWidth: 380,
        height: 220,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ── FRENTE ──────────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: 20,
            padding: '28px 32px',
            background: `linear-gradient(135deg, #1e293b 0%, #0f172a 60%, #1e3a5f 100%)`,
            boxShadow: '0 32px 64px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            userSelect: 'none',
          }}
        >
          {/* Decoración fondo */}
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 200, height: 200,
            borderRadius: '50%',
            background: 'rgba(59,130,246,0.08)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -40, left: -40,
            width: 160, height: 160,
            borderRadius: '50%',
            background: 'rgba(99,102,241,0.07)',
            pointerEvents: 'none',
          }} />

          {/* Fila superior: chip + red */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            {/* Chip EMV */}
            <div style={{
              width: 44, height: 34,
              background: 'linear-gradient(135deg, #d4a843 0%, #f5d07a 40%, #c8922a 100%)',
              borderRadius: 6,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gridTemplateRows: '1fr 1fr 1fr',
              gap: 2,
              padding: 5,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}>
              {[...Array(9)].map((_, i) => (
                <div key={i} style={{
                  background: i === 4 ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.08)',
                  borderRadius: 1,
                }} />
              ))}
            </div>

            {/* Red de pago */}
            <div style={{
              fontSize: network === 'visa' ? '1.3rem' : '0.7rem',
              fontWeight: 900,
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: '0.05em',
              fontFamily: 'monospace',
            }}>
              {network === 'visa' && (
                <span style={{
                  fontStyle: 'italic',
                  fontSize: '1.5rem',
                  fontFamily: 'Georgia, serif',
                  letterSpacing: '-0.02em',
                }}>VISA</span>
              )}
              {network === 'mastercard' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: -8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#eb001b', opacity: 0.9 }} />
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f79e1b', marginLeft: -10, opacity: 0.9 }} />
                </div>
              )}
              {network === 'amex' && (
                <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>AMERICAN<br/>EXPRESS</span>
              )}
              {network === 'default' && (
                <div style={{
                  width: 36, height: 22,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.15)',
                }} />
              )}
            </div>
          </div>

          {/* Número */}
          <div style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '1.3rem',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '0.18em',
            textShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}>
            {displayNum || '•••• •••• •••• ••••'}
          </div>

          {/* Fila inferior: nombre + vencimiento */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>
                Titular
              </div>
              <div style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.9)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                maxWidth: 180,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {name || 'NOMBRE APELLIDO'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>
                Vence
              </div>
              <div style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.9)',
              }}>
                {expiry || 'MM/AA'}
              </div>
            </div>
          </div>
        </div>

        {/* ── DORSO ───────────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: 20,
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
            overflow: 'hidden',
            userSelect: 'none',
          }}
        >
          {/* Banda magnética */}
          <div style={{
            marginTop: 32,
            height: 46,
            background: '#111827',
            width: '100%',
          }} />

          {/* Firma + CVV */}
          <div style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              flex: 1,
              height: 36,
              background: 'repeating-linear-gradient(90deg, #e2e8f0 0px, #e2e8f0 6px, #cbd5e1 6px, #cbd5e1 8px)',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 8,
            }}>
              <span style={{ fontSize: '0.6rem', color: '#64748b', fontStyle: 'italic' }}>Firma autorizada</span>
            </div>
            <div style={{
              background: '#fff',
              borderRadius: 6,
              padding: '6px 14px',
              textAlign: 'center',
              minWidth: 56,
            }}>
              <div style={{ fontSize: '0.5rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 2 }}>CVV</div>
              <div style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '1rem',
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '0.12em',
              }}>
                {cvv ? '•'.repeat(cvv.length) : '•••'}
              </div>
            </div>
          </div>

          {/* Texto legal */}
          <div style={{
            padding: '0 32px',
            fontSize: '0.58rem',
            color: 'rgba(255,255,255,0.2)',
            lineHeight: 1.5,
          }}>
            Esta tarjeta es propiedad del banco emisor. Su uso está sujeto al acuerdo del titular.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;