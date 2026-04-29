import React from 'react';
import Navbar from '../components/organisms/Navbar';
import Button from '../components/atoms/Button';
import ContactSection from '../components/organisms/ContactSection'; // <-- 1. Importamos el nuevo organismo

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* SECCIÓN HERO */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sapphire-50 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-sapphire-100 rounded-full blur-3xl opacity-30" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-extrabold text-sapphire-900 mb-8 tracking-tight">
              Diseña landings de alto impacto <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sapphire-600 to-blue-400">
                potenciadas por IA
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              La plataforma definitiva para estudiantes y emprendedores que buscan validar modelos de negocio en el mercado chileno con velocidad profesional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="primary" className="w-full sm:w-auto text-lg px-8 py-4">
                Crear mi primera landing
              </Button>
              <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4">
                Explorar plantillas
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/*Renderizamos cualquier seccion aqui abajo*/} 

    </div>
  );
};

export default Home;