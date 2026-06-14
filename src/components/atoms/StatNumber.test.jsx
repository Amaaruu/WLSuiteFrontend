import { render, screen } from '@testing-library/react';
import StatNumber from './StatNumber';

describe('StatNumber', () => {
  it('muestra el valor', () => {
    render(<StatNumber value={42} label="Proyectos" />);
    expect(screen.getByText('42')).toBeTruthy();
  });

  it('muestra el label', () => {
    render(<StatNumber value={42} label="Proyectos" />);
    expect(screen.getByText('Proyectos')).toBeTruthy();
  });

  it('muestra guión cuando no hay valor', () => {
    render(<StatNumber label="Proyectos" />);
    expect(screen.getByText('—')).toBeTruthy();
  });

  it('muestra sublabel si se pasa', () => {
    render(<StatNumber value={5} label="Usuarios" sublabel="Este mes" />);
    expect(screen.getByText('Este mes')).toBeTruthy();
  });
});