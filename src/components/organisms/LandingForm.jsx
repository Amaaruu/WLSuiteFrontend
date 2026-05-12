import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import FormField from '../molecules/FormField';
import SelectField from '../molecules/SelectField';
import PlanBadge from '../molecules/PlanBadge';
import FormSection from '../molecules/FormSection';
import Button from '../atoms/Button';
import api from '../../services/api';

const LandingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { transactionId, selectedPlan } = location.state || {};

  const [formData, setFormData] = useState({
    projectName: '',
    projectIdea: '',
    callToAction: '',
    businessSector: '',
    communicationTone: 'Profesional',
    designPreferences: {
      colorPalette: 'Modern Blue',
      visualStyle: 'minimalist',
      animationLevel: 'medium',
      customPrompt: '',
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isPlanAvanzado =
    selectedPlan?.name?.toLowerCase() === 'intermedio' ||
    selectedPlan?.name?.toLowerCase() === 'premium';

  if (!transactionId) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-xl">
        <h3 className="text-yellow-800 font-bold mb-2">Primero elige un plan</h3>
        <p className="text-yellow-700 text-sm mb-4">
          Para crear tu landing page necesitas seleccionar un plan primero.
        </p>
        <Button variant="primary" onClick={() => navigate('/planes')}>
          Ver planes
        </Button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDesignChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      designPreferences: { ...prev.designPreferences, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const payload = {
      transactionId,
      projectName: formData.projectName,
      projectIdea: formData.projectIdea,
      callToAction: formData.callToAction,
      businessSector: formData.businessSector,
      communicationTone: formData.communicationTone,
      designPreferences: formData.designPreferences,
    };

    try {
      const response = await api.post('/projects', payload);
      navigate('/project-result', { state: { project: response.data } });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Ocurrió un error al generar tu landing. Intenta de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8"
    >
      {/* Plan activo */}
      <PlanBadge planName={selectedPlan?.name} transactionId={transactionId} />

      {/* Sección 1 — Información básica */}
      <div className="space-y-5">
        <FormSection title="Información básica" />

        <FormField
          label="Nombre del proyecto"
          id="projectName"
          name="projectName"
          placeholder="Ej: Cafetería El Rincón"
          value={formData.projectName}
          onChange={handleChange}
          required
        />

        <FormField
          label="¿Qué hace tu negocio?"
          id="projectIdea"
          name="projectIdea"
          placeholder="Ej: Somos una cafetería de especialidad en Santiago que vende café de origen y repostería artesanal..."
          value={formData.projectIdea}
          onChange={handleChange}
          isTextArea
          required
        />

        <FormField
          label="¿Qué quieres que haga el visitante? (CTA)"
          id="callToAction"
          name="callToAction"
          placeholder="Ej: Reserva tu mesa, Pide tu primera bolsa gratis, Contáctanos hoy"
          value={formData.callToAction}
          onChange={handleChange}
          required
        />
      </div>

      {/* Sección 2 — Preferencias de diseño */}
      <div className="space-y-5">
        <FormSection title="Preferencias de diseño" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            label="Sector del negocio"
            id="businessSector"
            name="businessSector"
            placeholder="Ej: Gastronomía, Tecnología, Salud..."
            value={formData.businessSector}
            onChange={handleChange}
          />

          <SelectField
            label="Tono de comunicación"
            id="communicationTone"
            name="communicationTone"
            value={formData.communicationTone}
            onChange={handleChange}
          >
            <option value="Profesional">Profesional</option>
            <option value="Cercano">Cercano / Amigable</option>
            <option value="Elegante">Elegante / Lujoso</option>
            <option value="Jovial">Jovial / Divertido</option>
          </SelectField>

          <SelectField
            label="Paleta de colores"
            id="colorPalette"
            name="colorPalette"
            value={formData.designPreferences.colorPalette}
            onChange={handleDesignChange}
          >
            <option value="Modern Blue">Azul moderno</option>
            <option value="Minimal Dark">Oscuro minimalista</option>
            <option value="Nature Green">Verde naturaleza</option>
            <option value="Warm Coral">Coral cálido</option>
          </SelectField>

          <SelectField
            label="Estilo visual"
            id="visualStyle"
            name="visualStyle"
            value={formData.designPreferences.visualStyle}
            onChange={handleDesignChange}
          >
            <option value="minimalist">Minimalista</option>
            <option value="bold">Audaz / Llamativo</option>
            <option value="elegant">Elegante</option>
            <option value="playful">Dinámico</option>
          </SelectField>
        </div>
      </div>

      {/* Sección 3 — Solo planes avanzados */}
      {isPlanAvanzado && (
        <div className="space-y-5">
          <FormSection title="Instrucciones personalizadas" badge={`Plan ${selectedPlan.name}`} />

          <FormField
            label="Prompt personalizado para la IA"
            id="customPrompt"
            name="customPrompt"
            placeholder="Agrega instrucciones específicas: secciones que deseas, referencias de diseño, estilo de redacción..."
            value={formData.designPreferences.customPrompt}
            onChange={handleDesignChange}
            isTextArea
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Submit */}
      <Button type="submit" variant="primary" className="w-full py-4 text-lg" disabled={isLoading}>
        {isLoading ? 'La IA está generando tu landing...' : '✦ Generar mi landing page'}
      </Button>
    </form>
  );
};

export default LandingForm;