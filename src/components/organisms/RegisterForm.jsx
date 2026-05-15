import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react'; 
import FormField from '../molecules/FormField'; 
import Button from '../atoms/Button'; 
import api from '../../services/api'; 

const RegisterForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    role: 'user'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (error) setError(null);
    if (submitSuccess) setSubmitSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSubmitSuccess(false);

    try {
      const response = await api.post('/auth/register', formData);

      setSubmitSuccess(true);
      setFormData({
        name: '',
        lastname: '',
        email: '',
        password: '',
        role: 'user'
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000); 
      
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar. Intenta con otro correo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Crea tu cuenta</h2>
        <p className="text-gray-500">Únete a WebLandingSuite hoy mismo</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center font-medium border border-red-100">
          {error}
        </div>
      )}

      {submitSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <p className="text-sm font-medium">¡Registro exitoso! Ya puedes iniciar sesión.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Nombre" name="name" type="text" value={formData.name} onChange={handleChange} required />
          <FormField label="Apellido" name="lastname" type="text" value={formData.lastname} onChange={handleChange} required />
        </div>
        <FormField label="Correo Electrónico" name="email" type="email" value={formData.email} onChange={handleChange} required />
        <FormField label="Contraseña" name="password" type="password" value={formData.password} onChange={handleChange} required minLength={8} />

        <Button type="submit" className="w-full py-3 mt-4 text-white font-bold rounded-lg bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-600 hover:underline font-semibold">Inicia sesión aquí</Link>
      </div>
    </div>
  );
};

export default RegisterForm;