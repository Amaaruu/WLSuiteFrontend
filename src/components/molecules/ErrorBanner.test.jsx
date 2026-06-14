import { render, screen } from '@testing-library/react';
import ErrorBanner from './ErrorBanner';

describe('ErrorBanner', () => {
  it('muestra el mensaje de error', () => {
    render(<ErrorBanner message="Ocurrió un error inesperado" />);
    expect(screen.getByText('Ocurrió un error inesperado')).toBeTruthy();
  });

  it('tiene la clase de color rojo', () => {
    const { container } = render(<ErrorBanner message="Error" />);
    expect(container.firstChild.className).toContain('bg-red-50');
  });
});