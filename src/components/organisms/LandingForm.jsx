// src/components/organisms/LandingForm.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import Button from '../atoms/Button';
import StepperBar from '../molecules/StepperBar';
import PlanBadge from '../molecules/PlanBadge';
import UpgradeBanner from '../molecules/UpgradeBanner';
import Step1Identity      from './steps/Step1Identity';
import Step2Communication from './steps/Step2Communication';
import Step3Visual        from './steps/Step3Visual';
import Step4Advanced      from './steps/Step4Advanced';
import StepReview         from './steps/StepReview';
import api from '../../services/api';

const PLAN_LEVELS = {
  básico: 1, basico: 1, intermedio: 2, premium: 3,
};
const getPlanLevel = (name) => PLAN_LEVELS[name?.toLowerCase()] ?? 1;

// Los pasos disponibles dependen del nivel del plan.
// Plan Básico:     paso 1 + revisión.
// Intermedio:      pasos 1–3 + revisión.
// Premium:         pasos 1–4 + revisión.
const getSteps = (planLevel) => {
  const all = [
    { id: 'identity',      label: 'Tu negocio'     },
    { id: 'communication', label: 'Comunicación'    },
    { id: 'visual',        label: 'Estilo'          },
    { id: 'advanced',      label: 'Diseño avanzado' },
    { id: 'review',        label: 'Revisión'        },
  ];

  if (planLevel === 1) return [all[0], all[4]];
  if (planLevel === 2) return [all[0], all[1], all[2], all[4]];
  return all;
};

// Validación mínima por paso
const validateStep = (stepId, formData) => {
  if (stepId === 'identity') {
    return (
      formData.projectName.trim()    !== '' &&
      formData.projectIdea.trim()    !== '' &&
      formData.callToAction.trim()   !== '' &&
      formData.businessSector        !== '' &&
      formData.landingGoal           !== '' &&
      formData.targetAudience        !== '' &&
      formData.brandPositioning      !== '' &&
      formData.brandStage            !== ''
    );
  }
  return true;
};

const LandingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, currentStep, goToStep, buildPayload } = useFormContext();

  const { transactionId, selectedPlan } = location.state || {};
  const planLevel = getPlanLevel(selectedPlan?.name);
  const steps     = getSteps(planLevel);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);

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

  const currentStepIndex  = currentStep - 1;
  const currentStepConfig = steps[currentStepIndex];
  const isReviewStep      = currentStepConfig?.id === 'review';
  const canAdvance        = validateStep(currentStepConfig?.id, formData);

  const handleNext = () => {
    if (!canAdvance) {
      setError('Por favor completa todos los campos requeridos antes de continuar.');
      return;
    }
    setError(null);
    goToStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setError(null);
    goToStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditStep = (targetStepNumber) => {
    setError(null);
    goToStep(targetStepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const payload  = buildPayload(transactionId);
      const response = await api.post('/projects', payload);
      navigate(`/project-result/${response.data.projectId}`, {
        state: { project: response.data },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Ocurrió un error al generar tu landing. Intenta de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStepConfig?.id) {
      case 'identity':      return <Step1Identity />;
      case 'communication': return <Step2Communication planLevel={planLevel} />;
      case 'visual':        return <Step3Visual planLevel={planLevel} />;
      case 'advanced':      return <Step4Advanced planLevel={planLevel} />;
      case 'review':        return <StepReview planLevel={planLevel} onEditStep={handleEditStep} />;
      default:              return null;
    }
  };

  const STEP_TITLES = {
    identity:      { title: 'Tu negocio',              desc: 'Define quién eres, a quién le hablas y qué quieres lograr.'          },
    communication: { title: 'Comunicación y colores',   desc: 'Define el tono de tu marca y la identidad visual de color.'          },
    visual:        { title: 'Estilo y secciones',       desc: 'Elige la estética y estructura de contenido de tu landing.'          },
    advanced:      { title: 'Diseño avanzado',          desc: 'Configura tipografía, botones, animaciones y creatividad.'           },
    review:        { title: 'Revisa tu configuración',  desc: 'Confirma todos los detalles antes de generar tu landing.'            },
  };

  const stepTitle = STEP_TITLES[currentStepConfig?.id] || {};

  return (
    <div className="space-y-6">
      {/* Barra de progreso */}
      <StepperBar steps={steps} currentStep={currentStep} />

      {/* Badge y título del paso */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          {stepTitle.title && (
            <h2 className="text-xl font-bold text-gray-900">{stepTitle.title}</h2>
          )}
          {stepTitle.desc && (
            <p className="text-sm text-gray-500 mt-0.5">{stepTitle.desc}</p>
          )}
        </div>
        <PlanBadge planName={selectedPlan?.name} />
      </div>

      {/* Banner de upgrade si el plan es básico y está en step 1 */}
      {planLevel === 1 && currentStep === 1 && (
        <UpgradeBanner />
      )}

      {/* Contenido del paso actual */}
      <div>{renderStep()}</div>

      {/* Error de validación */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Navegación entre pasos */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 1 || isLoading}
        >
          ← Atrás
        </Button>

        {isReviewStep ? (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Generando landing…' : 'Generar mi landing page'}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!canAdvance || isLoading}
          >
            Continuar →
          </Button>
        )}
      </div>
    </div>
  );
};

export default LandingForm;