import React, { useState } from 'react';
import Navbar from '../components/organisms/Navbar';
import TemplateCard from '../components/organisms/TemplateCard';
import Footer from '../components/organisms/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';

const RevealOnScroll = ({ children, className = "", delay = "" }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${delay} ${className}`}>
      {children}
    </div>
  );
};

const mockTemplates = [
  { id: 1, title: 'Minimal Tech SaaS', category: 'Tecnología', description: 'Diseño limpio y oscuro ideal para startups de software.', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop' },
  { id: 2, title: 'Boutique Elegance', category: 'E-commerce', description: 'Estilo minimalista y sofisticado para tiendas de joyería.', imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop' },
  { id: 3, title: 'Health & Fitness Pro', category: 'Salud', description: 'Plantilla enérgica diseñada para gimnasios y nutricionistas.', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop' },
  { id: 4, title: 'Creative Portfolio', category: 'Freelance', description: 'Destaca tus trabajos con esta galería de alto impacto visual.', imageUrl: 'https://images.unsplash.com/photo-1507238692062-8a0cb44ce740?q=80&w=2070&auto=format&fit=crop' },
  { id: 5, title: 'Local Resto-Bar', category: 'Gastronomía', description: 'Perfecta para restaurantes que desean mostrar su menú.', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop' },
  { id: 6, title: 'Real Estate Prime', category: 'Inmobiliaria', description: 'Muestra propiedades con formularios de contacto rápidos.', imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop' }
];

const Templates = () => {
  const [activeCategory, setActiveCategory] = useState('Todas');
  const categories = ['Todas', 'Tecnología', 'E-commerce', 'Salud', 'Freelance'];
  const filteredTemplates = activeCategory === 'Todas' ? mockTemplates : mockTemplates.filter(t => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-40 pb-24">
        <RevealOnScroll>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sapphire-700 via-blue-600 to-indigo-600">
              Explora nuestros diseños
            </h1>
            <p className="text-lg text-gray-600">
              Nuestra Inteligencia Artificial se basa en estas estructuras probadas para generar páginas de alta conversión.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay="delay-200">
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${activeCategory === cat ? 'bg-sapphire-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
                {cat}
              </button>
            ))}
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredTemplates.map((template, idx) => (
            <RevealOnScroll key={template.id} delay={`delay-[${(idx % 3) * 150}ms]`}>
              <TemplateCard template={template} />
            </RevealOnScroll>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Templates;