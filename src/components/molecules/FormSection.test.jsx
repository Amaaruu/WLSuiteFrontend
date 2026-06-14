import { render, screen } from '@testing-library/react';
import FormSection from './FormSection';

describe('FormSection', () => {
  it('muestra el título', () => {
    render(<FormSection title="Datos personales" />);
    expect(screen.getByText('Datos personales')).toBeTruthy();
  });

  it('muestra el badge si se pasa', () => {
    render(<FormSection title="Seguridad" badge="Requerido" />);
    expect(screen.getByText('Requerido')).toBeTruthy();
  });

  it('no muestra badge si no se pasa', () => {
    render(<FormSection title="Seguridad" />);
    expect(screen.queryByText('Requerido')).toBeNull();
  });
});