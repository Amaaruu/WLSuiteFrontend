import { render, screen } from '@testing-library/react';
import ColorSwatch from './ColorSwatch';

describe('ColorSwatch', () => {
  it('renderiza con el aria-label correcto', () => {
    render(<ColorSwatch colorKey="azul-marino" />);
    expect(screen.getByLabelText(/Azul marino/)).toBeTruthy();
  });

  it('muestra seleccionado en aria-label', () => {
    render(<ColorSwatch colorKey="azul-marino" selected />);
    expect(screen.getByLabelText(/seleccionado/)).toBeTruthy();
  });

  it('está disabled cuando se pasa disabled', () => {
    render(<ColorSwatch colorKey="negro" disabled />);
    expect(screen.getByRole('button').disabled).toBe(true);
  });
});