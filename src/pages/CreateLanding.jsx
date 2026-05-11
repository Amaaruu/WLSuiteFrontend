import React from 'react';
import Navbar from '../components/organisms/Navbar';
import Footer from '../components/organisms/Footer';
import LandingForm from '../components/organisms/LandingForm';

const CreateLanding = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Configura tu Landing Page</h1>
            <p className="text-lg text-gray-600">Danos algunos detalles y nuestra IA hará el resto.</p>
          </div>
          <LandingForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateLanding;