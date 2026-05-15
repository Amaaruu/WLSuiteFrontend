import React from 'react';
import Navbar from '../components/organisms/Navbar';
import Footer from '../components/organisms/Footer';
import ContactSection from '../components/organisms/ContactSection';
import { useScrollReveal } from '../hooks/useScrollReveal';

const RevealOnScroll = ({ children, className = "", delay = "" }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${delay} ${className}`}>
      {children}
    </div>
  );
};

const Support = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="pt-40 pb-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <RevealOnScroll>
              <div className="max-w-3xl mx-auto text-center mb-24">
                <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sapphire-700 via-blue-600 to-indigo-600">
                  Soporte
                </h1>
                <p className="text-xl text-gray-600">
                  ¿Tienes dudas o necesitas ayuda con tu proyecto? Estamos aquí para responder todas tus preguntas.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay="delay-200">
              <div className="max-w-5xl mx-auto">
                <ContactSection />
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Support;