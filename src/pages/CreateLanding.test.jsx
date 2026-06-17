import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation:  () => ({
      state: {
        transactionId: 77,
        selectedPlan: { planId: 2, name: 'Intermedio', price: 29 },
      },
    }),
  };
});

vi.mock('../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../components/organisms/LandingForm', () => ({
  default: () => <div data-testid="landing-form">LandingForm</div>,
}));
vi.mock('../context/FormContext', () => ({
  FormProvider:    ({ children }) => <div>{children}</div>,
  useFormContext:  () => ({ formData: {}, updateField: vi.fn(), currentStep: 1, goToStep: vi.fn() }),
}));

import CreateLanding from './CreateLanding';

const renderPage = (user = { name: 'Juan', role: 'user' }) =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user, logout: vi.fn() }}>
        <CreateLanding />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Página: CreateLanding', () => {

  it('renderiza sin errores', () => {
    const { container } = renderPage();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el LandingForm', () => {
    renderPage();
    expect(screen.getByTestId('landing-form')).toBeTruthy();
  });

  it('renderiza la estructura principal de la página', () => {
    const { container } = renderPage();
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});