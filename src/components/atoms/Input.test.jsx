import { render, screen } from '@testing-library/react';
import Input from './Input';

describe('Input', () => {
  it('muestra el placeholder', () => {
    render(<Input placeholder="Escribe tu email" />);
    expect(screen.getByPlaceholderText('Escribe tu email')).toBeTruthy();
  });

  it('aplica estilos de error cuando hay error', () => {
    render(<Input error="campo requerido" />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('border-red-500');
  });
});