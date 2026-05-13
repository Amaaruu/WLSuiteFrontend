import React from 'react';
import Navbar from '../components/organisms/Navbar';
import Footer from '../components/organisms/Footer';
import LandingForm from '../components/organisms/LandingForm';
import { FormProvider } from '../context/FormContext';

const CreateLanding = () => {
  return (
    <FormProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
                Configura tu Landing Page
              </h1>
              <p className="text-gray-500 text-lg">
                Completa los pasos y nuestra IA hará el resto.
              </p>
            </div>
            <LandingForm />
          </div>
        </main>
        <Footer />
      </div>
    </FormProvider>
  );
};

export default CreateLanding;