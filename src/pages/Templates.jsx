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

const Templates = () => {
  const [activeCategory, setActiveCategory] = useState('Todas');

  const filtered =
    activeCategory === 'Todas'
      ? mockTemplates
      : mockTemplates.filter((t) => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-grow">

        <section className="pt-40 pb-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          <div style={{
            position: 'absolute', top: 0, left: '50%',
            transform: 'translateX(-50%)',
            width: '700px', height: '300px',
            background: 'radial-gradient(ellipse, rgba(37,99,235,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div className="container mx-auto px-4 text-center relative z-10">
            <RevealOnScroll>
              <span className="inline-block text-xs font-bold tracking-widest text-sapphire-500 uppercase mb-4 px-3 py-1 bg-sapphire-50 rounded-full border border-sapphire-100">
                {mockTemplates.length} plantillas disponibles
              </span>

              <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sapphire-700 via-blue-600 to-indigo-600">
                Diseños que convierten
              </h1>

              <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                La IA de WebLandingSuite toma estas estructuras probadas y las personaliza
                para tu negocio en segundos.
              </p>
            </RevealOnScroll>
          </div>
        </section>

        <section className="py-10 overflow-hidden bg-gray-50 border-y border-gray-100">
          <InfiniteMarquee
            templates={mockTemplates}
            speed={45}
            cardWidth={300}
            gap={20}
            fadeColor="#f9fafb"
          />
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">

            <RevealOnScroll>
              <div className="flex flex-wrap justify-center gap-3 mb-14">
                {CATEGORIES.map((cat) => (
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
                  <TemplateCard template={template} />
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