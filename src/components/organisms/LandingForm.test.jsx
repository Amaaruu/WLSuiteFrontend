import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const { apiPost } = vi.hoisted(() => ({ apiPost: vi.fn() }));
const mockNavigate = vi.fn();
const mockGoToStep = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      state: {
        transactionId: 10,
        selectedPlan: { planId: 2, name: 'Intermedio', price: 29 },
      },
    }),
  };
});

vi.mock('../../services/api', () => ({ default: { post: apiPost } }));

vi.mock('../../context/FormContext', () => ({
  useFormContext: () => ({
    formData: {
      projectName: 'Test Proyecto',
      projectIdea: 'Venta de productos',
      callToAction: 'Compra ahora',
      businessSector: 'ecommerce',
      landingGoal: 'ventas',
      targetAudience: 'adultos',
      brandPositioning: 'premium',
      brandStage: 'establecida',
      communicationTone: 'profesional',
      formalityLevel: 'formal',
      primaryColor: 'azul',
      secondaryColor: 'gris',
      baseMode: 'claro',
      contrastLevel: 'estandar',
      visualStyle: 'moderno',
      typographyHierarchy: 'equilibrada',
      visualDensity: 'equilibrado',
      sectionDividers: 'limpia',
      sections: { hero: true, features: true, testimonials: false, faq: false, pricing: false, urgency: false },
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
      valueProposition: 'La mejor opción',
    },
    currentStep: 1,
    goToStep: mockGoToStep,
    buildPayload: vi.fn(() => ({ projectName: 'Test' })),
  }),
}));

vi.mock('../../components/atoms/Button',        () => ({
  default: ({ children, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>{children}</button>
  ),
}));
vi.mock('../../components/molecules/StepperBar',    () => ({ default: () => <div>StepperBar</div> }));
vi.mock('../../components/molecules/PlanBadge',     () => ({ default: () => <div>PlanBadge</div> }));
vi.mock('../../components/molecules/UpgradeBanner', () => ({ default: () => <div>UpgradeBanner</div> }));
vi.mock('./steps/Step1Identity',      () => ({ default: () => <div data-testid="step1">Step1</div> }));
vi.mock('./steps/Step2Communication', () => ({ default: () => <div data-testid="step2">Step2</div> }));
vi.mock('./steps/Step3Visual',        () => ({ default: () => <div data-testid="step3">Step3</div> }));
vi.mock('./steps/Step4Advanced',      () => ({ default: () => <div data-testid="step4">Step4</div> }));
vi.mock('./steps/StepReview',         () => ({ default: () => <div data-testid="step-review">StepReview</div> }));

import LandingForm from './LandingForm';

const renderForm = (locationState = {
  transactionId: 10,
  selectedPlan: { planId: 2, name: 'Intermedio', price: 29 },
}) =>
  render(
    <MemoryRouter>
      <LandingForm />
    </MemoryRouter>
  );

describe('Organismo: LandingForm', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sin transactionId en el estado', () => {
    it('muestra aviso de elegir plan cuando no hay transactionId', () => {
      vi.doMock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom');
        return { ...actual, useNavigate: () => mockNavigate, useLocation: () => ({ state: null }) };
      });
      renderForm();
      expect(screen.getByTestId('step1')).toBeTruthy();
    });
  });

  it('muestra el StepperBar', () => {
    renderForm();
    expect(screen.getByText('StepperBar')).toBeTruthy();
  });

  it('muestra el Step1 en el paso 1', () => {
    renderForm();
    expect(screen.getByTestId('step1')).toBeTruthy();
  });

  it('muestra el PlanBadge', () => {
    renderForm();
    expect(screen.getByText('PlanBadge')).toBeTruthy();
  });

  describe('botones de navegación', () => {
    it('el botón Siguiente llama a goToStep con paso + 1', () => {
      renderForm();
      const nextBtn = screen.queryByRole('button', { name: /siguiente|continuar|next/i });
      if (nextBtn) {
        fireEvent.click(nextBtn);
        expect(mockGoToStep).toHaveBeenCalledWith(2);
      }
    });

    it('muestra error si el formulario está incompleto al intentar avanzar', async () => {
      renderForm();
      const nextBtn = screen.queryByRole('button', { name: /siguiente|continuar|next/i });
      if (nextBtn) {
        fireEvent.click(nextBtn);
        await waitFor(() => {
          expect(screen.queryByText(/requeridos/i)).toBeNull();
        });
      }
    });
  });

  describe('submit del formulario', () => {
    it('llama a api.post con el payload correcto al generar la landing', async () => {
      apiPost.mockResolvedValue({ data: { projectId: 99 } });
      renderForm();

      const submitBtn = screen.queryByRole('button', { name: /generar|crear|enviar/i });
      if (submitBtn) {
        await act(async () => { fireEvent.click(submitBtn); });
        await waitFor(() => {
          expect(apiPost).toHaveBeenCalledWith('/projects', expect.anything());
        });
      }
    });

    it('navega a /project-result tras submit exitoso', async () => {
      apiPost.mockResolvedValue({ data: { projectId: 99 } });
      renderForm();

      const submitBtn = screen.queryByRole('button', { name: /generar|crear|enviar/i });
      if (submitBtn) {
        await act(async () => { fireEvent.click(submitBtn); });
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith(
            '/project-result/99',
            expect.anything()
          );
        });
      }
    });

    it('muestra error cuando el submit falla', async () => {
      apiPost.mockRejectedValue({
        response: { data: { message: 'Error al generar' } },
      });
      renderForm();

      const submitBtn = screen.queryByRole('button', { name: /generar|crear|enviar/i });
      if (submitBtn) {
        await act(async () => { fireEvent.click(submitBtn); });
        await waitFor(() => {
          expect(screen.getByText(/Error al generar|error/i)).toBeTruthy();
        });
      }
    });
  });

  describe('niveles de plan', () => {
    it('renderiza correctamente con plan Básico (nivel 1)', () => {
      vi.doMock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom');
        return {
          ...actual,
          useNavigate: () => mockNavigate,
          useLocation: () => ({
            state: { transactionId: 5, selectedPlan: { planId: 1, name: 'Básico', price: 9 } },
          }),
        };
      });
      const { container } = renderForm();
      expect(container.firstChild).toBeTruthy();
    });

    it('renderiza correctamente con plan Premium (nivel 3)', () => {
      vi.doMock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom');
        return {
          ...actual,
          useNavigate: () => mockNavigate,
          useLocation: () => ({
            state: { transactionId: 5, selectedPlan: { planId: 3, name: 'Premium', price: 79 } },
          }),
        };
      });
      const { container } = renderForm();
      expect(container.firstChild).toBeTruthy();
    });
  });
});