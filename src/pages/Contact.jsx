import React from 'react';
import Navbar from '../components/organisms/Navbar';
import ContactSection from '../components/organisms/ContactSection';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      {/* Añadimos pt-20 (padding-top) para que el Navbar fijo no tape el contenido */}
      <main className="flex-grow pt-20">
        <ContactSection />
      </main>
    </div>
  );
};

export default Contact;