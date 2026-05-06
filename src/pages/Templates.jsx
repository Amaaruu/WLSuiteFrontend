import React, { useState } from 'react';
import Navbar from '../components/organisms/Navbar';
import TemplateCard from '../components/organisms/TemplateCard';

// Datos de prueba temporales (Mock Data)
const mockTemplates = [
  {
    id: 1,
    title: 'Minimal Tech SaaS',
    category: 'Tecnología',
    description: 'Diseño limpio y oscuro ideal para startups de software y aplicaciones.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Boutique Elegance',
    category: 'E-commerce',
    description: 'Estilo minimalista y sofisticado para tiendas de ropa o joyería.',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Health & Fitness Pro',
    category: 'Salud',
    description: 'Plantilla enérgica diseñada para gimnasios, entrenadores y nutricionistas.',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'Creative Portfolio',
    category: 'Freelance',
    description: 'Destaca tus trabajos creativos con esta galería de alto impacto visual.',
    imageUrl: 'https://images.unsplash.com/photo-1507238692062-8a0cb44ce740?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 5,
    title: 'Local Resto-Bar',
    category: 'Gastronomía',
    description: 'Perfecta para restaurantes que desean mostrar su menú y recibir reservas.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 6,
    title: 'Real Estate Prime',
    category: 'Inmobiliaria',
    description: 'Muestra propiedades con galerías de imágenes grandes y formularios de contacto rápidos.',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop'
  }
];

const Templates = () => {
  // Estado para un futuro filtro de categorías
  const [activeCategory, setActiveCategory] = useState('Todas');
  
  const categories = ['Todas', 'Tecnología', 'E-commerce', 'Salud', 'Freelance'];

  const filteredTemplates = activeCategory === 'Todas' 
    ? mockTemplates 
    : mockTemplates.filter(t => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-24">
        
        {/* Cabecera */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Explora nuestros diseños
          </h1>
          <p className="text-lg text-gray-600">
            Nuestra Inteligencia Artificial se basa en estas estructuras probadas para generar páginas de alta conversión. Elige tu favorita o deja que la IA decida por ti.
          </p>
        </div>

        {/* Filtros de Categorías (Pills) */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeCategory === cat 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de Plantillas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

      </main>
    </div>
  );
};

export default Templates;