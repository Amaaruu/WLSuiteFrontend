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

      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-sapphire-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.35),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-sapphire-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-blue-500/15 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">

            <RevealOnScroll delay="delay-100">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/15 text-xs font-bold text-sapphire-300 mb-8 shadow-sm hover:bg-white/10 transition-colors cursor-default">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sapphire-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sapphire-400" />
                </span>
                WEBLANDING SUITE 2.0
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay="delay-200">
              <h1 className="text-6xl lg:text-8xl font-black text-white mb-8 tracking-tight leading-[1.05]">
                Crea tu éxito <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sapphire-400 via-blue-400 to-indigo-400">
                  con Inteligencia
                </span>
              </h1>
            </RevealOnScroll>

            <RevealOnScroll delay="delay-300">
              <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                Valida tu negocio en tiempo récord con la potencia de la IA. La herramienta diseñada para emprendedores que no se detienen.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay="delay-400">
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                <Link to="/register" className="w-full sm:w-auto">
                  <button className="group relative w-full overflow-hidden text-lg font-bold px-10 py-5 rounded-2xl bg-sapphire-600 text-white shadow-2xl shadow-sapphire-900/50 border border-sapphire-500/50 hover:border-sapphire-400/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-sapphire-600/40">
                    <span className="relative z-10">Empezar ahora</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-sapphire-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-150" />
                  </button>
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      <section className="bg-gray-50 py-24 border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-bold tracking-widest text-sapphire-500 uppercase mb-4 px-3 py-1 bg-sapphire-50 rounded-full border border-sapphire-100">
                Simple por diseño
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-sapphire-900 mb-4">
                Tu presencia online en 3 simples pasos
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Olvídate de horas de programación y diseño. Con WebLanding Suite, tu idea cobra vida al instante.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
            {[
              {
                step: "01",
                title: "Elige tu Plan",
                desc: "Selecciona el paquete que mejor se adapte a tu nivel de crecimiento y presupuesto.",
                delay: "delay-100",
                icon: "💎",
                gradient: "from-sapphire-500/10 to-blue-500/5",
                border: "border-sapphire-200/60",
                accent: "text-sapphire-600",
                glow: "group-hover:shadow-sapphire-500/10"
              },
              {
                step: "02",
                title: "Habla con la IA",
                desc: "Describe tu negocio y objetivo. Nuestro modelo generará la estructura y textos persuasivos.",
                delay: "delay-300",
                icon: "⚡",
                gradient: "from-blue-500/10 to-indigo-500/5",
                border: "border-blue-200/60",
                accent: "text-blue-600",
                glow: "group-hover:shadow-blue-500/10"
              },
              {
                step: "03",
                title: "Publica y Vende",
                desc: "Ajusta los detalles en nuestro editor y lanza tu landing page al mercado al instante.",
                delay: "delay-500",
                icon: "🚀",
                gradient: "from-indigo-500/10 to-purple-500/5",
                border: "border-indigo-200/60",
                accent: "text-indigo-600",
                glow: "group-hover:shadow-indigo-500/10"
              }
            ].map((item, idx) => (
              <RevealOnScroll key={idx} delay={item.delay}>
                <div className={`group relative p-8 rounded-3xl bg-white border ${item.border} shadow-sm hover:shadow-xl ${item.glow} transition-all duration-500 hover:-translate-y-2 overflow-hidden h-full`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-sm">
                        {item.icon}
                      </div>
                      <span className={`text-5xl font-black ${item.accent} opacity-10 group-hover:opacity-20 transition-opacity duration-300 select-none`}>
                        {item.step}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-sapphire-900 group-hover:text-sapphire-800 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors">
                      {item.desc}
                    </p>

                    <div className={`mt-6 flex items-center gap-2 text-sm font-semibold ${item.accent} opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0`}>
                      <span>Paso {item.step}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sapphire-200 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[400px] bg-gradient-radial from-sapphire-50/60 to-transparent blur-3xl -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <span className="inline-block text-xs font-bold tracking-widest text-sapphire-500 uppercase mb-3 px-3 py-1 bg-sapphire-50 rounded-full border border-sapphire-100">
                  Diseños probados
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-sapphire-900 mb-4">
                  Inspiración a un click
                </h2>
                <p className="text-lg text-gray-500 max-w-2xl">
                  Comienza con una base sólida diseñada por expertos y personalízala con el poder de la IA.
                </p>
              </div>
              <Link to="/templates">
                <button className="group flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-sapphire-700 border-2 border-sapphire-200 hover:border-sapphire-400 hover:bg-sapphire-50 transition-all duration-200 whitespace-nowrap">
                  Ver todas
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-200">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </Link>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTemplates.map((template, idx) => (
              <RevealOnScroll key={template.id} delay={`delay-[${(idx + 1) * 150}ms]`}>
                <div className="group relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-sapphire-900/10 transition-all duration-500 hover:-translate-y-2 flex flex-col">
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={template.imageUrl}
                      alt={template.title}
                      className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sapphire-950/70 via-sapphire-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-sapphire-800 shadow-sm border border-white/50">
                      {template.category}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                      <button className="w-full py-2.5 bg-white text-sapphire-900 font-bold text-sm rounded-xl hover:bg-sapphire-50 transition-colors shadow-lg">
                        Ver demostración
                      </button>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-sapphire-700 transition-colors">
                        {template.title}
                      </h3>
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-sapphire-50 group-hover:border-sapphire-100 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-sapphire-600">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm flex-grow leading-relaxed">
                      {template.description}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === 0 ? 'w-8 bg-sapphire-500 group-hover:w-10' : i === 1 ? 'w-4 bg-sapphire-300 group-hover:w-6' : 'w-2 bg-sapphire-200'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-300 font-medium">Responsive</span>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-gradient-to-b from-sapphire-900 to-sapphire-950 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-sapphire-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              ¿Listo para transformar tu idea en realidad?
            </h2>
            <p className="text-xl text-sapphire-200/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              Únete a los emprendedores que ya están validando sus proyectos en minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white text-sapphire-900 font-bold text-lg hover:bg-sapphire-50 transition-all duration-200 shadow-xl shadow-black/20 hover:-translate-y-0.5 hover:shadow-2xl">
                  Crear mi cuenta gratis
                </button>
              </Link>
              <Link to="/soporte" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-10 py-4 rounded-2xl border border-white/15 text-white/80 font-bold text-lg hover:bg-white/10 hover:text-white hover:border-white/30 transition-all duration-200">
                  Hablar con soporte
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