import React from 'react';
import Navbar from '../components/organisms/Navbar';
import LoginForm from '../components/organisms/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4 py-24">
        <LoginForm />
      </main>
    </div>
  );
};

export default Login;