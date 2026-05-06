import React from 'react';
import Navbar from '../components/organisms/Navbar';
import RegisterForm from '../components/organisms/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4 py-24">
        <RegisterForm />
      </main>
    </div>
  );
};

export default Register;