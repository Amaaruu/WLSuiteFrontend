import { render, screen } from '@testing-library/react';
import LockedField from './LockedField';

describe('LockedField', () => {
  it('muestra el label', () => {
    render(<LockedField label="Paleta de colores" requiredPlan="Intermedio" />);
    expect(screen.getByText('Paleta de colores')).toBeTruthy();
  });

  it('muestra el plan requerido', () => {
    render(<LockedField label="Paleta de colores" requiredPlan="Intermedio" />);
    expect(screen.getAllByText(/Intermedio/).length).toBeGreaterThan(0);
  });
});