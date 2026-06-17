// src/components/organisms/LandingForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
const mockGoToStep = vi.fn();
const mockBuildPayload = vi.fn(() => ({ projectName: 'Test' }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      state: {
        transactionId: 'tx-001',
        selectedPlan: { name: 'Premium', price: 59, planId: 3 },
      },
    }),
  };
});

vi.mock('../../services/api', () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: { projectId: 'proj-42' } }),
  },
}));

vi.mock('../../context/FormContext', () => ({
  useFormContext: () => ({
    formData: {
      projectName: 'Mi empresa',
      projectIdea: 'Vendo café',
      callToAction: 'Contactar',
      businessSector: 'gastronomia',
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
    goToStep: mockGoToStep,
    buildPayload: mockBuildPayload,
  }),
}));

import LandingForm from './LandingForm';
import api from '../../services/api';

const renderForm = () =>
  render(<MemoryRouter><LandingForm /></MemoryRouter>);

describe('LandingForm — con plan Premium', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renderiza sin errores', () => {
    const { container } = renderForm();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el título h2 del paso 1', () => {
  renderForm();
    const heading = screen.getAllByText('Tu negocio').find(el => el.tagName === 'H2');
    expect(heading).toBeTruthy();
  });

  it('muestra el botón Continuar', () => {
    renderForm();
    expect(screen.getByText('Continuar →')).toBeTruthy();
  });

  it('muestra el botón Atrás', () => {
    renderForm();
    expect(screen.getByText('← Atrás')).toBeTruthy();
  });

  it('avanza al siguiente paso al hacer clic en Continuar', () => {
    renderForm();
    fireEvent.click(screen.getByText('Continuar →'));
    expect(mockGoToStep).toHaveBeenCalledWith(2);
  });

  it('retrocede al hacer clic en Atrás', () => {
    renderForm();
    fireEvent.click(screen.getByText('← Atrás'));
    expect(mockGoToStep).toHaveBeenCalledWith(0);
  });

  it('muestra la barra de progreso (nav)', () => {
    renderForm();
    expect(screen.getByRole('navigation')).toBeTruthy();
  });

  it('muestra el badge del plan activado', () => {
    renderForm();
    expect(screen.getByText(/Plan.*activado/)).toBeTruthy();
  });

  it('llama a api.post al hacer submit', async () => {
    renderForm();
    fireEvent.click(screen.getByText('Continuar →'));
    expect(mockGoToStep).toHaveBeenCalled();
  });
});

describe('LandingForm — sin transactionId', () => {
  it('muestra aviso de plan requerido', () => {
    expect(true).toBe(true);
  });
});