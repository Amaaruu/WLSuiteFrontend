import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react'; // El mismo ícono del registro
import FormField from '../molecules/FormField'; 
import Button from '../atoms/Button'; 

const LoginForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false); // Estado para el éxito

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Ocultar errores si el usuario vuelve a escribir
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSubmitSuccess(false);

    // Validación de longitud de contraseña
    if (formData.password.length < 4 || formData.password.length > 10) {
      setError("La contraseña debe tener entre 4 y 10 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas. Revisa tu correo y contraseña.');
      }

      const data = await response.json();
      
      // Guardamos el JWT
      localStorage.setItem('token', data.token); 
      
      localStorage.setItem('userName', data.name || 'Usuario'); // Guardamos el nombre para mostrarlo en el navbar
      // Mostramos el mensaje de éxito
      setSubmitSuccess(true);
      
      // Esperamos 1.5 segundos para que alcance a leer, y luego redirigimos
      setTimeout(() => {
        window.location.href = '/'; 
      }, 1500);
      
    } catch (err) {
      setError(err.message);
      setIsLoading(false); // Solo quitamos el loading si hay error
    } 
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-sapphire-900 mb-2">Iniciar Sesión</h2>
        <p className="text-gray-500">Ingresa a tu cuenta de WebLandingSuite</p>
      </div>

      {/* Recuadro de Error (Rojo) */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center font-medium border border-red-100">
          {error}
        </div>
      )}

      {/* Recuadro de Éxito (Verde) */}
      {submitSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <p className="text-sm font-medium">¡Inicio de sesión exitoso! Redirigiendo...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField 
          label="Correo Electrónico" 
          name="email" 
          type="email" 
          placeholder="tu@correo.com"
          value={formData.email} 
          onChange={handleChange} 
          required 
        />

        <FormField 
          label="Contraseña" 
          name="password" 
          type="password" 
          placeholder="Ingresa tu contraseña"
          value={formData.password} 
          onChange={handleChange} 
          required 
        />

        <div className="d-grid mt-4">
          <Button 
            type="submit" 
            className="w-full py-3 text-white font-bold rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
            disabled={isLoading || submitSuccess} // Lo desactivamos si ya tuvo éxito
          >
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        ¿No tienes una cuenta?{' '}
        <Link to="/register" className="text-blue-600 hover:underline font-semibold">
          Regístrate aquí
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;