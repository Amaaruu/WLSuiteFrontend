import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LandingForm from './LandingForm';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({
      state: {
        transactionId: 'tx-test-001',
        selectedPlan: { name: 'Básico', price: 0, planId: 1 },
      },
    }),
  };
});

vi.mock('../../../services/api', () => ({
  default: { post: vi.fn().mockResolvedValue({ data: { projectId: 'proj-1' } }) }
}));

vi.mock('../../context/FormContext', () => ({
  useFormContext: () => ({
    formData: {
      projectName: 'Mi empresa',
      projectIdea: 'Vendo productos artesanales',
      callToAction: 'Contáctanos',
      businessSector: 'retail',
      landingGoal: 'ventas',
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
      sections: { hero: true, features: true, testimonials: false, faq: false, pricing: false, urgency: false },
      heroImageUrl: '',
      logoImageUrl: '',
      typographyStyle: 'geometrica',
      buttonShape: 'redondeado',
      buttonStyle: 'solido',
      iconStyle: 'outline',
      layoutType: 'centrado',
      animationLevel: 'sutil',
      scrollEffect: 'fade-in',
      heroEffect: 'ninguno',
      creativityLevel: 'equilibrada',
    },
    currentStep: 1,
    goToStep: vi.fn(),
    buildPayload: vi.fn(() => ({})),
  }),
}));

describe('LandingForm', () => {
  it('muestra la barra de pasos', () => {
    render(<MemoryRouter><LandingForm /></MemoryRouter>);
    expect(screen.getByRole('navigation')).toBeTruthy();
  });

  it('muestra el título h2 del paso 1', () => {
    render(<MemoryRouter><LandingForm /></MemoryRouter>);
    // Hay múltiples "Tu negocio", buscamos el h2 específicamente
    const heading = screen.getAllByText('Tu negocio').find(el => el.tagName === 'H2');
    expect(heading).toBeTruthy();
  });

  it('muestra el botón Continuar', () => {
    render(<MemoryRouter><LandingForm /></MemoryRouter>);
    expect(screen.getByText('Continuar →')).toBeTruthy();
  });

  it('muestra el botón Atrás en el paso 1', () => {
    render(<MemoryRouter><LandingForm /></MemoryRouter>);
    expect(screen.getByText('← Atrás')).toBeTruthy();
  });

  it('muestra el badge del plan activo', () => {
    render(<MemoryRouter><LandingForm /></MemoryRouter>);
    expect(screen.getByText(/Básico/)).toBeTruthy();
  });

  it('muestra el banner de upgrade para plan básico', () => {
    render(<MemoryRouter><LandingForm /></MemoryRouter>);
    expect(screen.getByText(/Desbloquea más funciones/)).toBeTruthy();
  });

  it('muestra el campo nombre del proyecto', () => {
    render(<MemoryRouter><LandingForm /></MemoryRouter>);
    expect(screen.getByLabelText('Nombre del proyecto o negocio')).toBeTruthy();
  });
});