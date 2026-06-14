import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';
import { vi } from 'vitest';

describe('Button', () => {
  it('renderiza el texto correctamente', () => {
    render(<Button>Guardar</Button>);
    expect(screen.getByText('Guardar')).toBeTruthy();
  });

  it('llama onClick al hacer clic', () => {
    const mockClick = vi.fn();
    render(<Button onClick={mockClick}>Guardar</Button>);
    fireEvent.click(screen.getByText('Guardar'));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('aplica variante secondary', () => {
    render(<Button variant="secondary">Cancelar</Button>);
    const btn = screen.getByText('Cancelar');
    expect(btn.className).toContain('bg-sapphire-100');
  });
});