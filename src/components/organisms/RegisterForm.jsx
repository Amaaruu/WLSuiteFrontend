// src/components/organisms/RegisterForm.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Eye, EyeOff } from 'lucide-react';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import api from '../../services/api';

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', lastname: '', email: '', password: '', confirmPassword: '',
  });
  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors,         setFieldErrors]         = useState({});
  const [isLoading,           setIsLoading]           = useState(false);
  const [error,               setError]               = useState(null);
  const [submitSuccess,       setSubmitSuccess]       = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: null }));
    if (error) setError(null);
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2)
      errors.name = 'El nombre debe tener al menos 2 caracteres.';
    if (!formData.lastname.trim() || formData.lastname.trim().length < 2)
      errors.lastname = 'El apellido debe tener al menos 2 caracteres.';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = 'Ingresa un correo electrónico válido.';
    if (!formData.password || formData.password.length < 8)
      errors.password = 'La contraseña debe tener al menos 8 caracteres.';
    if (!formData.confirmPassword)
      errors.confirmPassword = 'Por favor confirma tu contraseña.';
    else if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = 'Las contraseñas no coinciden.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }

    setIsLoading(true);
    setFieldErrors({});
    try {
      await api.post('/auth/register', {
        name:     formData.name.trim(),
        lastname: formData.lastname.trim(),
        email:    formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      setSubmitSuccess(true);
      setFormData({ name: '', lastname: '', email: '', password: '', confirmPassword: '' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar. Intenta con otro correo.');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

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
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm font-medium">¡Registro exitoso! Redirigiendo al login…</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FormField label="Nombre" name="name" type="text"
              value={formData.name} onChange={handleChange}
              error={fieldErrors.name} required />
          </div>
          <div>
            <FormField label="Apellido" name="lastname" type="text"
              value={formData.lastname} onChange={handleChange}
              error={fieldErrors.lastname} required />
          </div>
        </div>

        <FormField label="Correo Electrónico" name="email" type="email"
          value={formData.email} onChange={handleChange}
          error={fieldErrors.email} required />

        {/* Contraseña */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm font-medium text-gray-900 placeholder-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                fieldErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            />
            <button type="button" tabIndex={-1}
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {fieldErrors.password && <p className="text-xs text-red-500 font-medium">{fieldErrors.password}</p>}
          {formData.password.length > 0 && formData.password.length < 8 && !fieldErrors.password && (
            <p className="text-xs text-amber-500 font-medium">
              {8 - formData.password.length} caracteres más requeridos
            </p>
          )}
        </div>

        {/* Confirmar contraseña */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700">Confirmar contraseña</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm font-medium text-gray-900 placeholder-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                fieldErrors.confirmPassword ? 'border-red-300 bg-red-50'
                : passwordsMatch ? 'border-green-400 bg-green-50'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            />
            <button type="button" tabIndex={-1}
              onClick={() => setShowConfirmPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p className="text-xs text-red-500 font-medium">{fieldErrors.confirmPassword}</p>
          )}
          {passwordsMatch && (
            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
              <CheckCircle2 size={12} /> Las contraseñas coinciden
            </p>
          )}
        </div>

        <Button type="submit"
          className="w-full py-3 mt-2 text-white font-bold rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Crear cuenta'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/login" className="text-blue-600 hover:underline font-semibold">
          Inicia sesión aquí
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;