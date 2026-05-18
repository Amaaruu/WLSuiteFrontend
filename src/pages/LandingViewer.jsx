import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { generateAndDownloadZip } from '../utils/exportProject';
 
// ── Helpers de color ──────────────────────────────────────────────────────────
const COLOR_HEX_MAP = {
  'azul-marino':    '#1e3a5f', 'azul-cielo':      '#3b82f6',
  'verde-bosque':   '#166534', 'verde-menta':      '#10b981',
  'terracota':      '#b5541c', 'rojo-vibrante':    '#dc2626',
  'morado':         '#7c3aed', 'rosa':             '#db2777',
  'negro':          '#111827', 'gris-oscuro':      '#374151',
  'gris-neutro':    '#9ca3af', 'blanco':           '#ffffff',
  'crema':          '#fef9f0', 'amarillo-dorado':  '#d97706',
  'naranja':        '#ea580c', 'cian':             '#0891b2',
};
 
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `${r}, ${g}, ${b}`;
}
function lighten(hex, a=0.9) {
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
  return `#${Math.round(r+(255-r)*a).toString(16).padStart(2,'0')}${Math.round(g+(255-g)*a).toString(16).padStart(2,'0')}${Math.round(b+(255-b)*a).toString(16).padStart(2,'0')}`;
}
function darken(hex, a=0.15) {
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
  return `#${Math.round(r*(1-a)).toString(16).padStart(2,'0')}${Math.round(g*(1-a)).toString(16).padStart(2,'0')}${Math.round(b*(1-a)).toString(16).padStart(2,'0')}`;
}
 
// ── Construir tema visual ─────────────────────────────────────────────────────
function buildTheme(aiMetadata, designPreferences) {
  const t  = aiMetadata?._theme || {};
  const dp = designPreferences  || {};
  const primaryKey   = dp.primaryColor   || 'azul-marino';
  const secondaryKey = dp.secondaryColor || 'azul-cielo';
  const baseMode     = t.baseMode || dp.baseMode || 'claro';
  const isDark       = baseMode === 'oscuro';
  const primaryHex   = t.primaryColor  || COLOR_HEX_MAP[primaryKey]   || '#1e3a5f';
  const secondaryHex = t.secondaryColor|| COLOR_HEX_MAP[secondaryKey] || '#3b82f6';
  const LIGHT_COLORS = ['blanco','crema','amarillo-dorado','gris-neutro'];
 
  return {
    primaryColor:   primaryHex,
    primaryDark:    t.primaryDark    || darken(primaryHex, 0.15),
    primaryLight:   t.primaryLight   || lighten(primaryHex, 0.9),
    primaryMedium:  t.primaryMedium  || lighten(primaryHex, 0.7),
    primaryRgb:     t.primaryRgb     || hexToRgb(primaryHex),
    primaryText:    LIGHT_COLORS.includes(primaryKey) ? '#111827' : '#ffffff',
    secondaryColor: secondaryHex,
    secondaryLight: t.secondaryLight || lighten(secondaryHex, 0.9),
    secondaryRgb:   t.secondaryRgb   || hexToRgb(secondaryHex),
    secondaryText:  LIGHT_COLORS.includes(secondaryKey) ? '#111827' : '#ffffff',
    fontImport:   t.fontImport  || 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
    fontFamily:   t.fontFamily  || "'Inter', sans-serif",
    baseMode, isDark,
    bgPrimary:   t.bgPrimary   || (isDark ? '#0a0a0f' : '#ffffff'),
    bgSecondary: t.bgSecondary || (isDark ? '#13131a' : '#f8f9fc'),
    bgTertiary:  t.bgTertiary  || (isDark ? '#1a1a24' : '#f0f2f8'),
    textBase:    t.textBase    || (isDark ? '#f0f0f5' : '#0a0a1a'),
    textMuted:   t.textMuted   || (isDark ? '#9090a0' : '#52526a'),
    cardBg:      t.cardBg      || (isDark ? '#1a1a24' : '#ffffff'),
    cardBorder:  t.cardBorder  || (isDark ? '#2a2a3a' : '#e4e6f0'),
    buttonShape:    t.buttonShape    || dp.buttonShape    || 'redondeado',
    animationLevel: t.animationLevel || dp.animationLevel || 'sutil',
    visualStyle:    t.visualStyle    || dp.visualStyle    || 'moderno',
    scrollEffect:   t.scrollEffect   || dp.scrollEffect   || 'fade-in',
  };
}
 
// ── Radios de botones ─────────────────────────────────────────────────────────
function getBtnRadius(shape) {
  return { cuadrado:'6px', redondeado:'12px', pildora:'9999px' }[shape] || '12px';
}
 
// ── CSS global inyectado en el head ──────────────────────────────────────────
const GLOBAL_CSS = (theme) => {
  const r = getBtnRadius(theme.buttonShape);
  return `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: ${theme.fontFamily}; background: ${theme.bgPrimary}; color: ${theme.textBase}; -webkit-font-smoothing: antialiased; }
 
  /* Animaciones scroll-reveal */
  .sr { opacity: 0; transform: translateY(32px); transition: opacity .65s cubic-bezier(.22,1,.36,1), transform .65s cubic-bezier(.22,1,.36,1); }
  .sr.visible { opacity: 1; transform: none; }
  .sr-delay-1 { transition-delay: .1s; }
  .sr-delay-2 { transition-delay: .2s; }
  .sr-delay-3 { transition-delay: .3s; }
  .sr-delay-4 { transition-delay: .4s; }
  .sr-delay-5 { transition-delay: .5s; }
  .sr-delay-6 { transition-delay: .6s; }
 
  /* Botones */
  .btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 16px 36px; background: ${theme.primaryColor}; color: ${theme.primaryText};
    border-radius: ${r}; font-weight: 700; font-size: 1.05rem;
    border: 2px solid ${theme.primaryColor}; cursor: pointer; text-decoration: none;
    transition: transform .2s, box-shadow .2s, background .2s;
    box-shadow: 0 4px 20px rgba(${theme.primaryRgb}, 0.35);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(${theme.primaryRgb}, 0.5); background: ${theme.primaryDark}; }
 
  .btn-secondary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 16px 36px; background: transparent; color: ${theme.textBase};
    border-radius: ${r}; font-weight: 600; font-size: 1rem;
    border: 1.5px solid ${theme.cardBorder}; cursor: pointer; text-decoration: none;
    transition: background .2s, border-color .2s;
  }
  .btn-secondary:hover { background: ${theme.bgSecondary}; border-color: ${theme.primaryColor}; color: ${theme.primaryColor}; }
 
  .btn-ghost-white {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 14px 32px; background: rgba(255,255,255,0.12); color: #fff;
    border-radius: ${r}; font-weight: 600; font-size: 0.95rem;
    border: 1.5px solid rgba(255,255,255,0.3); cursor: pointer; text-decoration: none;
    transition: background .2s;
    backdrop-filter: blur(8px);
  }
  .btn-ghost-white:hover { background: rgba(255,255,255,0.22); }
 
  /* Badge */
  .badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 16px; background: ${theme.primaryLight}; color: ${theme.primaryColor};
    border-radius: 9999px; font-size: 0.78rem; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    border: 1px solid ${theme.primaryMedium};
  }
  .badge-white {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 16px; background: rgba(255,255,255,0.15); color: #fff;
    border-radius: 9999px; font-size: 0.78rem; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    border: 1px solid rgba(255,255,255,0.3); backdrop-filter: blur(8px);
  }
 
  /* Cards */
  .card {
    background: ${theme.cardBg}; border: 1px solid ${theme.cardBorder};
    border-radius: 20px; padding: 32px; transition: transform .25s, box-shadow .25s;
  }
  .card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.1); }
 
  .card-featured {
    background: ${theme.primaryColor}; border: none; border-radius: 24px;
    padding: 36px; position: relative;
    box-shadow: 0 20px 64px rgba(${theme.primaryRgb}, 0.35);
  }
 
  /* Section headers */
  .section-tag {
    font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: ${theme.primaryColor}; margin-bottom: 12px;
    display: flex; align-items: center; gap: 8px;
  }
  .section-tag::before {
    content: ''; display: block; width: 24px; height: 2px; background: ${theme.primaryColor};
  }
 
  .section-title {
    font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; line-height: 1.15;
    letter-spacing: -0.02em; color: ${theme.textBase};
  }
  .section-subtitle {
    font-size: 1.15rem; color: ${theme.textMuted}; line-height: 1.75; max-width: 600px; margin: 0 auto;
  }
 
  /* Divider */
  .section-divider { height: 1px; background: ${theme.cardBorder}; margin: 0; }
 
  /* Containers */
  .container { width: 100%; max-width: 1180px; margin: 0 auto; padding: 0 24px; }
  .container-sm { width: 100%; max-width: 820px; margin: 0 auto; padding: 0 24px; }
 
  /* Stars */
  .stars { color: #f59e0b; font-size: 0.95rem; letter-spacing: 2px; }
 
  /* Nav */
  .nav-floating {
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    z-index: 999; display: flex; align-items: center; gap: 12px;
    padding: 10px 20px; border-radius: 9999px;
    background: ${theme.isDark ? 'rgba(10,10,20,0.85)' : 'rgba(255,255,255,0.85)'};
    backdrop-filter: blur(20px); border: 1px solid ${theme.cardBorder};
    box-shadow: 0 8px 40px rgba(0,0,0,0.12);
    font-size: 0.875rem; font-weight: 600; color: ${theme.textBase};
    max-width: calc(100vw - 48px);
  }
  .nav-floating a { color: ${theme.textMuted}; text-decoration: none; transition: color .2s; }
  .nav-floating a:hover { color: ${theme.primaryColor}; }
 
  /* FAQ accordion */
  .faq-item { border-bottom: 1px solid ${theme.cardBorder}; overflow: hidden; }
  .faq-question {
    width: 100%; display: flex; justify-content: space-between; align-items: center;
    padding: 22px 0; background: none; border: none; cursor: pointer; text-align: left;
    font-size: 1.05rem; font-weight: 600; color: ${theme.textBase}; gap: 16px;
    font-family: inherit;
  }
  .faq-icon {
    width: 32px; height: 32px; flex-shrink: 0; border-radius: 9999px;
    background: ${theme.primaryLight}; color: ${theme.primaryColor};
    display: flex; align-items: center; justify-content: center; font-size: 1.4rem;
    font-weight: 300; transition: transform .3s, background .3s, color .3s;
  }
  .faq-item.open .faq-icon { transform: rotate(45deg); background: ${theme.primaryColor}; color: ${theme.primaryText}; }
  .faq-answer { overflow: hidden; max-height: 0; transition: max-height .4s cubic-bezier(.22,1,.36,1); }
  .faq-answer-inner { padding: 0 0 22px; font-size: 0.97rem; color: ${theme.textMuted}; line-height: 1.8; }
 
  /* Highlight word in headline */
  .headline-highlight { color: ${theme.primaryColor}; position: relative; }
 
  /* Trust bar */
  .trust-bar {
    display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
    gap: 8px 24px; font-size: 0.85rem; color: ${theme.textMuted}; margin-top: 20px;
  }
  .trust-bar span { display: flex; align-items: center; gap: 6px; }
  .trust-bar span::before { content: '✓'; color: ${theme.primaryColor}; font-weight: 700; }
 
  /* Steps */
  .step-number {
    width: 56px; height: 56px; border-radius: 16px; background: ${theme.primaryLight};
    color: ${theme.primaryColor}; font-size: 1.4rem; font-weight: 800;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
 
  /* Stat card */
  .stat-number { font-size: 3rem; font-weight: 900; color: ${theme.primaryColor}; line-height: 1; letter-spacing: -0.03em; }
  .stat-label  { font-size: 0.9rem; font-weight: 600; color: ${theme.textBase}; margin-top: 4px; }
  .stat-desc   { font-size: 0.8rem; color: ${theme.textMuted}; margin-top: 2px; }
 
  /* Pricing notIncluded */
  .not-included { color: ${theme.textMuted}; opacity: 0.5; text-decoration: line-through; }
 
  /* Urgency countdown */
  .countdown-box {
    background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25);
    border-radius: 16px; padding: 20px 32px;
    display: inline-flex; gap: 24px; align-items: center;
    backdrop-filter: blur(8px);
  }
  .countdown-unit { text-align: center; }
  .countdown-value { font-size: 2.5rem; font-weight: 900; color: #fff; line-height: 1; }
  .countdown-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: .1em; color: rgba(255,255,255,.6); }
  .countdown-sep { font-size: 2rem; font-weight: 900; color: rgba(255,255,255,.5); margin-top: -8px; }
 
  /* Feature highlight */
  .feature-highlight {
    border: 2px solid ${theme.primaryColor}; position: relative;
  }
  .feature-highlight::before {
    content: '★ Destacado'; position: absolute; top: -12px; left: 20px;
    background: ${theme.primaryColor}; color: ${theme.primaryText};
    padding: 2px 12px; border-radius: 9999px; font-size: 0.65rem; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase;
  }
 
  /* Avatar */
  .avatar {
    width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 1rem; color: ${theme.primaryText};
    background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor});
  }
 
  @media (max-width: 768px) {
    .hero-grid { flex-direction: column !important; }
    .features-grid { grid-template-columns: 1fr !important; }
    .testimonials-grid { grid-template-columns: 1fr !important; }
    .pricing-grid { grid-template-columns: 1fr !important; }
    .steps-grid { grid-template-columns: 1fr !important; }
    .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .cta-buttons { flex-direction: column !important; align-items: stretch !important; }
    .nav-floating { display: none !important; }
    .countdown-box { flex-wrap: wrap; gap: 12px; }
  }
`;
};
 
// ── Componente principal ──────────────────────────────────────────────────────
const LandingViewer = () => {
  const { id }         = useParams();
  const [searchParams] = useSearchParams();
  const token          = searchParams.get('token');
 
  const [landingData,       setLandingData]       = useState(null);
  const [designPreferences, setDesignPreferences] = useState(null);
  const [projectName,       setProjectName]       = useState('Landing Page');
  const [error,             setError]             = useState(null);
  const [isLoading,         setIsLoading]         = useState(true);
  const [countdown,         setCountdown]         = useState({ h:23, m:59, s:59 });
  const [openFaq,           setOpenFaq]           = useState(null);
  const [isZipping,         setIsZipping]         = useState(false);
  const containerRef = useRef(null);
 
  // Countdown
  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(prev => {
        let { h, m, s } = prev;
        if (s > 0) return { h, m, s: s-1 };
        if (m > 0) return { h, m: m-1, s: 59 };
        if (h > 0) return { h: h-1, m: 59, s: 59 };
        return { h:0, m:0, s:0 };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
 
  // Fetch data
  useEffect(() => {
    if (!token) { setError('Token no proporcionado.'); setIsLoading(false); return; }
    const fetchData = async () => {
      try {
        const envBase   = import.meta.env.VITE_API_BASE_URL || 'https://landingbackend-s1rk.onrender.com/api/v1';
        const serverUrl = envBase.replace(/\/api\/v1\/?$/, '');
        const res       = await axios.get(`${serverUrl}/landings/${id}?token=${token}`);
        setLandingData(res.data.aiMetadata);
        setDesignPreferences(res.data.designPreferences || null);
        setProjectName(res.data.projectName || 'Landing Page');
      } catch (err) {
        setError(err.response?.data?.error || 'El enlace ha expirado o no es válido.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, token]);
 
  // Inject font + scroll reveal
  useEffect(() => {
    if (!landingData) return;
    const theme = buildTheme(landingData, designPreferences);
    // Font
    if (!document.getElementById('wls-font')) {
      const link = document.createElement('link');
      link.id = 'wls-font'; link.rel = 'stylesheet'; link.href = theme.fontImport;
      document.head.appendChild(link);
    }
    // Scroll reveal
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    const timer = setTimeout(() => {
      document.querySelectorAll('.sr').forEach(el => obs.observe(el));
    }, 100);
    return () => { clearTimeout(timer); obs.disconnect(); };
  }, [landingData, designPreferences]);
 
  if (isLoading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:56, height:56, border:'4px solid #e2e8f0', borderTopColor:'#1e3a5f', borderRadius:'50%', animation:'spin .8s linear infinite', margin:'0 auto 16px' }}/>
        <p style={{ color:'#64748b', fontFamily:'Inter,sans-serif', fontWeight:500 }}>Cargando tu landing page…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
 
  if (error) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ background:'#fff', padding:48, borderRadius:24, maxWidth:440, textAlign:'center', border:'1px solid #fee2e2', boxShadow:'0 4px 32px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize:'3rem', marginBottom:16 }}>⚠️</div>
        <h2 style={{ fontSize:'1.5rem', fontWeight:800, color:'#0f172a', marginBottom:8, fontFamily:'Inter,sans-serif' }}>Página no disponible</h2>
        <p style={{ color:'#ef4444', fontWeight:500, marginBottom:32, fontFamily:'Inter,sans-serif' }}>{error}</p>
        <a href="/" style={{ display:'inline-block', padding:'12px 28px', background:'#0f172a', color:'#fff', borderRadius:10, fontWeight:700, textDecoration:'none', fontFamily:'Inter,sans-serif' }}>Volver al inicio</a>
      </div>
    </div>
  );
 
  if (!landingData) return null;
 
  const theme = buildTheme(landingData, designPreferences);
  const d     = landingData; // alias
  const faq   = d.faq?.items || d.faq || [];
  const testimonials = d.socialProof?.testimonials || d.testimonials || [];
  const stats        = d.socialProof?.stats || [];
  const pricingPlans = d.pricing?.plans || (Array.isArray(d.pricing) ? d.pricing : []);
  const steps        = d.howItWorks?.steps || [];
 
  const toggleFaq = (i) => setOpenFaq(prev => prev === i ? null : i);
 
  // Descarga HTML completo (página tal como está)
  const handleDownload = () => {
    const html = document.documentElement.outerHTML;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `${projectName.toLowerCase().replace(/\s+/g,'-')}.html`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };
 
  // Descarga ZIP con HTML + CSS + JS separados
  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await generateAndDownloadZip(landingData, theme, projectName);
    } catch (err) {
      console.error('Error generando ZIP:', err);
      alert('No se pudo generar el ZIP. Verifica tu conexión a internet.');
    } finally {
      setIsZipping(false);
    }
  };
 
  return (
    <>
      {/* Estilos globales */}
      <style>{GLOBAL_CSS(theme)}</style>
 
      {/* ── Barra de herramientas flotante ── */}
      <div style={{ position:'fixed', top:16, right:16, zIndex:9999, display:'flex', gap:10 }}>
        {/* Botón ZIP */}
        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          style={{
            display:'flex', alignItems:'center', gap:8,
            padding:'9px 18px',
            background: isZipping ? '#6b7280' : '#10b981',
            color:'#fff',
            border:'none',
            borderRadius:10,
            cursor: isZipping ? 'not-allowed' : 'pointer',
            fontWeight:700,
            fontSize:'0.8rem',
            fontFamily:'inherit',
            boxShadow:'0 4px 16px rgba(16,185,129,0.4)',
            transition:'background .2s',
          }}
        >
          {isZipping ? '⏳ Generando...' : '⬇ Descargar ZIP'}
        </button>
 
        {/* Botón HTML completo */}
        <button
          onClick={handleDownload}
          style={{
            display:'flex', alignItems:'center', gap:8,
            padding:'9px 18px',
            background:theme.primaryColor,
            color:theme.primaryText,
            border:'none',
            borderRadius:10,
            cursor:'pointer',
            fontWeight:700,
            fontSize:'0.8rem',
            fontFamily:'inherit',
            boxShadow:`0 4px 16px rgba(${theme.primaryRgb},.4)`,
          }}
        >
          ↓ Descargar HTML
        </button>
      </div>
 
      {/* NAV flotante */}
      <nav className="nav-floating">
        <span style={{ fontWeight:800, color:theme.textBase, marginRight:8 }}>{projectName}</span>
        {d.hero && <a href="#hero">Inicio</a>}
        {steps.length > 0 && <a href="#how">Cómo funciona</a>}
        {testimonials.length > 0 && <a href="#testimonials">Clientes</a>}
        {pricingPlans.length > 0 && <a href="#pricing">Precios</a>}
        {faq.length > 0 && <a href="#faq">FAQ</a>}
        <a href="#contact" className="btn-primary" style={{ padding:'8px 20px', fontSize:'0.82rem' }}>
          {d.hero?.ctaButton || 'Comenzar'}
        </a>
      </nav>
 
      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      {d.hero && (
        <section id="hero" style={{
          position:'relative', overflow:'hidden', paddingTop:140, paddingBottom:100,
          background: `linear-gradient(145deg, ${theme.primaryColor} 0%, ${theme.primaryDark} 60%, ${theme.isDark ? '#0a0a0f' : theme.primaryDark} 100%)`,
        }}>
          {/* Decoración de fondo */}
          <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:'-20%', right:'-10%', width:'70%', height:'140%', background:'rgba(255,255,255,0.04)', borderRadius:'50%', transform:'rotate(-15deg)' }}/>
            <div style={{ position:'absolute', top:'10%', left:'-5%', width:'50%', height:'80%', background:'rgba(255,255,255,0.03)', borderRadius:'50%' }}/>
            <svg style={{ position:'absolute', bottom:0, left:0, right:0 }} viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path d="M0,80 C480,0 960,0 1440,80 L1440,80 L0,80 Z" fill={theme.bgPrimary}/>
            </svg>
          </div>
 
          <div className="container" style={{ position:'relative', zIndex:1 }}>
            {/* Badge */}
            {d.hero.badge && (
              <div className="sr" style={{ textAlign:'center', marginBottom:24 }}>
                <span className="badge-white">{d.hero.badge}</span>
              </div>
            )}
 
            {/* Headline */}
            <div className="sr sr-delay-1" style={{ textAlign:'center', marginBottom:24 }}>
              <h1 style={{
                fontSize:'clamp(2.4rem, 5.5vw, 4.2rem)', fontWeight:900, lineHeight:1.08,
                letterSpacing:'-0.03em', color:'#ffffff', maxWidth:860, margin:'0 auto',
              }}>
                {d.hero.headline}
              </h1>
            </div>
 
            {/* Subheadline */}
            {d.hero.subheadline && (
              <div className="sr sr-delay-2" style={{ textAlign:'center', marginBottom:36 }}>
                <p style={{ fontSize:'clamp(1.05rem,2vw,1.3rem)', color:'rgba(255,255,255,0.82)', lineHeight:1.75, maxWidth:640, margin:'0 auto' }}>
                  {d.hero.subheadline}
                </p>
              </div>
            )}
 
            {/* CTAs */}
            <div className="sr sr-delay-3 cta-buttons" style={{ display:'flex', gap:16, justifyContent:'center', marginBottom:28, flexWrap:'wrap' }}>
              <a href="#contact" className="btn-primary" style={{ background:'#fff', color:theme.primaryColor, boxShadow:'0 8px 32px rgba(0,0,0,0.2)', fontSize:'1.1rem', padding:'18px 40px', fontFamily:'inherit', borderColor:'#fff' }}>
                {d.hero.ctaButton} →
              </a>
              {d.hero.secondaryCta && (
                <a href="#how" className="btn-ghost-white" style={{ fontFamily:'inherit', fontSize:'1rem' }}>
                  {d.hero.secondaryCta}
                </a>
              )}
            </div>
 
            {/* Trust indicators */}
            {d.hero.trustIndicators?.length > 0 && (
              <div className="sr sr-delay-4 trust-bar">
                {d.hero.trustIndicators.map((t, i) => <span key={i}>{t}</span>)}
              </div>
            )}
 
            {/* Stats rápidas en hero */}
            {stats.length > 0 && (
              <div className="sr sr-delay-5" style={{ marginTop:56, display:'grid', gridTemplateColumns:`repeat(${Math.min(stats.length, 3)}, 1fr)`, gap:1, maxWidth:640, margin:'56px auto 0', background:'rgba(255,255,255,0.1)', borderRadius:20, overflow:'hidden', backdropFilter:'blur(10px)' }}>
                {stats.slice(0,3).map((s, i) => (
                  <div key={i} style={{ padding:'24px 20px', textAlign:'center', borderRight: i < stats.length-1 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
                    <div style={{ fontSize:'2rem', fontWeight:900, color:'#fff', lineHeight:1 }}>{s.number}</div>
                    <div style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.8)', fontWeight:600, marginTop:4 }}>{s.label}</div>
                    {s.description && <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.55)', marginTop:2 }}>{s.description}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
 
      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      {d.features?.length > 0 && (
        <section style={{ padding:'96px 0', background:theme.bgPrimary }}>
          <div className="container">
            <div style={{ textAlign:'center', marginBottom:64 }}>
              <div className="sr section-tag" style={{ justifyContent:'center' }}>Características</div>
              <h2 className="sr sr-delay-1 section-title" style={{ textAlign:'center' }}>
                ¿Por qué elegir {projectName}?
              </h2>
              <p className="sr sr-delay-2 section-subtitle" style={{ marginTop:16 }}>
                Descubre todo lo que obtienes con nosotros
              </p>
            </div>
            <div className="features-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:24 }}>
              {d.features.map((f, i) => (
                <div key={i} className={`sr sr-delay-${(i%3)+1} card${f.highlight ? ' feature-highlight' : ''}`}>
                  <div style={{ fontSize:'2.2rem', marginBottom:16 }}>{f.icon}</div>
                  <h3 style={{ fontSize:'1.1rem', fontWeight:700, color:theme.textBase, marginBottom:12, lineHeight:1.3 }}>{f.title}</h3>
                  <p style={{ fontSize:'0.93rem', color:theme.textMuted, lineHeight:1.8 }}>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
 
      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      {steps.length > 0 && (
        <section id="how" style={{ padding:'96px 0', background:theme.bgSecondary }}>
          <div className="container">
            <div style={{ textAlign:'center', marginBottom:64 }}>
              <div className="sr section-tag" style={{ justifyContent:'center' }}>Proceso</div>
              <h2 className="sr sr-delay-1 section-title" style={{ textAlign:'center' }}>
                {d.howItWorks?.title || '¿Cómo funciona?'}
              </h2>
              {d.howItWorks?.subtitle && (
                <p className="sr sr-delay-2 section-subtitle" style={{ marginTop:16 }}>{d.howItWorks.subtitle}</p>
              )}
            </div>
            <div className="steps-grid" style={{ display:'grid', gridTemplateColumns:`repeat(${steps.length}, 1fr)`, gap:32, position:'relative' }}>
              {/* Línea conectora */}
              {steps.length > 1 && (
                <div style={{ position:'absolute', top:28, left:'15%', right:'15%', height:2, background:`linear-gradient(90deg, ${theme.primaryLight}, ${theme.primaryColor}, ${theme.primaryLight})`, zIndex:0 }}/>
              )}
              {steps.map((s, i) => (
                <div key={i} className={`sr sr-delay-${i+1}`} style={{ textAlign:'center', position:'relative', zIndex:1 }}>
                  <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
                    <div style={{
                      width:56, height:56, borderRadius:16, background:theme.primaryColor,
                      color:theme.primaryText, fontSize:'1.3rem', fontWeight:900,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      boxShadow:`0 8px 24px rgba(${theme.primaryRgb},.3)`,
                    }}>{s.number}</div>
                  </div>
                  <h3 style={{ fontSize:'1.05rem', fontWeight:700, color:theme.textBase, marginBottom:10 }}>{s.title}</h3>
                  <p style={{ fontSize:'0.9rem', color:theme.textMuted, lineHeight:1.75 }}>{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
 
      {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section id="testimonials" style={{ padding:'96px 0', background:theme.bgPrimary }}>
          <div className="container">
            <div style={{ textAlign:'center', marginBottom:64 }}>
              <div className="sr section-tag" style={{ justifyContent:'center' }}>Testimonios</div>
              <h2 className="sr sr-delay-1 section-title" style={{ textAlign:'center' }}>
                {d.socialProof?.title || 'Lo que dicen nuestros clientes'}
              </h2>
              {d.socialProof?.subtitle && (
                <p className="sr sr-delay-2 section-subtitle" style={{ marginTop:16 }}>{d.socialProof.subtitle}</p>
              )}
            </div>
            <div className="testimonials-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:24 }}>
              {testimonials.map((t, i) => (
                <div key={i} className={`sr sr-delay-${(i%3)+1} card`} style={{ display:'flex', flexDirection:'column' }}>
                  {/* Stars */}
                  <div className="stars" style={{ marginBottom:16 }}>
                    {'★'.repeat(t.rating || 5)}
                  </div>
                  {/* Quote */}
                  <blockquote style={{ flex:1, fontSize:'0.97rem', color:theme.textBase, lineHeight:1.85, fontStyle:'italic', marginBottom:24, borderLeft:`3px solid ${theme.primaryColor}`, paddingLeft:16 }}>
                    "{t.quote}"
                  </blockquote>
                  {/* Author */}
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div className="avatar">{(t.name||'U')[0].toUpperCase()}</div>
                    <div>
                      <div style={{ fontWeight:700, color:theme.textBase, fontSize:'0.9rem' }}>{t.name}</div>
                      <div style={{ fontSize:'0.8rem', color:theme.textMuted }}>{t.role}{t.company ? ` · ${t.company}` : ''}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
 
      {/* ── PRICING ────────────────────────────────────────────────────────── */}
      {pricingPlans.length > 0 && (
        <section id="pricing" style={{ padding:'96px 0', background:theme.bgSecondary }}>
          <div className="container">
            <div style={{ textAlign:'center', marginBottom:64 }}>
              {d.pricing?.badge && (
                <div className="sr" style={{ marginBottom:12 }}>
                  <span className="badge">{d.pricing.badge}</span>
                </div>
              )}
              <div className="sr section-tag sr-delay-1" style={{ justifyContent:'center' }}>Precios</div>
              <h2 className="sr sr-delay-2 section-title" style={{ textAlign:'center' }}>
                {d.pricing?.title || 'Elige tu plan'}
              </h2>
              {d.pricing?.subtitle && (
                <p className="sr sr-delay-3 section-subtitle" style={{ marginTop:16 }}>{d.pricing.subtitle}</p>
              )}
            </div>
            <div className="pricing-grid" style={{ display:'grid', gridTemplateColumns:`repeat(${pricingPlans.length}, 1fr)`, gap:24, alignItems:'start' }}>
              {pricingPlans.map((plan, i) => (
                plan.featured ? (
                  <div key={i} className={`sr sr-delay-${i+1} card-featured`}>
                    {plan.badge && (
                      <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', background:'#fff', color:theme.primaryColor, padding:'4px 18px', borderRadius:9999, fontSize:'0.72rem', fontWeight:800, whiteSpace:'nowrap', boxShadow:'0 4px 12px rgba(0,0,0,0.15)' }}>
                        {plan.badge}
                      </div>
                    )}
                    <h3 style={{ fontSize:'1.2rem', fontWeight:700, color:'rgba(255,255,255,0.9)', marginBottom:8 }}>{plan.name}</h3>
                    {plan.description && <p style={{ fontSize:'0.87rem', color:'rgba(255,255,255,0.65)', marginBottom:20, lineHeight:1.6 }}>{plan.description}</p>}
                    <div style={{ fontSize:'3rem', fontWeight:900, color:'#fff', letterSpacing:'-0.04em', lineHeight:1 }}>{plan.price}</div>
                    {plan.period && <p style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.6)', marginTop:4, marginBottom:28 }}>{plan.period}</p>}
                    <ul style={{ listStyle:'none', marginBottom:32 }}>
                      {(plan.benefits||[]).map((b,j) => (
                        <li key={j} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'9px 0', fontSize:'0.9rem', color:'rgba(255,255,255,0.9)', borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
                          <span style={{ color:'#fff', fontWeight:700, flexShrink:0, marginTop:1 }}>✓</span>{b}
                        </li>
                      ))}
                    </ul>
                    <a href="#contact" style={{ display:'block', textAlign:'center', padding:'15px 24px', background:'#fff', color:theme.primaryColor, borderRadius:getBtnRadius(theme.buttonShape), fontWeight:800, textDecoration:'none', fontSize:'1rem', fontFamily:'inherit' }}>
                      {plan.ctaButton || 'Empezar ahora'}
                    </a>
                  </div>
                ) : (
                  <div key={i} className={`sr sr-delay-${i+1} card`}>
                    <h3 style={{ fontSize:'1.15rem', fontWeight:700, color:theme.textBase, marginBottom:8 }}>{plan.name}</h3>
                    {plan.description && <p style={{ fontSize:'0.87rem', color:theme.textMuted, marginBottom:20, lineHeight:1.6 }}>{plan.description}</p>}
                    <div style={{ fontSize:'2.8rem', fontWeight:900, color:theme.primaryColor, letterSpacing:'-0.04em', lineHeight:1 }}>{plan.price}</div>
                    {plan.period && <p style={{ fontSize:'0.85rem', color:theme.textMuted, marginTop:4, marginBottom:28 }}>{plan.period}</p>}
                    <ul style={{ listStyle:'none', marginBottom:32 }}>
                      {(plan.benefits||[]).map((b,j) => (
                        <li key={j} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'9px 0', fontSize:'0.9rem', color:theme.textBase, borderBottom:`1px solid ${theme.cardBorder}` }}>
                          <span style={{ color:theme.primaryColor, fontWeight:700, flexShrink:0, marginTop:1 }}>✓</span>{b}
                        </li>
                      ))}
                      {(plan.notIncluded||[]).map((b,j) => (
                        <li key={`n${j}`} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'9px 0', fontSize:'0.9rem', borderBottom:`1px solid ${theme.cardBorder}` }}>
                          <span style={{ color:theme.textMuted, flexShrink:0, marginTop:1 }}>✕</span>
                          <span className="not-included">{b}</span>
                        </li>
                      ))}
                    </ul>
                    <a href="#contact" style={{ display:'block', textAlign:'center', padding:'15px 24px', background:theme.primaryLight, color:theme.primaryColor, borderRadius:getBtnRadius(theme.buttonShape), fontWeight:700, textDecoration:'none', fontSize:'1rem', fontFamily:'inherit', border:`1.5px solid ${theme.primaryColor}` }}>
                      {plan.ctaButton || 'Elegir plan'}
                    </a>
                  </div>
                )
              ))}
            </div>
          </div>
        </section>
      )}
 
      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      {faq.length > 0 && (
        <section id="faq" style={{ padding:'96px 0', background:theme.bgPrimary }}>
          <div className="container-sm">
            <div style={{ textAlign:'center', marginBottom:64 }}>
              <div className="sr section-tag" style={{ justifyContent:'center' }}>FAQ</div>
              <h2 className="sr sr-delay-1 section-title" style={{ textAlign:'center' }}>
                {d.faq?.title || 'Preguntas frecuentes'}
              </h2>
              {d.faq?.subtitle && (
                <p className="sr sr-delay-2 section-subtitle" style={{ marginTop:16 }}>{d.faq.subtitle}</p>
              )}
            </div>
            <div className="sr sr-delay-1">
              {faq.map((item, i) => (
                <div key={i} className={`faq-item${openFaq===i ? ' open' : ''}`}>
                  <button className="faq-question" onClick={() => toggleFaq(i)}>
                    <span>{item.question}</span>
                    <span className="faq-icon">+</span>
                  </button>
                  <div className="faq-answer" style={{ maxHeight: openFaq===i ? 400 : 0 }}>
                    <div className="faq-answer-inner">{item.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
 
      {/* ── URGENCY ────────────────────────────────────────────────────────── */}
      {d.urgency && (
        <section style={{
          padding:'96px 0', position:'relative', overflow:'hidden',
          background:`linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.primaryDark} 100%)`,
        }}>
          <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
            <div style={{ position:'absolute', top:'-30%', right:'-10%', width:'60%', height:'160%', background:'rgba(255,255,255,0.04)', borderRadius:'50%' }}/>
          </div>
          <div className="container" style={{ position:'relative', zIndex:1, textAlign:'center' }}>
            {d.urgency.badge && (
              <div className="sr" style={{ marginBottom:20 }}>
                <span className="badge-white">{d.urgency.badge}</span>
              </div>
            )}
            <h2 className="sr sr-delay-1" style={{ fontSize:'clamp(2rem,4vw,3.2rem)', fontWeight:900, color:'#fff', marginBottom:16, letterSpacing:'-0.02em' }}>
              {d.urgency.title}
            </h2>
            {d.urgency.subtitle && (
              <p className="sr sr-delay-2" style={{ fontSize:'1.15rem', color:'rgba(255,255,255,0.8)', marginBottom:32, maxWidth:560, margin:'0 auto 32px' }}>
                {d.urgency.subtitle}
              </p>
            )}
            {/* Countdown */}
            {d.urgency.countdown?.enabled && (
              <div className="sr sr-delay-3" style={{ marginBottom:36 }}>
                <p style={{ fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:'.12em', color:'rgba(255,255,255,.6)', marginBottom:12 }}>
                  {d.urgency.countdown.label || 'La oferta termina en:'}
                </p>
                <div className="countdown-box">
                  {[{v:String(countdown.h).padStart(2,'0'),l:'horas'},{v:String(countdown.m).padStart(2,'0'),l:'minutos'},{v:String(countdown.s).padStart(2,'0'),l:'segundos'}].map((u,i,arr) => (
                    <React.Fragment key={i}>
                      <div className="countdown-unit">
                        <div className="countdown-value">{u.v}</div>
                        <div className="countdown-label">{u.l}</div>
                      </div>
                      {i < arr.length-1 && <span className="countdown-sep">:</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
            {/* Benefits */}
            {d.urgency.benefitsList?.length > 0 && (
              <div className="sr sr-delay-4" style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'8px 20px', marginBottom:36 }}>
                {d.urgency.benefitsList.map((b,i) => (
                  <span key={i} style={{ display:'flex', alignItems:'center', gap:6, color:'rgba(255,255,255,0.85)', fontSize:'0.9rem' }}>
                    <span style={{ color:'rgba(255,255,255,0.9)', fontWeight:700 }}>✓</span> {b}
                  </span>
                ))}
              </div>
            )}
            <div className="sr sr-delay-5" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
              <a href="#contact" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'18px 48px', background:'#fff', color:theme.primaryColor, borderRadius:getBtnRadius(theme.buttonShape), fontWeight:800, fontSize:'1.1rem', textDecoration:'none', boxShadow:'0 8px 32px rgba(0,0,0,0.25)', fontFamily:'inherit' }}>
                {d.urgency.ctaButton || d.hero?.ctaButton || 'Aprovechar oferta'} →
              </a>
              {d.urgency.supportingText && (
                <p style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.55)' }}>{d.urgency.supportingText}</p>
              )}
            </div>
          </div>
        </section>
      )}
 
      {/* ── CTA FINAL ──────────────────────────────────────────────────────── */}
      {d.cta && (
        <section id="contact" style={{ padding:'96px 0', background:theme.bgSecondary }}>
          <div className="container-sm" style={{ textAlign:'center' }}>
            <h2 className="sr section-title" style={{ marginBottom:16 }}>{d.cta.title}</h2>
            {d.cta.subtitle && <p className="sr sr-delay-1 section-subtitle" style={{ margin:'0 auto 40px' }}>{d.cta.subtitle}</p>}
            <div className="sr sr-delay-2 cta-buttons" style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
              <a href="mailto:info@empresa.cl" className="btn-primary" style={{ fontFamily:'inherit', fontSize:'1.1rem', padding:'18px 44px' }}>
                {d.cta.ctaButton} →
              </a>
              {d.cta.secondaryCta && (
                <a href="#faq" className="btn-secondary" style={{ fontFamily:'inherit', fontSize:'1rem', padding:'18px 36px' }}>
                  {d.cta.secondaryCta}
                </a>
              )}
            </div>
            {d.cta.trustText && (
              <p className="sr sr-delay-3" style={{ marginTop:20, fontSize:'0.85rem', color:theme.textMuted }}>
                🔒 {d.cta.trustText}
              </p>
            )}
          </div>
        </section>
      )}
 
      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      {d.footer && (
        <footer style={{ padding:'64px 0 32px', background:theme.isDark ? '#05050a' : '#0a0a1a' }}>
          <div className="container">
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:48, marginBottom:48, alignItems:'start' }}>
              {/* Brand */}
              <div>
                <div style={{ fontSize:'1.5rem', fontWeight:900, color:'#fff', marginBottom:12, letterSpacing:'-0.02em' }}>{projectName}</div>
                {d.footer.description && <p style={{ fontSize:'0.9rem', color:'#6b7280', lineHeight:1.75, maxWidth:420 }}>{d.footer.description}</p>}
                {d.footer.contact && (
                  <a href={`mailto:${d.footer.contact}`} style={{ display:'block', marginTop:16, fontSize:'0.9rem', color:theme.secondaryColor }}>
                    {d.footer.contact}
                  </a>
                )}
                {d.footer.phone && <p style={{ fontSize:'0.85rem', color:'#6b7280', marginTop:6 }}>{d.footer.phone}</p>}
              </div>
              {/* Links */}
              {d.footer.links?.length > 0 && (
                <div>
                  <p style={{ fontSize:'0.75rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#6b7280', marginBottom:16 }}>Navegación</p>
                  <ul style={{ listStyle:'none' }}>
                    {d.footer.links.map((l,i) => (
                      <li key={i} style={{ marginBottom:10 }}>
                        <a href={l.href || '#'} style={{ fontSize:'0.9rem', color:'#9ca3af', textDecoration:'none', transition:'color .2s' }}
                          onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='#9ca3af'}>
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div style={{ borderTop:'1px solid #1f2937', paddingTop:28, display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'center', gap:12 }}>
              <p style={{ fontSize:'0.8rem', color:'#4b5563' }}>
                © {new Date().getFullYear()} {projectName}. {d.footer.legalText || 'Todos los derechos reservados.'}
              </p>
              {d.footer.socialProof && (
                <p style={{ fontSize:'0.8rem', color:'#6b7280' }}>🔒 {d.footer.socialProof}</p>
              )}
            </div>
          </div>
        </footer>
      )}
    </>
  );
};
 
export default LandingViewer;