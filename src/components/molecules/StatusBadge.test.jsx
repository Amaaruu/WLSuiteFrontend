import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';

describe('StatusBadge', () => {
  it('muestra "Listo" para status ready', () => {
    render(<StatusBadge status="ready" />);
    expect(screen.getByText('Listo')).toBeTruthy();
  });

  it('muestra "Procesando" por defecto', () => {
    render(<StatusBadge />);
    expect(screen.getByText('Procesando')).toBeTruthy();
  });

  it('muestra "Error en generación" para status failed', () => {
    render(<StatusBadge status="failed" />);
    expect(screen.getByText('Error en generación')).toBeTruthy();
  });
});