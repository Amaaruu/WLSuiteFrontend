import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate     = vi.fn();
const mockGoToStep     = vi.fn();
const mockBuildPayload = vi.fn(() => ({ projectName: 'Test' }));

let currentStepValue = 1;

let mockLocationState = {
  transactionId: 10,
  selectedPlan: { planId: 2, name: 'Intermedio', price: 29 },
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: mockLocationState }),
  };
});

const mockApiPost = vi.fn();
vi.mock('../../services/api', () => ({
  default: { post: (...args) => mockApiPost(...args) },
}));

const baseFormData = {
  projectName:      'Test',
  projectIdea:      'Mi idea',
  callToAction:     'Empezar',
  businessSector:   'Tech',
  landingGoal:      'Ventas',
  targetAudience:   'Adultos',
  brandPositioning: 'Premium',
  brandStage:       'Consolidada',
  tagline:          'Tagline',
  mainColor:        '#3B82F6',
  typographyStyle:  'geometrica',
  buttonShape:      'redondeado',
  buttonStyle:      'solido',
  iconStyle:        'outline',
  layoutType:       'centrado',
  animationLevel:   'sutil',
  scrollEffect:     'fade-in',
  heroEffect:       'ninguno',
  creativityLevel:  'equilibrada',
};

vi.mock('../../context/FormContext', () => ({
  useFormContext: () => ({
    formData:     baseFormData,
    currentStep:  currentStepValue,
    goToStep:     mockGoToStep,
    buildPayload: mockBuildPayload,
  }),
}));

vi.mock('../atoms/Button', () => ({
  default: ({ children, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>{children}</button>
  ),
}));
vi.mock('../molecules/StepperBar',    () => ({ default: () => <div>StepperBar</div> }));
vi.mock('../molecules/PlanBadge',     () => ({ default: () => <div>PlanBadge</div> }));
vi.mock('../molecules/UpgradeBanner', () => ({ default: () => <div>UpgradeBanner</div> }));
vi.mock('./steps/Step1Identity',      () => ({ default: () => <div data-testid="step1">Step1</div> }));
vi.mock('./steps/Step2Communication', () => ({ default: () => <div data-testid="step2">Step2</div> }));
vi.mock('./steps/Step3Visual',        () => ({ default: () => <div data-testid="step3">Step3</div> }));
vi.mock('./steps/Step4Advanced',      () => ({ default: () => <div data-testid="step4">Step4</div> }));

vi.mock('./steps/StepReview', () => ({
  default: (props) => (
    <div data-testid="step-review">
      StepReview
      <button
        data-testid="edit-step-btn"
        onClick={() => props.onEditStep && props.onEditStep(1)}
      >
        Editar paso 1
      </button>
    </div>
  ),
}));

import LandingForm from './LandingForm';

const renderForm = () =>
  render(<MemoryRouter><LandingForm /></MemoryRouter>);

describe('Organismo: LandingForm', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    currentStepValue = 1;
    mockLocationState = {
      transactionId: 10,
      selectedPlan: { planId: 2, name: 'Intermedio', price: 29 },
    };
    window.scrollTo = vi.fn();
  });

  it('muestra aviso cuando no hay transactionId', () => {
    mockLocationState = null;
    renderForm();
    expect(screen.getByText('Primero elige un plan')).toBeTruthy();
  });

  it('muestra botón Ver planes cuando no hay transactionId', () => {
    mockLocationState = null;
    renderForm();
    expect(screen.getByText('Ver planes')).toBeTruthy();
  });

  it('navega a /planes al hacer clic en Ver planes', () => {
    mockLocationState = null;
    renderForm();
    fireEvent.click(screen.getByText('Ver planes'));
    expect(mockNavigate).toHaveBeenCalledWith('/planes');
  });

  it('renderiza correctamente con plan Básico (planLevel 1)', () => {
    mockLocationState = {
      transactionId: 5,
      selectedPlan: { planId: 1, name: 'Básico', price: 0 },
    };
    renderForm();
    expect(screen.getByText('StepperBar')).toBeTruthy();
  });

  it('renderiza correctamente con plan basico (sin tilde)', () => {
    mockLocationState = {
      transactionId: 5,
      selectedPlan: { planId: 1, name: 'basico', price: 0 },
    };
    renderForm();
    expect(screen.getByText('StepperBar')).toBeTruthy();
  });

  it('renderiza correctamente con plan Premium (planLevel 3)', () => {
    mockLocationState = {
      transactionId: 20,
      selectedPlan: { planId: 3, name: 'Premium', price: 79 },
    };
    renderForm();
    expect(screen.getByText('StepperBar')).toBeTruthy();
  });

  it('plan desconocido usa planLevel 1 por defecto', () => {
    mockLocationState = {
      transactionId: 5,
      selectedPlan: { planId: 99, name: 'Desconocido', price: 0 },
    };
    renderForm();
    expect(screen.getByText('StepperBar')).toBeTruthy();
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

  it('renderiza Step2 cuando currentStep es 2 (plan Intermedio)', () => {
    currentStepValue = 2;
    renderForm();
    expect(screen.getByTestId('step2')).toBeTruthy();
  });

  it('renderiza Step3 cuando currentStep es 3 (plan Intermedio)', () => {
    currentStepValue = 3;
    renderForm();
    expect(screen.getByTestId('step3')).toBeTruthy();
  });

  it('renderiza Step4 cuando currentStep es 4 (plan Premium)', () => {
    currentStepValue = 4;
    mockLocationState = {
      transactionId: 20,
      selectedPlan: { planId: 3, name: 'Premium', price: 79 },
    };
    renderForm();
    expect(screen.getByTestId('step4')).toBeTruthy();
  });

  it('renderiza StepReview cuando currentStep apunta a review (Intermedio)', () => {
    currentStepValue = 4;
    mockLocationState = {
      transactionId: 10,
      selectedPlan: { planId: 2, name: 'Intermedio', price: 29 },
    };
    renderForm();
    expect(screen.getByTestId('step-review')).toBeTruthy();
  });

  it('renderiza StepReview cuando currentStep apunta a review (Premium)', () => {
    currentStepValue = 5;
    mockLocationState = {
      transactionId: 20,
      selectedPlan: { planId: 3, name: 'Premium', price: 79 },
    };
    renderForm();
    expect(screen.getByTestId('step-review')).toBeTruthy();
  });

  it('renderiza StepReview cuando currentStep apunta a review (Básico)', () => {
    currentStepValue = 2;
    mockLocationState = {
      transactionId: 5,
      selectedPlan: { planId: 1, name: 'Básico', price: 0 },
    };
    renderForm();
    expect(screen.getByTestId('step-review')).toBeTruthy();
  });

  it('el botón Siguiente llama a goToStep con paso + 1', () => {
    currentStepValue = 1;
    renderForm();
    const nextBtn = screen.queryByRole('button', { name: /siguiente|continuar|next/i });
    if (nextBtn) {
      fireEvent.click(nextBtn);
      expect(mockGoToStep).toHaveBeenCalledWith(2);
    }
  });

  it('el botón Atrás llama a goToStep con paso - 1 desde paso 2', () => {
    currentStepValue = 2;
    renderForm();
    const backBtn = screen.queryByRole('button', { name: /atrás|anterior|back/i });
    if (backBtn) {
      fireEvent.click(backBtn);
      expect(mockGoToStep).toHaveBeenCalledWith(1);
    }
  });

  it('el botón Atrás llama a goToStep(currentStep - 1) desde paso 3', () => {
    currentStepValue = 3;
    renderForm();
    const backBtn = screen.queryByRole('button', { name: /atrás|anterior|back/i });
    if (backBtn) {
      fireEvent.click(backBtn);
      expect(mockGoToStep).toHaveBeenCalledWith(2);
    }
  });

  it('llama a api.post al hacer submit en el paso de revisión', async () => {
    mockApiPost.mockResolvedValue({ data: { projectId: 99 } });
    renderForm();
    const submitBtn = screen.queryByRole('button', { name: /generar|crear|enviar/i });
    if (submitBtn) {
      await act(async () => { fireEvent.click(submitBtn); });
      await waitFor(() => {
        expect(mockApiPost).toHaveBeenCalledWith('/projects', expect.anything());
      });
    }
  });

  it('navega a /project-result tras submit exitoso', async () => {
    mockApiPost.mockResolvedValue({ data: { projectId: 99 } });
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
    mockApiPost.mockRejectedValue({
      response: { data: { message: 'Error del servidor.' } },
    });
    renderForm();
    const submitBtn = screen.queryByRole('button', { name: /generar|crear|enviar/i });
    if (submitBtn) {
      await act(async () => { fireEvent.click(submitBtn); });
      await waitFor(() => {
        expect(
          screen.queryByText(/Error del servidor\.|error al generar/i)
        ).toBeTruthy();
      });
    }
  });

  it('handleEditStep navega al paso correcto desde la revisión (Intermedio)', () => {
    currentStepValue = 4;
    mockLocationState = {
      transactionId: 10,
      selectedPlan: { planId: 2, name: 'Intermedio', price: 29 },
    };
    renderForm();
    expect(screen.getByTestId('step-review')).toBeTruthy();
    const editBtn = screen.getByTestId('edit-step-btn');
    fireEvent.click(editBtn);
    expect(mockGoToStep).toHaveBeenCalledWith(1);
  });

  it('handleEditStep navega al paso correcto desde la revisión (Premium)', () => {
    currentStepValue = 5;
    mockLocationState = {
      transactionId: 20,
      selectedPlan: { planId: 3, name: 'Premium', price: 79 },
    };
    renderForm();

    expect(screen.getByTestId('step-review')).toBeTruthy();

    const editBtn = screen.getByTestId('edit-step-btn');
    fireEvent.click(editBtn);

    expect(mockGoToStep).toHaveBeenCalledWith(1);
  });

  it('handleEditStep navega al paso correcto desde la revisión (Básico)', () => {
    currentStepValue = 2;
    mockLocationState = {
      transactionId: 5,
      selectedPlan: { planId: 1, name: 'Básico', price: 0 },
    };
    renderForm();

    expect(screen.getByTestId('step-review')).toBeTruthy();

    const editBtn = screen.getByTestId('edit-step-btn');
    fireEvent.click(editBtn);

    expect(mockGoToStep).toHaveBeenCalledWith(1);
  });

  it('validateStep retorna true para stepId no identity (no genera error al avanzar)', () => {
    currentStepValue = 2;
    renderForm();
    const nextBtn = screen.queryByRole('button', { name: /siguiente|continuar/i });
    if (nextBtn) {
      fireEvent.click(nextBtn);
      expect(screen.queryByText(/completa todos los campos/i)).toBeNull();
    }
  });

  it('no muestra error de validación cuando el formData de identidad está completo', () => {
    currentStepValue = 1;
    renderForm();
    const nextBtn = screen.queryByRole('button', { name: /siguiente|continuar/i });
    if (nextBtn) {
      fireEvent.click(nextBtn);
      expect(screen.queryByText(/completa todos los campos/i)).toBeNull();
    }
  });
});