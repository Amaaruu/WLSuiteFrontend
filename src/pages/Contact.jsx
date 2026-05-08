import React from 'react';
import Navbar from '../components/organisms/Navbar';
import ContactSection from '../components/organisms/ContactSection';
import Footer from '../components/organisms/Footer';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <ContactSection />
      </main>
      <Footer />
    </div>
    
  );
};

export default Contact;