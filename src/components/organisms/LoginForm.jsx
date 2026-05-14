import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsj, setErrorMsj] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsj('');
    setIsLoading(true);
    const result = await login(email, password);
    if (result.success) {
      if (result.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else {
      setErrorMsj(result.message);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-sapphire-900 mb-2">Bienvenido de nuevo</h2>
        <p className="text-gray-500 text-sm">Ingresa a tu cuenta de WebLandingSuite</p>
      </div>

      {errorMsj && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center font-medium">
          {errorMsj}
        </div>
      )}

      <div className="space-y-5 mb-8">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
          <Input
            type="email"
            name="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (errorMsj) setErrorMsj(''); }}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Contraseña</label>
          <Input
            type="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (errorMsj) setErrorMsj(''); }}
            required
            minLength={8}
          />
        </div>
      </div>

      <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
        {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
      </Button>

      <div className="mt-6 text-center text-sm text-gray-600">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="text-blue-600 hover:underline font-semibold">
          Regístrate aquí
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;