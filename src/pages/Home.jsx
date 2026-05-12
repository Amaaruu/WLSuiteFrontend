import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/organisms/Navbar';
import Button from '../components/atoms/Button';
import TemplateCard from '../components/organisms/TemplateCard'; 
import Footer from '../components/organisms/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';

const RevealOnScroll = ({ children, className = "", delay = "" }) => {
  const [ref, isVisible] = useScrollReveal();
  
  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${delay} ${className}`}
    >
      {children}
    </div>
  );
};

const Home = () => {
  const featuredTemplates = [
    { 
      id: 1, 
      title: 'Minimal Tech SaaS', 
      category: 'Tecnología', 
      description: 'Diseño limpio y oscuro ideal para startups.', 
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop' 
    },
    { 
      id: 2, 
      title: 'Boutique Elegance', 
      category: 'E-commerce', 
      description: 'Estilo minimalista para tiendas de ropa o joyería.', 
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop' 
    },
    { 
      id: 3, 
      title: 'Creative Portfolio', 
      category: 'Freelance', 
      description: 'Destaca tus trabajos creativos con esta galería.', 
      imageUrl: 'https://images.unsplash.com/photo-1507238692062-8a0cb44ce740?q=80&w=2070&auto=format&fit=crop' 
    }
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-sapphire-100 font-sans">
      <Navbar />
      
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sapphire-100/60 via-white to-white"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-sapphire-300/40 to-blue-200/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-sapphire-200/40 rounded-full blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">

            <RevealOnScroll delay="delay-100">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-sapphire-100 text-xs font-bold text-sapphire-700 mb-8 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sapphire-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sapphire-600"></span>
                </span>
                WEBLANDING SUITE 2.0
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay="delay-200">
              <h1 className="text-6xl lg:text-8xl font-black text-sapphire-950 mb-8 tracking-tight">
                Crea tu éxito <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sapphire-700 via-blue-600 to-indigo-600">
                  con Inteligencia
                </span>
              </h1>
            </RevealOnScroll>

            <RevealOnScroll delay="delay-300">
              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                Valida tu negocio en tiempo récord con la potencia de la IA. La herramienta diseñada para emprendedores que no se detienen.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay="delay-400">
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button variant="primary" className="w-full text-lg px-10 py-5 rounded-2xl shadow-xl shadow-sapphire-600/20 hover:-translate-y-1 hover:shadow-sapphire-600/30 transition-all">
                    Empezar ahora — Es gratis
                  </Button>
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section className="bg-gray-50/80 py-24 border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-sapphire-900 mb-4">Tu presencia online en 3 simples pasos</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Olvídate de horas de programación y diseño. Con WebLanding Suite, tu idea cobra vida al instante.</p>
            </div>
          </RevealOnScroll>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { step: "01", title: "Elige tu Plan", desc: "Selecciona el paquete que mejor se adapte a tu nivel de crecimiento y presupuesto.", delay: "delay-100" },
              { step: "02", title: "Habla con la IA", desc: "Describe tu negocio y objetivo. Nuestro modelo generará la estructura y textos persuasivos.", delay: "delay-300" },
              { step: "03", title: "Publica y Vende", desc: "Ajusta los detalles en nuestro editor y lanza tu landing page al mercado al instante.", delay: "delay-500" }
            ].map((item, idx) => (
              <RevealOnScroll key={idx} delay={item.delay}>
                <div className="relative p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-sapphire-100 transition-all group h-full">
                  <span className="text-6xl font-black text-sapphire-50 group-hover:text-sapphire-100 transition-colors absolute top-4 right-6">{item.step}</span>
                  <h3 className="text-xl font-bold mb-4 text-sapphire-900 relative z-10">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed relative z-10">{item.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-sapphire-50/50 blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-sapphire-900 mb-4">Inspiración a un click</h2>
                <p className="text-lg text-gray-600 max-w-2xl">Comienza con una base sólida diseñada por expertos y personalízala con el poder de la IA.</p>
              </div>
              <Link to="/templates">
                <Button variant="secondary" className="px-6 py-3 rounded-xl border border-sapphire-200 hover:border-sapphire-300">
                  Ver todas las plantillas
                </Button>
              </Link>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTemplates.map((template, idx) => (
              <RevealOnScroll key={template.id} delay={`delay-[${(idx + 1) * 150}ms]`}>
                <TemplateCard template={template} />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-gradient-to-b from-sapphire-700 to-sapphire-900 overflow-hidden border-none">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-sapphire-500/40 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              ¿Listo para transformar tu idea en realidad?
            </h2>
            <p className="text-xl text-sapphire-100 mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Únete a los emprendedores que ya están validando sus proyectos en minutos. Empieza hoy con WebLandingSuite.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white text-sapphire-900 font-bold text-lg hover:bg-sapphire-50 transition-colors shadow-xl shadow-black/10">
                  Crear mi cuenta gratis
                </button>
              </Link>
              <Link to="/contacto" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-10 py-4 rounded-2xl border border-sapphire-400 text-white font-bold text-lg hover:bg-sapphire-800 transition-colors">
                  Hablar con ventas
                </button>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;