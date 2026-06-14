import { render, screen, fireEvent } from '@testing-library/react';
import SectionToggle from './SectionToggle';

describe('SectionToggle', () => {
  it('muestra el label', () => {
    render(<SectionToggle label="Hero" active={false} />);
    expect(screen.getByText('Hero')).toBeTruthy();
  });

  it('muestra descripción si se pasa', () => {
    render(<SectionToggle label="Hero" description="Sección principal" active={false} />);
    expect(screen.getByText('Sección principal')).toBeTruthy();
  });

  it('llama onToggle al hacer clic', () => {
    const handleToggle = vi.fn();
    render(<SectionToggle label="Hero" active={false} onToggle={handleToggle} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('está deshabilitado cuando locked es true', () => {
    render(<SectionToggle label="Hero" active={true} locked />);
    expect(screen.getByRole('switch').disabled).toBe(true);
  });

  it('muestra texto "Siempre activa" cuando locked', () => {
    render(<SectionToggle label="Hero" active={true} locked />);
    expect(screen.getByText('Siempre activa')).toBeTruthy();
  });
});