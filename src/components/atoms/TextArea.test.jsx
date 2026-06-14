import { render, screen } from '@testing-library/react';
import TextArea from './TextArea';

describe('TextArea', () => {
  it('muestra el placeholder', () => {
    render(<TextArea placeholder="Escribe algo..." />);
    expect(screen.getByPlaceholderText('Escribe algo...')).toBeTruthy();
  });

  it('aplica rows por defecto (4)', () => {
    render(<TextArea />);
    expect(screen.getByRole('textbox').getAttribute('rows')).toBe('4');
  });

  it('aplica estilos de error', () => {
    render(<TextArea error="campo requerido" />);
    expect(screen.getByRole('textbox').className).toContain('border-red-500');
  });
});