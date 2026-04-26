import React from 'react';
import Button from '../components/atoms/Button';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      
      {/* Esto luego lo moveremos a un Organismo llamado HeroSection */}
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
          Crea tu Landing Page con <span className="text-sapphire-600">Inteligencia Artificial</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          Valida tu modelo de negocio y productos de dropshipping en Chile en segundos. Sin código, sin estrés.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button variant="primary">Comenzar Gratis</Button>
          <Button variant="outline">Ver Demo</Button>
        </div>
      </div>

    </div>
  );
};

export default Home;