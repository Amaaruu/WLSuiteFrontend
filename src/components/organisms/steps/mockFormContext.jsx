import { vi } from 'vitest';

export const defaultFormData = {
  projectName: 'Cafetería El Rincón',
  projectIdea: 'Café de especialidad con repostería artesanal',
  callToAction: 'Reserva tu mesa',
  businessSector: 'gastronomia',
  landingGoal: 'reservas',
  targetAudience: 'adultos',
  brandPositioning: 'premium',
  brandStage: 'establecida',
  communicationTone: 'cercano',
  formalityLevel: 'semi-formal',
  primaryColor: 'azul-marino',
  secondaryColor: 'dorado',
  baseMode: 'claro',
  contrastLevel: 'estandar',
  visualStyle: 'moderno',
  typographyHierarchy: 'equilibrada',
  visualDensity: 'equilibrado',
  sectionDividers: 'limpia',
  sections: {
    hero: true,
    features: true,
    testimonials: false,
    faq: false,
    pricing: false,
    urgency: false,
  },
  heroImageUrl: null,
  logoImageUrl: null,
  typographyStyle: 'geometrica',
  buttonShape: 'redondeado',
  buttonStyle: 'solido',
  iconStyle: 'outline',
  layoutType: 'centrado',
  animationLevel: 'sutil',
  scrollEffect: 'fade-in',
  heroEffect: 'ninguno',
  creativityLevel: 'equilibrada',
};

// Llama esto en cada test file ANTES de importar el componente
export const mockUseFormContext = (overrides = {}) => {
  vi.mock('../../../../context/FormContext', () => ({
    useFormContext: () => ({
      formData: { ...defaultFormData, ...overrides },
      updateField: vi.fn(),
      toggleSection: vi.fn(),
      goToStep: vi.fn(),
      buildPayload: vi.fn(() => ({})),
      currentStep: 1,
    }),
  }));
};