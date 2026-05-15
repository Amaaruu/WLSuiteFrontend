import React, { useState } from 'react';
import Navbar from '../components/organisms/Navbar';
import TemplateCard from '../components/organisms/TemplateCard';
import InfiniteMarquee from '../components/organisms/InfiniteMarquee';
import Footer from '../components/organisms/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';

const RevealOnScroll = ({ children, className = '', delay = '' }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${delay} ${className}`}
    >
      {children}
    </div>
  );
};

const mockTemplates = [
  { id: 1, title: 'Minimal Tech SaaS',  category: 'Tecnología',   description: 'Diseño limpio y oscuro ideal para startups de software.',    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop' },
  { id: 2, title: 'Boutique Elegance',  category: 'E-commerce',   description: 'Estilo minimalista y sofisticado para tiendas de joyería.',   imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop' },
  { id: 3, title: 'Health & Fitness',   category: 'Salud',        description: 'Plantilla enérgica para gimnasios y nutricionistas.',         imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop' },
  { id: 4, title: 'Creative Portfolio', category: 'Freelance',    description: 'Destaca tus trabajos con esta galería de alto impacto.',      imageUrl: 'https://images.unsplash.com/photo-1507238692062-8a0cb44ce740?q=80&w=2070&auto=format&fit=crop' },
  { id: 5, title: 'Local Resto-Bar',    category: 'Gastronomía',  description: 'Perfecta para restaurantes que desean mostrar su menú.',      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop' },
  { id: 6, title: 'Real Estate Prime',  category: 'Inmobiliaria', description: 'Muestra propiedades con formularios de contacto rápidos.',    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop' },
  { id: 7, title: 'Agency Studio',      category: 'Freelance',    description: 'Portfolio de agencia con presentación de proyectos.',         imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2064&auto=format&fit=crop' },
  { id: 8, title: 'Fintech Dashboard',  category: 'Tecnología',   description: 'Diseño moderno para apps financieras y fintechs.',           imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop' },
];

const CATEGORIES = ['Todas', 'Tecnología', 'E-commerce', 'Salud', 'Freelance', 'Gastronomía', 'Inmobiliaria'];

const CATEGORY_COLORS = {
  'Tecnología':   { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
  'E-commerce':   { bg: '#faf5ff', text: '#7c3aed', border: '#e9d5ff' },
  'Salud':        { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
  'Freelance':    { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
  'Gastronomía':  { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  'Inmobiliaria': { bg: '#f0f9ff', text: '#0284c7', border: '#bae6fd' },
};
const DEFAULT_CAT = { bg: '#eef2ff', text: '#4f46e5', border: '#c7d2fe' };

// ── Tarjeta con botón de demo premium ─────────────────────────────────────
const PremiumCard = ({ template }) => {
  const [hovered, setHovered] = useState(false);
  const cat = CATEGORY_COLORS[template.category] || DEFAULT_CAT;

  return (
    <div
      className="relative flex flex-col overflow-hidden cursor-pointer select-none bg-white rounded-2xl border border-slate-200"
      style={{
        boxShadow: hovered
          ? '0 24px 64px rgba(0,0,0,0.13), 0 4px 20px rgba(0,0,0,0.07)'
          : '0 2px 12px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-8px) scale(1.01)' : 'translateY(0) scale(1)',
        transition: 'all 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Imagen ──────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height: 220, flexShrink: 0 }}>
        <img
          src={template.imageUrl}
          alt={template.title}
          loading="lazy"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'top',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          onError={e => { e.currentTarget.src = `https://placehold.co/600x400/f1f5f9/94a3b8?text=${encodeURIComponent(template.title)}`; }}
        />

        {/* Overlay oscuro en hover */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(8,12,28,0.72)',
          backdropFilter: 'blur(3px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 10,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}>
          {/* Botón principal "Ver demo" */}
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '11px 28px',
            background: 'linear-gradient(135deg, #ffffff 0%, #e8eeff 100%)',
            color: '#0f172a',
            fontWeight: 800, fontSize: '0.8rem',
            letterSpacing: '0.07em', textTransform: 'uppercase',
            borderRadius: 9999,
            border: '1.5px solid rgba(255,255,255,0.85)',
            cursor: 'pointer',
            transform: hovered ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.95)',
            transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)',
          }}>
            {/* Ícono play */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Ver demostración
          </button>

          {/* Badge "próximamente" */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 12px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 9999,
            color: 'rgba(255,255,255,0.55)',
            fontSize: '0.62rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            transform: hovered ? 'translateY(0)' : 'translateY(14px)',
            transition: 'transform 0.45s 0.05s cubic-bezier(0.22,1,0.36,1)',
          }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            Demo disponible pronto
          </span>
        </div>

        {/* Badge categoría */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          padding: '4px 12px',
          background: cat.bg, color: cat.text, border: `1px solid ${cat.border}`,
          borderRadius: 9999, fontSize: '0.67rem', fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          {template.category}
        </div>

        {/* Badge responsive */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '4px 10px',
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
          borderRadius: 9999, border: '1px solid rgba(0,0,0,0.08)',
        }}>
          <span style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%', flexShrink: 0 }} />
          <span style={{ color: '#475569', fontSize: '0.67rem', fontWeight: 600 }}>Responsive</span>
        </div>
      </div>

      {/* ── Cuerpo ──────────────────────────────────── */}
      <div style={{ padding: '20px 22px 22px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
            {template.title}
          </h3>
          <div style={{
            flexShrink: 0, width: 28, height: 28, borderRadius: 8,
            background: hovered ? cat.bg : '#f8fafc',
            border: `1px solid ${hovered ? cat.border : '#e2e8f0'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: hovered ? 'rotate(-45deg)' : 'rotate(0deg)',
            transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
            color: hovered ? cat.text : '#94a3b8',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.65, flex: 1 }}>
          {template.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #f1f5f9', marginTop: 4 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {[8, 14, 6, 10, 5].map((w, i) => (
              <div key={i} style={{
                width: hovered ? w + 3 : w, height: 3, borderRadius: 9999,
                background: i === 1 ? cat.text : '#e2e8f0',
                transition: `width ${0.2 + i * 0.06}s ease`,
              }} />
            ))}
          </div>
          <span style={{ fontSize: '0.67rem', color: '#cbd5e1', fontWeight: 600, letterSpacing: '0.05em' }}>IA-Ready</span>
        </div>
      </div>
    </div>
  );
};

// ── Página principal ───────────────────────────────────────────────────────
const Templates = () => {
  const [activeCategory, setActiveCategory] = useState('Todas');

  const filtered = activeCategory === 'Todas'
    ? mockTemplates
    : mockTemplates.filter(t => t.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#07101f' }}>
      <Navbar />

      <main className="flex-grow">

        {/* ── Hero con fondo premium ──────────────── */}
        <section className="pt-40 pb-16 relative overflow-hidden">
          {/* Capas de fondo */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#07101f] via-[#0c1a38] to-[#050c18]" />

          {/* Orbs de luz */}
          <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-sapphire-600/12 blur-[130px] rounded-full pointer-events-none" />
          <div className="absolute top-[15%] left-[8%] w-72 h-72 bg-indigo-500/7 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute top-[5%] right-[6%] w-64 h-64 bg-blue-400/7 blur-[80px] rounded-full pointer-events-none" />

          {/* Grid sutil */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Fade al fondo */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-b from-transparent to-[#050c18] pointer-events-none" />

          <div className="container mx-auto px-4 text-center relative z-10">
            <RevealOnScroll>
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sapphire-300 text-xs font-bold tracking-widest uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-sapphire-400 animate-pulse" />
                {mockTemplates.length} plantillas disponibles
              </div>

              <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white leading-tight">
                Diseños que{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sapphire-400 via-blue-400 to-indigo-400">
                  convierten
                </span>
              </h1>

              <p className="text-lg text-white/45 max-w-2xl mx-auto leading-relaxed font-medium">
                La IA de WebLandingSuite toma estas estructuras probadas y las personaliza para tu negocio en segundos.
              </p>
            </RevealOnScroll>
          </div>
        </section>

        {/* ── Marquee ─────────────────────────────── */}
        <section className="py-10 overflow-hidden" style={{ background: '#050c18' }}>
          <InfiniteMarquee
            templates={mockTemplates}
            speed={45}
            cardWidth={300}
            gap={20}
            fadeColor="#050c18"
          />
        </section>

        {/* ── Grid ────────────────────────────────── */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 max-w-7xl">

            {/* Filtros */}
            <RevealOnScroll>
              <div className="flex flex-wrap justify-center gap-2.5 mb-14">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                      activeCategory === cat
                        ? 'bg-sapphire-600 text-white shadow-md shadow-sapphire-200'
                        : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((template, idx) => (
                <RevealOnScroll key={template.id} delay={`delay-[${(idx % 4) * 80}ms]`}>
                  <PremiumCard template={template} />
                </RevealOnScroll>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="text-center py-20 text-gray-400 text-sm">
                No hay plantillas en esta categoría aún.
              </p>
            )}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Templates;