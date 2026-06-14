import { render, screen } from '@testing-library/react';
import StepDot from './StepDot';

describe('StepDot', () => {
  it('muestra el número de paso cuando está pendiente', () => {
    render(<StepDot stepNumber={2} label="Comunicación" status="pending" />);
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('muestra el label', () => {
    render(<StepDot stepNumber={1} label="Tu negocio" status="active" />);
    expect(screen.getByText('Tu negocio')).toBeTruthy();
  });

  it('no muestra número cuando está completado (muestra SVG check)', () => {
    render(<StepDot stepNumber={1} label="Tu negocio" status="completed" />);
    expect(screen.queryByText('1')).toBeNull();
  });
});