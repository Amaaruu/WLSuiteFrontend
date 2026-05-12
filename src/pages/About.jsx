import React from 'react';
import Navbar from '../components/organisms/Navbar';
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

const About = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="pt-40 pb-20 bg-gray-50/50">
          <div className="container mx-auto px-4">
            <RevealOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sapphire-700 via-blue-600 to-indigo-600">
                  Nuestra Misión
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  WebLandingSuite nació con el propósito de democratizar el acceso a presencia web de alta calidad. 
                  Utilizamos Inteligencia Artificial para que cualquier emprendedor pueda validar sus ideas en minutos.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <section className="py-24 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <RevealOnScroll>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-sapphire-950">Por qué WebLanding Suite</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Creemos que el tiempo es el activo más valioso de un fundador. Nuestra tecnología elimina las barreras 
                  técnicas, permitiéndote enfocarte en lo que realmente importa: tu negocio.
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay="delay-300">
              <div className="aspect-video bg-sapphire-100 rounded-3xl overflow-hidden shadow-2xl">
                 <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070" className="w-full h-full object-cover" alt="Nosotros" />
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;