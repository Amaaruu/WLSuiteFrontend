import { render, screen } from '@testing-library/react';
import StepperBar from './StepperBar';

const steps = [
  { id: 'identity', label: 'Tu negocio' },
  { id: 'communication', label: 'Comunicación' },
  { id: 'review', label: 'Revisión' },
];

describe('StepperBar', () => {
  it('renderiza todos los labels de pasos', () => {
    render(<StepperBar steps={steps} currentStep={1} />);
    expect(screen.getByText('Tu negocio')).toBeTruthy();
    expect(screen.getByText('Comunicación')).toBeTruthy();
    expect(screen.getByText('Revisión')).toBeTruthy();
  });

  it('tiene role de navegación', () => {
    render(<StepperBar steps={steps} currentStep={1} />);
    expect(screen.getByRole('navigation')).toBeTruthy();
  });
});