// src/components/organisms/LandingForm.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Átomos
import Button from '../atoms/Button';

// Moléculas existentes
import FormField from '../molecules/FormField';
import SelectField from '../molecules/SelectField';
import PlanBadge from '../molecules/PlanBadge';
import FormSection from '../molecules/FormSection';

// Moléculas nuevas
import LockedField from '../molecules/LockedField';
import UpgradeBanner from '../molecules/UpgradeBanner';

// Servicio
import api from '../../services/api';

// ─── Utilidad: nivel numérico del plan ──────────────────────────────────────
const PLAN_LEVELS = {
  básico:     1,
  basico:     1,
  intermedio: 2,
  premium:    3,
};

const getPlanLevel = (planName) =>
  PLAN_LEVELS[planName?.toLowerCase()] ?? 1;

// ────────────────────────────────────────────────────────────────────────────

const LandingForm = () => {
  const location  = useLocation();
  const navigate  = useNavigate();

  const { transactionId, selectedPlan } = location.state || {};
  const planLevel = getPlanLevel(selectedPlan?.name);

  const [formData, setFormData] = useState({
    projectName:      '',
    projectIdea:      '',
    callToAction:     '',
    businessSector:   '',
    communicationTone: 'Profesional',
    designPreferences: {
      colorPalette:   'Modern Blue',
      visualStyle:    'minimalist',
      animationLevel: 'medium',
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);

  // ── Guard: sin transacción ───────────────────────────────────────────────
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

  // ── Handlers ─────────────────────────────────────────────────────────────
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

    // Solo se envían los campos que el plan habilita
    const payload = {
      transactionId,
      projectName:  formData.projectName,
      projectIdea:  formData.projectIdea,
      callToAction: formData.callToAction,

      ...(planLevel >= 2 && {
        businessSector:    formData.businessSector,
        communicationTone: formData.communicationTone,
        designPreferences: {
          colorPalette: formData.designPreferences.colorPalette,
          visualStyle:  formData.designPreferences.visualStyle,

          ...(planLevel >= 3 && {
            animationLevel: formData.designPreferences.animationLevel,
          }),
        },
      }),
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

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8"
    >
      {/* Badge del plan activo */}
      <PlanBadge planName={selectedPlan?.name} transactionId={transactionId} />

      {/* Banner de upgrade — se oculta automáticamente en Premium */}
      <UpgradeBanner planLevel={planLevel} />

      {/* ── Sección 1: Información básica — todos los planes ─────────────── */}
      <div className="space-y-5">
        <FormSection title="Información básica" badge="Todos los planes" />

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

      {/* ── Sección 2: Preferencias de diseño — Plan Intermedio+ ─────────── */}
      <div className="space-y-5">
        <FormSection title="Preferencias de diseño" badge="Plan Intermedio+" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Sector del negocio */}
          {planLevel >= 2 ? (
            <FormField
              label="Sector del negocio"
              id="businessSector"
              name="businessSector"
              placeholder="Ej: Gastronomía, Tecnología, Salud..."
              value={formData.businessSector}
              onChange={handleChange}
            />
          ) : (
            <LockedField
              label="Sector del negocio"
              requiredPlan="Intermedio"
              variant="intermedio"
            />
          )}

          {/* Tono de comunicación */}
          {planLevel >= 2 ? (
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
          ) : (
            <LockedField
              label="Tono de comunicación"
              requiredPlan="Intermedio"
              variant="intermedio"
            />
          )}

          {/* Paleta de colores */}
          {planLevel >= 2 ? (
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
          ) : (
            <LockedField
              label="Paleta de colores"
              requiredPlan="Intermedio"
              variant="intermedio"
            />
          )}

          {/* Estilo visual */}
          {planLevel >= 2 ? (
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
          ) : (
            <LockedField
              label="Estilo visual"
              requiredPlan="Intermedio"
              variant="intermedio"
            />
          )}
        </div>
      </div>

      {/* ── Sección 3: Configuración avanzada — Plan Premium ─────────────── */}
      <div className="space-y-5">
        <FormSection title="Configuración avanzada" badge="Plan Premium" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Nivel de animación */}
          {planLevel >= 3 ? (
            <SelectField
              label="Nivel de animación"
              id="animationLevel"
              name="animationLevel"
              value={formData.designPreferences.animationLevel}
              onChange={handleDesignChange}
            >
              <option value="none">Sin animaciones</option>
              <option value="subtle">Sutil</option>
              <option value="medium">Moderado</option>
              <option value="high">Dinámico</option>
            </SelectField>
          ) : (
            <LockedField
              label="Nivel de animación"
              requiredPlan="Premium"
              variant="premium"
            />
          )}

          {/* Optimización SEO — reservado Premium */}
          {planLevel >= 3 ? (
            <SelectField
              label="Optimización SEO"
              id="seoLevel"
              name="seoLevel"
              value={formData.designPreferences.seoLevel ?? 'basic'}
              onChange={handleDesignChange}
            >
              <option value="basic">Básica</option>
              <option value="advanced">Avanzada</option>
            </SelectField>
          ) : (
            <LockedField
              label="Optimización SEO avanzada"
              requiredPlan="Premium"
              variant="premium"
            />
          )}
        </div>

        {/* Confirmación de acceso total para Premium */}
        {planLevel >= 3 && (
          <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl px-4 py-3">
            <span className="text-lg" aria-hidden="true">🏆</span>
            <p className="text-sm text-indigo-700 font-medium">
              Tienes acceso completo a todas las funcionalidades del Plan Premium.
            </p>
          </div>
        )}
      </div>

      {/* Error general */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        className="w-full py-4 text-lg"
        disabled={isLoading}
      >
        {isLoading ? 'La IA está generando tu landing...' : '✦ Generar mi landing page'}
      </Button>
    </form>
  );
};

export default LandingForm;