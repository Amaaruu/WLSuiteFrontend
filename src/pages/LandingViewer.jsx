// src/pages/LandingViewer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';

// ─── Mapa hex de colores (sincronizado con ColorSwatch.jsx) ───────────────
const COLOR_HEX_MAP = {
  'azul-marino':    '#1e3a5f',
  'azul-cielo':     '#3b82f6',
  'verde-bosque':   '#166534',
  'verde-menta':    '#10b981',
  'terracota':      '#b5541c',
  'rojo-vibrante':  '#dc2626',
  'morado':         '#7c3aed',
  'rosa':           '#db2777',
  'negro':          '#111827',
  'gris-oscuro':    '#374151',
  'gris-neutro':    '#9ca3af',
  'blanco':         '#ffffff',
  'crema':          '#fef9f0',
  'amarillo-dorado':'#d97706',
  'naranja':        '#ea580c',
  'cian':           '#0891b2',
};

// ─── Utilidades de color ──────────────────────────────────────────────────
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

function lighten(hex, amount = 0.9) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lr = Math.round(r + (255 - r) * amount);
  const lg = Math.round(g + (255 - g) * amount);
  const lb = Math.round(b + (255 - b) * amount);
  return `#${lr.toString(16).padStart(2, '0')}${lg.toString(16).padStart(2, '0')}${lb.toString(16).padStart(2, '0')}`;
}

function darken(hex, amount = 0.3) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const dr = Math.round(r * (1 - amount));
  const dg = Math.round(g * (1 - amount));
  const db = Math.round(b * (1 - amount));
  return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;
}

// ─── Construcción del tema desde _theme o designPreferences ──────────────
function buildTheme(aiMetadata, designPreferences) {
  // Prioridad: _theme inyectado por Python > designPreferences del backend > defaults
  const t = aiMetadata?._theme || {};
  const dp = designPreferences || {};

  const primaryKey   = dp.primaryColor   || 'azul-marino';
  const secondaryKey = dp.secondaryColor || 'azul-cielo';
  const baseMode     = t.baseMode || dp.baseMode || 'claro';
  const isDark       = baseMode === 'oscuro';

  const primaryHex   = t.primaryColor   || COLOR_HEX_MAP[primaryKey]   || '#1e3a5f';
  const secondaryHex = t.secondaryColor || COLOR_HEX_MAP[secondaryKey] || '#3b82f6';

  const LIGHT_COLORS = ['blanco', 'crema', 'amarillo-dorado', 'gris-neutro'];
  const primaryText   = LIGHT_COLORS.includes(primaryKey)   ? '#111827' : '#ffffff';
  const secondaryText = LIGHT_COLORS.includes(secondaryKey) ? '#111827' : '#ffffff';

  return {
    primaryColor:   primaryHex,
    secondaryColor: secondaryHex,
    primaryDark:    darken(primaryHex, 0.2),
    primaryLight:   lighten(primaryHex, 0.88),
    secondaryLight: lighten(secondaryHex, 0.88),
    primaryRgb:     hexToRgb(primaryHex),
    secondaryRgb:   hexToRgb(secondaryHex),
    primaryText,
    secondaryText,
    fontImport:     t.fontImport   || 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
    fontFamily:     t.fontFamily   || "'Inter', sans-serif",
    baseMode,
    isDark,
    bgPrimary:      t.bgPrimary    || (isDark ? '#0f172a' : '#ffffff'),
    bgSecondary:    t.bgSecondary  || (isDark ? '#1e293b' : '#f8fafc'),
    textBase:       t.textBase     || (isDark ? '#f1f5f9' : '#0f172a'),
    textMuted:      t.textMuted    || (isDark ? '#94a3b8' : '#64748b'),
    cardBg:         t.cardBg       || (isDark ? '#1e293b' : '#ffffff'),
    cardBorder:     t.cardBorder   || (isDark ? '#334155' : '#e2e8f0'),
    buttonShape:    t.buttonShape  || dp.buttonShape  || 'redondeado',
    animationLevel: t.animationLevel || dp.animationLevel || 'sutil',
    visualStyle:    t.visualStyle  || dp.visualStyle  || 'moderno',
  };
}

// ─── Botón dinámico según tema ────────────────────────────────────────────
function getButtonStyles(theme) {
  const radiusMap = {
    cuadrado:   '4px',
    redondeado: '10px',
    pildora:    '9999px',
  };
  const radius = radiusMap[theme.buttonShape] || '10px';

  return {
    primary: {
      backgroundColor: theme.primaryColor,
      color: theme.primaryText,
      borderRadius: radius,
      border: `2px solid ${theme.primaryColor}`,
      padding: '14px 32px',
      fontWeight: '700',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'inline-block',
      textDecoration: 'none',
      letterSpacing: '-0.01em',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: theme.primaryColor,
      borderRadius: radius,
      border: `2px solid ${theme.primaryColor}`,
      padding: '14px 32px',
      fontWeight: '700',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'inline-block',
      textDecoration: 'none',
    },
  };
}

// ─── CSS de animaciones inline ────────────────────────────────────────────
const ANIMATION_CSS = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to   { opacity: 1; transform: scale(1); }
  }
  .wls-animate-fade-up  { animation: fadeUp  0.7s cubic-bezier(0.22,1,0.36,1) both; }
  .wls-animate-fade-in  { animation: fadeIn  0.5s ease both; }
  .wls-animate-scale-in { animation: scaleIn 0.6s cubic-bezier(0.22,1,0.36,1) both; }
  .wls-d1  { animation-delay: 0.1s; }
  .wls-d2  { animation-delay: 0.2s; }
  .wls-d3  { animation-delay: 0.3s; }
  .wls-d4  { animation-delay: 0.4s; }
  .wls-d5  { animation-delay: 0.5s; }
  .wls-d6  { animation-delay: 0.6s; }
  .wls-btn-hover:hover { filter: brightness(0.9); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.18); }
  .wls-card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(0,0,0,0.12); }
  .wls-card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
`;

// ─── Generador HTML standalone para descarga ─────────────────────────────
function generateStandaloneHTML(landingData, theme, projectName) {
  const btnStyles = getButtonStyles(theme);

  const heroSection = landingData.hero ? `
    <header style="position:relative; padding: 120px 24px 80px; background: linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.primaryDark} 100%); overflow:hidden; text-align:center;">
      <div style="position:absolute;inset:0;background:url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2220%22 cy=%2220%22 r=%2260%22 fill=%22rgba(255,255,255,0.04)%22/><circle cx=%2280%22 cy=%2280%22 r=%2240%22 fill=%22rgba(255,255,255,0.04)%22/></svg>');background-size:cover;"></div>
      <div style="position:relative;max-width:800px;margin:0 auto;">
        <div style="display:inline-block;padding:6px 16px;background:rgba(255,255,255,0.15);backdrop-filter:blur(8px);border-radius:9999px;color:rgba(255,255,255,0.9);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:24px;">${projectName}</div>
        <h1 style="font-size:clamp(2.5rem,6vw,4.5rem);font-weight:900;color:#ffffff;margin:0 0 24px;line-height:1.05;letter-spacing:-0.03em;">${landingData.hero.headline || ''}</h1>
        <p style="font-size:1.25rem;color:rgba(255,255,255,0.8);margin:0 auto 40px;max-width:600px;line-height:1.7;">${landingData.hero.subheadline || ''}</p>
        ${landingData.hero.ctaButton ? `<a href="#contacto" style="display:inline-block;padding:16px 40px;background:#ffffff;color:${theme.primaryColor};border-radius:${btnStyles.primary.borderRadius};font-weight:800;font-size:1.05rem;text-decoration:none;box-shadow:0 8px 32px rgba(0,0,0,0.25);letter-spacing:-0.01em;">${landingData.hero.ctaButton}</a>` : ''}
        ${landingData.hero.supportingText ? `<p style="margin-top:20px;font-size:0.9rem;color:rgba(255,255,255,0.6);">${landingData.hero.supportingText}</p>` : ''}
      </div>
    </header>` : '';

  const featuresSection = landingData.features?.length ? `
    <section style="padding:96px 24px;background:${theme.bgSecondary};">
      <div style="max-width:1100px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:64px;">
          <span style="display:inline-block;padding:4px 14px;background:${theme.primaryLight};color:${theme.primaryColor};border-radius:9999px;font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:16px;">Características</span>
          <h2 style="font-size:clamp(1.8rem,4vw,2.8rem);font-weight:800;color:${theme.textBase};margin:0;letter-spacing:-0.02em;">Por qué elegirnos</h2>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:28px;">
          ${landingData.features.map((f, i) => `
            <div style="background:${theme.cardBg};border:1px solid ${theme.cardBorder};border-radius:20px;padding:36px;box-shadow:0 2px 16px rgba(0,0,0,0.06);">
              <div style="width:52px;height:52px;background:${theme.primaryLight};border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:24px;font-size:1.5rem;font-weight:900;color:${theme.primaryColor};">${i + 1}</div>
              <h3 style="font-size:1.15rem;font-weight:700;color:${theme.textBase};margin:0 0 12px;">${f.title || ''}</h3>
              <p style="font-size:0.95rem;color:${theme.textMuted};line-height:1.75;margin:0;">${f.description || ''}</p>
            </div>`).join('')}
        </div>
      </div>
    </section>` : '';

  const testimonialsSection = landingData.testimonials?.length ? `
    <section style="padding:96px 24px;background:${theme.bgPrimary};">
      <div style="max-width:1100px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:64px;">
          <span style="display:inline-block;padding:4px 14px;background:${theme.primaryLight};color:${theme.primaryColor};border-radius:9999px;font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:16px;">Testimonios</span>
          <h2 style="font-size:clamp(1.8rem,4vw,2.8rem);font-weight:800;color:${theme.textBase};margin:0;letter-spacing:-0.02em;">Lo que dicen nuestros clientes</h2>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;">
          ${landingData.testimonials.map(t => `
            <div style="background:${theme.cardBg};border:1px solid ${theme.cardBorder};border-radius:20px;padding:36px;box-shadow:0 2px 16px rgba(0,0,0,0.06);">
              <div style="display:flex;margin-bottom:16px;">${'★'.repeat(5).split('').map(() => `<span style="color:#f59e0b;font-size:1rem;">★</span>`).join('')}</div>
              <p style="font-size:1rem;color:${theme.textBase};line-height:1.75;margin:0 0 24px;font-style:italic;">"${t.quote || ''}"</p>
              <div style="display:flex;align-items:center;gap:12px;">
                <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,${theme.primaryColor},${theme.secondaryColor});display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:0.9rem;">${(t.name || 'U')[0].toUpperCase()}</div>
                <div>
                  <p style="font-weight:700;color:${theme.textBase};margin:0;font-size:0.9rem;">${t.name || ''}</p>
                  ${t.role ? `<p style="color:${theme.textMuted};margin:0;font-size:0.8rem;">${t.role}</p>` : ''}
                </div>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </section>` : '';

  const faqSection = landingData.faq?.length ? `
    <section style="padding:96px 24px;background:${theme.bgSecondary};">
      <div style="max-width:760px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:64px;">
          <span style="display:inline-block;padding:4px 14px;background:${theme.primaryLight};color:${theme.primaryColor};border-radius:9999px;font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:16px;">FAQ</span>
          <h2 style="font-size:clamp(1.8rem,4vw,2.8rem);font-weight:800;color:${theme.textBase};margin:0;letter-spacing:-0.02em;">Preguntas frecuentes</h2>
        </div>
        ${landingData.faq.map(item => `
          <div style="border-bottom:1px solid ${theme.cardBorder};padding:28px 0;">
            <h3 style="font-size:1.05rem;font-weight:700;color:${theme.textBase};margin:0 0 12px;">${item.question || ''}</h3>
            <p style="font-size:0.95rem;color:${theme.textMuted};line-height:1.75;margin:0;">${item.answer || ''}</p>
          </div>`).join('')}
      </div>
    </section>` : '';

  const pricingSection = landingData.pricing?.plans?.length ? `
    <section style="padding:96px 24px;background:${theme.bgPrimary};">
      <div style="max-width:1100px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:64px;">
          <span style="display:inline-block;padding:4px 14px;background:${theme.primaryLight};color:${theme.primaryColor};border-radius:9999px;font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:16px;">Precios</span>
          <h2 style="font-size:clamp(1.8rem,4vw,2.8rem);font-weight:800;color:${theme.textBase};margin:0 0 16px;letter-spacing:-0.02em;">${landingData.pricing.title || 'Nuestros planes'}</h2>
          ${landingData.pricing.subtitle ? `<p style="font-size:1.1rem;color:${theme.textMuted};">${landingData.pricing.subtitle}</p>` : ''}
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;align-items:start;">
          ${landingData.pricing.plans.map((plan, i) => {
            const isFeatured = plan.featured || i === 1;
            return `
            <div style="border-radius:24px;padding:40px 32px;border:${isFeatured ? `2px solid ${theme.primaryColor}` : `1px solid ${theme.cardBorder}`};background:${isFeatured ? theme.primaryColor : theme.cardBg};box-shadow:${isFeatured ? `0 20px 48px rgba(${theme.primaryRgb},0.3)` : '0 2px 16px rgba(0,0,0,0.06)'};position:relative;">
              ${isFeatured ? `<div style="position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:${theme.secondaryColor};color:${theme.secondaryText};padding:4px 16px;border-radius:9999px;font-size:0.75rem;font-weight:800;white-space:nowrap;">MÁS POPULAR</div>` : ''}
              <h3 style="font-size:1.2rem;font-weight:700;color:${isFeatured ? '#fff' : theme.textBase};margin:0 0 8px;">${plan.name || ''}</h3>
              <div style="font-size:2.5rem;font-weight:900;color:${isFeatured ? '#fff' : theme.primaryColor};margin:16px 0 8px;letter-spacing:-0.03em;">${plan.price || ''}</div>
              ${plan.period ? `<p style="font-size:0.85rem;color:${isFeatured ? 'rgba(255,255,255,0.7)' : theme.textMuted};margin:0 0 24px;">${plan.period}</p>` : ''}
              <ul style="list-style:none;padding:0;margin:0 0 32px;">
                ${(plan.benefits || []).map(b => `<li style="display:flex;align-items:center;gap:10px;padding:8px 0;font-size:0.9rem;color:${isFeatured ? 'rgba(255,255,255,0.9)' : theme.textBase};border-bottom:1px solid ${isFeatured ? 'rgba(255,255,255,0.1)' : theme.cardBorder};"><span style="color:${isFeatured ? '#fff' : theme.primaryColor};font-size:1rem;">✓</span>${b}</li>`).join('')}
              </ul>
              <a href="#contacto" style="display:block;text-align:center;padding:14px 24px;background:${isFeatured ? '#fff' : theme.primaryColor};color:${isFeatured ? theme.primaryColor : theme.primaryText};border-radius:${btnStyles.primary.borderRadius};font-weight:700;text-decoration:none;font-size:0.95rem;">Comenzar ahora</a>
            </div>`;
          }).join('')}
        </div>
      </div>
    </section>` : '';

  const urgencySection = landingData.urgency ? `
    <section style="padding:80px 24px;background:linear-gradient(135deg,${theme.primaryColor},${theme.primaryDark});text-align:center;">
      <div style="max-width:700px;margin:0 auto;">
        <h2 style="font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;color:#ffffff;margin:0 0 16px;letter-spacing:-0.02em;">${landingData.urgency.title || ''}</h2>
        ${landingData.urgency.countdown ? `<p style="font-size:1.1rem;color:rgba(255,255,255,0.8);margin:0 0 32px;">⏱ ${landingData.urgency.countdown}</p>` : ''}
        ${landingData.urgency.ctaButton ? `<a href="#contacto" style="display:inline-block;padding:16px 40px;background:#ffffff;color:${theme.primaryColor};border-radius:${btnStyles.primary.borderRadius};font-weight:800;font-size:1.05rem;text-decoration:none;">${landingData.urgency.ctaButton}</a>` : ''}
      </div>
    </section>` : '';

  const footerSection = landingData.footer ? `
    <footer id="contacto" style="padding:64px 24px;background:${theme.isDark ? '#020617' : '#0f172a'};text-align:center;">
      <div style="font-size:1.6rem;font-weight:900;color:#ffffff;margin-bottom:16px;">${projectName}</div>
      ${landingData.footer.tagline ? `<p style="color:#94a3b8;margin:0 0 24px;font-size:0.95rem;">${landingData.footer.tagline}</p>` : ''}
      ${landingData.footer.contact ? `<a href="mailto:${landingData.footer.contact}" style="color:${theme.secondaryColor};font-weight:600;text-decoration:none;">${landingData.footer.contact}</a>` : ''}
      <p style="margin:32px 0 0;color:#475569;font-size:0.8rem;">© ${new Date().getFullYear()} ${projectName}. Todos los derechos reservados.</p>
    </footer>` : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${theme.fontImport}" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: ${theme.fontFamily};
      background-color: ${theme.bgPrimary};
      color: ${theme.textBase};
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    img { max-width: 100%; height: auto; display: block; }
    @media (max-width: 640px) {
      h1 { font-size: 2.2rem !important; }
      h2 { font-size: 1.8rem !important; }
      div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
    }
  </style>
</head>
<body>
${heroSection}
${featuresSection}
${testimonialsSection}
${faqSection}
${pricingSection}
${urgencySection}
${footerSection}
</body>
</html>`;
}

// ─── Componentes internos del viewer ─────────────────────────────────────

function SectionBadge({ label, theme }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 14px',
      background: theme.primaryLight,
      color: theme.primaryColor,
      borderRadius: '9999px',
      fontSize: '0.72rem',
      fontWeight: '700',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: '16px',
    }}>
      {label}
    </span>
  );
}

function SectionTitle({ children, theme }) {
  return (
    <h2 style={{
      fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
      fontWeight: '800',
      color: theme.textBase,
      margin: '0',
      letterSpacing: '-0.02em',
      lineHeight: '1.15',
    }}>
      {children}
    </h2>
  );
}

// ─── LandingViewer principal ──────────────────────────────────────────────
const LandingViewer = () => {
  const { id }          = useParams();
  const [searchParams]  = useSearchParams();
  const token           = searchParams.get('token');

  const [landingData,       setLandingData]       = useState(null);
  const [designPreferences, setDesignPreferences] = useState(null);
  const [projectName,       setProjectName]       = useState('Landing Page');
  const [error,             setError]             = useState(null);
  const [isLoading,         setIsLoading]         = useState(true);
  const [isDownloading,     setIsDownloading]     = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    if (!token) {
      setError('Acceso denegado: Token no proporcionado.');
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const envBase  = import.meta.env.VITE_API_BASE_URL || 'https://landingbackend-s1rk.onrender.com/api/v1';
        const serverUrl = envBase.replace(/\/api\/v1\/?$/, '');
        const response  = await axios.get(`${serverUrl}/landings/${id}?token=${token}`);

        setLandingData(response.data.aiMetadata);
        setDesignPreferences(response.data.designPreferences || null);
        setProjectName(response.data.projectName || 'Landing Page');
      } catch (err) {
        setError(err.response?.data?.error || 'El enlace ha expirado o no es válido.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  // Inyectar font en el head cuando el tema esté listo
  useEffect(() => {
    if (!landingData) return;
    const theme = buildTheme(landingData, designPreferences);
    const existing = document.getElementById('wls-font-import');
    if (!existing) {
      const link = document.createElement('link');
      link.id   = 'wls-font-import';
      link.rel  = 'stylesheet';
      link.href = theme.fontImport;
      document.head.appendChild(link);
    }
  }, [landingData, designPreferences]);

  const handleDownload = () => {
    if (!landingData) return;
    setIsDownloading(true);
    try {
      const theme = buildTheme(landingData, designPreferences);
      const html  = generateStandaloneHTML(landingData, theme, projectName);
      const blob  = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url   = URL.createObjectURL(blob);
      const a     = document.createElement('a');
      a.href      = url;
      a.download  = `${projectName.toLowerCase().replace(/\s+/g, '-')}-landing.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  // ── Estados de carga / error ──────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '56px', height: '56px', border: '4px solid #e2e8f0',
            borderTopColor: '#1e3a5f', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 20px',
          }} />
          <p style={{ color: '#64748b', fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>Cargando tu landing page…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '24px' }}>
        <div style={{ background: '#fff', padding: '48px', borderRadius: '24px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', maxWidth: '440px', textAlign: 'center', border: '1px solid #fee2e2' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>Página no disponible</h2>
          <p style={{ color: '#ef4444', fontWeight: '500', marginBottom: '32px', fontFamily: 'Inter, sans-serif' }}>{error}</p>
          <a href="/" style={{ display: 'inline-block', padding: '12px 28px', background: '#0f172a', color: '#fff', borderRadius: '10px', fontWeight: '700', textDecoration: 'none', fontFamily: 'Inter, sans-serif' }}>
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  if (!landingData) return null;

  const theme    = buildTheme(landingData, designPreferences);
  const btnStyle = getButtonStyles(theme);

  return (
    <>
      <style>{ANIMATION_CSS}</style>

      {/* ── Barra de herramientas flotante ─────────────────────────── */}
      <div style={{
        position: 'fixed', top: '16px', right: '16px', zIndex: 9999,
        display: 'flex', gap: '10px', alignItems: 'center',
      }}>
        <div style={{
          background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)',
          borderRadius: '12px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: theme.primaryColor, flexShrink: 0,
          }} />
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: '600', fontFamily: 'Inter,sans-serif', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {projectName}
          </span>
        </div>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px',
            background: theme.primaryColor,
            color: theme.primaryText,
            border: 'none', borderRadius: '10px', cursor: 'pointer',
            fontWeight: '700', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif',
            boxShadow: `0 4px 16px rgba(${theme.primaryRgb}, 0.4)`,
            opacity: isDownloading ? 0.7 : 1,
            transition: 'all 0.2s ease',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          {isDownloading ? 'Descargando...' : 'Descargar HTML'}
        </button>
      </div>

      {/* ── Página completa ─────────────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{
          fontFamily: theme.fontFamily,
          background: theme.bgPrimary,
          color: theme.textBase,
          minHeight: '100vh',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >

        {/* ── HERO ─────────────────────────────────────────────────── */}
        {landingData.hero && (
          <header style={{
            position: 'relative',
            padding: 'clamp(80px, 12vw, 140px) 24px clamp(60px, 8vw, 100px)',
            background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.primaryDark} 100%)`,
            overflow: 'hidden',
            textAlign: 'center',
          }}>
            {/* Fondo decorativo */}
            <div style={{
              position: 'absolute', top: '-30%', left: '-10%',
              width: '60%', height: '200%',
              background: `radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: '-20%', right: '-5%',
              width: '50%', height: '150%',
              background: `radial-gradient(ellipse, rgba(255,255,255,0.05) 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', maxWidth: '860px', margin: '0 auto' }}>
              {/* Badge del proyecto */}
              <div className="wls-animate-fade-in wls-d1" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 18px',
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
                borderRadius: '9999px',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '0.72rem',
                fontWeight: '700',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '28px',
                border: '1px solid rgba(255,255,255,0.2)',
              }}>
                <span style={{ width: '6px', height: '6px', background: '#fff', borderRadius: '50%', flexShrink: 0, animation: 'fadeIn 1s ease infinite alternate' }} />
                {projectName}
              </div>

              <h1
                className="wls-animate-fade-up wls-d2"
                style={{
                  fontSize: 'clamp(2.4rem, 6vw, 4.8rem)',
                  fontWeight: '900',
                  color: '#ffffff',
                  margin: '0 0 24px',
                  lineHeight: '1.05',
                  letterSpacing: '-0.03em',
                }}
              >
                {landingData.hero.headline}
              </h1>

              <p
                className="wls-animate-fade-up wls-d3"
                style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                  color: 'rgba(255,255,255,0.78)',
                  margin: '0 auto 40px',
                  maxWidth: '620px',
                  lineHeight: '1.75',
                }}
              >
                {landingData.hero.subheadline}
              </p>

              {landingData.hero.ctaButton && (
                <div className="wls-animate-fade-up wls-d4" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    className="wls-btn-hover"
                    style={{
                      ...btnStyle.primary,
                      background: '#ffffff',
                      color: theme.primaryColor,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                      fontSize: '1.05rem',
                      padding: '16px 40px',
                    }}
                  >
                    {landingData.hero.ctaButton}
                  </button>
                  {landingData.hero.secondaryCta && (
                    <button className="wls-btn-hover" style={{
                      ...btnStyle.secondary,
                      color: 'rgba(255,255,255,0.85)',
                      borderColor: 'rgba(255,255,255,0.35)',
                      fontSize: '1.05rem',
                      padding: '16px 40px',
                    }}>
                      {landingData.hero.secondaryCta}
                    </button>
                  )}
                </div>
              )}

              {landingData.hero.supportingText && (
                <p className="wls-animate-fade-up wls-d5" style={{
                  marginTop: '20px',
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.5)',
                }}>
                  {landingData.hero.supportingText}
                </p>
              )}
            </div>

            {/* Decorador inferior ondulado */}
            <div style={{
              position: 'absolute', bottom: '-2px', left: 0, right: 0,
              height: '60px', overflow: 'hidden',
            }}>
              <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill={theme.bgSecondary} />
              </svg>
            </div>
          </header>
        )}

        {/* ── FEATURES ──────────────────────────────────────────────── */}
        {landingData.features?.length > 0 && (
          <section style={{ padding: 'clamp(64px, 8vw, 96px) 24px', background: theme.bgSecondary }}>
            <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
              <div className="wls-animate-fade-up" style={{ textAlign: 'center', marginBottom: '56px' }}>
                <SectionBadge label="Características" theme={theme} />
                <SectionTitle theme={theme}>Por qué elegirnos</SectionTitle>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
              }}>
                {landingData.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className={`wls-animate-fade-up wls-card-hover wls-d${Math.min(idx + 1, 6)}`}
                    style={{
                      background: theme.cardBg,
                      border: `1px solid ${theme.cardBorder}`,
                      borderRadius: '20px',
                      padding: '36px 32px',
                      boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div style={{
                      width: '52px', height: '52px',
                      background: theme.primaryLight,
                      borderRadius: '14px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '24px',
                      fontSize: '1.4rem', fontWeight: '900', color: theme.primaryColor,
                    }}>
                      {idx + 1}
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: theme.textBase, margin: '0 0 12px' }}>
                      {feature.title}
                    </h3>
                    <p style={{ fontSize: '0.93rem', color: theme.textMuted, lineHeight: '1.75', margin: '0' }}>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
        {landingData.testimonials?.length > 0 && (
          <section style={{ padding: 'clamp(64px, 8vw, 96px) 24px', background: theme.bgPrimary }}>
            <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
              <div className="wls-animate-fade-up" style={{ textAlign: 'center', marginBottom: '56px' }}>
                <SectionBadge label="Testimonios" theme={theme} />
                <SectionTitle theme={theme}>Lo que dicen nuestros clientes</SectionTitle>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
              }}>
                {landingData.testimonials.map((t, idx) => (
                  <div
                    key={idx}
                    className={`wls-animate-scale-in wls-card-hover wls-d${Math.min(idx + 1, 6)}`}
                    style={{
                      background: theme.cardBg,
                      border: `1px solid ${theme.cardBorder}`,
                      borderRadius: '20px',
                      padding: '36px',
                      boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                    }}
                  >
                    {/* Estrellas */}
                    <div style={{ display: 'flex', gap: '3px', marginBottom: '20px' }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ color: '#f59e0b', fontSize: '1rem' }}>★</span>
                      ))}
                    </div>

                    <p style={{
                      fontSize: '0.97rem', color: theme.textBase, lineHeight: '1.8',
                      margin: '0 0 28px', fontStyle: 'italic',
                      borderLeft: `3px solid ${theme.primaryColor}`,
                      paddingLeft: '16px',
                    }}>
                      "{t.quote}"
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                        background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: '800', fontSize: '1rem',
                      }}>
                        {(t.name || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: '700', color: theme.textBase, margin: '0', fontSize: '0.9rem' }}>{t.name}</p>
                        {t.role && <p style={{ color: theme.textMuted, margin: '0', fontSize: '0.8rem' }}>{t.role}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FAQ ───────────────────────────────────────────────────── */}
        {landingData.faq?.length > 0 && (
          <section style={{ padding: 'clamp(64px, 8vw, 96px) 24px', background: theme.bgSecondary }}>
            <div style={{ maxWidth: '760px', margin: '0 auto' }}>
              <div className="wls-animate-fade-up" style={{ textAlign: 'center', marginBottom: '56px' }}>
                <SectionBadge label="Preguntas frecuentes" theme={theme} />
                <SectionTitle theme={theme}>FAQ</SectionTitle>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {landingData.faq.map((item, idx) => (
                  <FaqItem key={idx} item={item} theme={theme} idx={idx} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── PRICING ───────────────────────────────────────────────── */}
        {landingData.pricing?.plans?.length > 0 && (
          <section style={{ padding: 'clamp(64px, 8vw, 96px) 24px', background: theme.bgPrimary }}>
            <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
              <div className="wls-animate-fade-up" style={{ textAlign: 'center', marginBottom: '56px' }}>
                <SectionBadge label="Precios" theme={theme} />
                <SectionTitle theme={theme}>{landingData.pricing.title || 'Nuestros planes'}</SectionTitle>
                {landingData.pricing.subtitle && (
                  <p style={{ color: theme.textMuted, marginTop: '16px', fontSize: '1.05rem' }}>
                    {landingData.pricing.subtitle}
                  </p>
                )}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '24px',
                alignItems: 'start',
              }}>
                {landingData.pricing.plans.map((plan, idx) => {
                  const isFeatured = plan.featured || idx === 1;
                  return (
                    <div
                      key={idx}
                      className={`wls-animate-fade-up wls-d${Math.min(idx + 1, 4)}`}
                      style={{
                        borderRadius: '24px',
                        padding: '40px 32px',
                        border: isFeatured ? `2px solid ${theme.primaryColor}` : `1px solid ${theme.cardBorder}`,
                        background: isFeatured ? theme.primaryColor : theme.cardBg,
                        boxShadow: isFeatured
                          ? `0 20px 48px rgba(${theme.primaryRgb}, 0.3)`
                          : '0 2px 16px rgba(0,0,0,0.06)',
                        position: 'relative',
                        transform: isFeatured ? 'scale(1.03)' : 'scale(1)',
                      }}
                    >
                      {isFeatured && (
                        <div style={{
                          position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                          background: theme.secondaryColor, color: theme.secondaryText,
                          padding: '4px 18px', borderRadius: '9999px',
                          fontSize: '0.7rem', fontWeight: '800', whiteSpace: 'nowrap', letterSpacing: '0.05em',
                        }}>
                          MÁS POPULAR
                        </div>
                      )}

                      <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: isFeatured ? '#fff' : theme.textBase, margin: '0 0 8px' }}>
                        {plan.name}
                      </h3>
                      <div style={{ fontSize: '2.8rem', fontWeight: '900', color: isFeatured ? '#fff' : theme.primaryColor, margin: '16px 0 4px', letterSpacing: '-0.04em' }}>
                        {plan.price}
                      </div>
                      {plan.period && (
                        <p style={{ fontSize: '0.85rem', color: isFeatured ? 'rgba(255,255,255,0.65)' : theme.textMuted, margin: '0 0 28px' }}>
                          {plan.period}
                        </p>
                      )}

                      <ul style={{ listStyle: 'none', padding: '0', margin: '0 0 32px' }}>
                        {(plan.benefits || []).map((b, i) => (
                          <li key={i} style={{
                            display: 'flex', alignItems: 'flex-start', gap: '10px',
                            padding: '10px 0',
                            fontSize: '0.9rem',
                            color: isFeatured ? 'rgba(255,255,255,0.9)' : theme.textBase,
                            borderBottom: `1px solid ${isFeatured ? 'rgba(255,255,255,0.12)' : theme.cardBorder}`,
                          }}>
                            <span style={{ color: isFeatured ? '#fff' : theme.primaryColor, fontWeight: '700', fontSize: '0.9rem', flexShrink: 0, marginTop: '1px' }}>✓</span>
                            {b}
                          </li>
                        ))}
                      </ul>

                      <button className="wls-btn-hover" style={{
                        width: '100%',
                        padding: '14px 24px',
                        background: isFeatured ? '#fff' : theme.primaryColor,
                        color: isFeatured ? theme.primaryColor : theme.primaryText,
                        border: 'none',
                        borderRadius: btnStyle.primary.borderRadius,
                        fontWeight: '700',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: 'inherit',
                      }}>
                        Comenzar ahora
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── URGENCY ───────────────────────────────────────────────── */}
        {landingData.urgency && (
          <section style={{
            padding: 'clamp(60px, 8vw, 80px) 24px',
            background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.primaryDark} 100%)`,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.04) 0%, transparent 50%)',
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '900', color: '#fff',
                margin: '0 0 16px', letterSpacing: '-0.02em',
              }}>
                {landingData.urgency.title}
              </h2>
              {landingData.urgency.countdown && (
                <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', margin: '0 0 32px' }}>
                  ⏱ {landingData.urgency.countdown}
                </p>
              )}
              {landingData.urgency.ctaButton && (
                <button className="wls-btn-hover" style={{
                  padding: '16px 48px',
                  background: '#ffffff',
                  color: theme.primaryColor,
                  border: 'none',
                  borderRadius: btnStyle.primary.borderRadius,
                  fontWeight: '800',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                }}>
                  {landingData.urgency.ctaButton}
                </button>
              )}
            </div>
          </section>
        )}

        {/* ── FOOTER ────────────────────────────────────────────────── */}
        {landingData.footer && (
          <footer style={{
            padding: 'clamp(48px, 6vw, 72px) 24px',
            background: theme.isDark ? '#020617' : '#0f172a',
            textAlign: 'center',
          }}>
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              <div style={{
                fontSize: '1.5rem', fontWeight: '900', color: '#ffffff',
                marginBottom: '8px', letterSpacing: '-0.02em',
              }}>
                {projectName}
              </div>
              {landingData.footer.tagline && (
                <p style={{ color: '#94a3b8', margin: '0 0 28px', fontSize: '0.95rem' }}>
                  {landingData.footer.tagline}
                </p>
              )}
              {landingData.footer.contact && (
                <a
                  href={`mailto:${landingData.footer.contact}`}
                  style={{ color: theme.secondaryColor, fontWeight: '600', textDecoration: 'none', fontSize: '0.95rem' }}
                >
                  {landingData.footer.contact}
                </a>
              )}
              <p style={{ margin: '32px 0 0', color: '#475569', fontSize: '0.8rem' }}>
                © {new Date().getFullYear()} {projectName}. Todos los derechos reservados.
              </p>
            </div>
          </footer>
        )}

      </div>
    </>
  );
};

// ─── FAQ con acordeón ─────────────────────────────────────────────────────
function FaqItem({ item, theme, idx }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`wls-animate-fade-up wls-d${Math.min(idx + 1, 6)}`}
      style={{
        background: theme.cardBg,
        border: `1px solid ${open ? theme.primaryColor : theme.cardBorder}`,
        borderRadius: '14px',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease',
        marginBottom: '8px',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 24px', background: 'transparent', border: 'none', cursor: 'pointer',
          textAlign: 'left', gap: '16px', fontFamily: 'inherit',
        }}
      >
        <span style={{ fontSize: '0.97rem', fontWeight: '700', color: theme.textBase, lineHeight: '1.4' }}>
          {item.question}
        </span>
        <span style={{
          flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%',
          background: open ? theme.primaryColor : theme.primaryLight,
          color: open ? theme.primaryText : theme.primaryColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.1rem', fontWeight: '700', transition: 'all 0.2s ease',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>
          +
        </span>
      </button>
      {open && (
        <div style={{ padding: '0 24px 20px' }}>
          <p style={{ fontSize: '0.93rem', color: theme.textMuted, lineHeight: '1.75', margin: '0' }}>
            {item.answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default LandingViewer;