import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import ColorSwatch from './ColorSwatch';

describe('Átomo: <ColorSwatch />', () => {

  it('renderiza con el aria-label correcto', () => {
    render(<ColorSwatch colorKey="azul-marino" />);
    expect(screen.getByLabelText(/Azul marino/)).toBeTruthy();
  });

  it('muestra "(seleccionado)" en el aria-label cuando selected=true', () => {
    render(<ColorSwatch colorKey="azul-marino" selected />);
    expect(screen.getByLabelText(/seleccionado/)).toBeTruthy();
  });

  it('está disabled cuando se pasa disabled=true', () => {
    render(<ColorSwatch colorKey="negro" disabled />);
    expect(screen.getByRole('button').disabled).toBe(true);
  });

  it('no está disabled por defecto', () => {
    render(<ColorSwatch colorKey="negro" />);
    expect(screen.getByRole('button').disabled).toBe(false);
  });

  it('llama onClick cuando no está disabled', () => {
    const handleClick = vi.fn();
    render(<ColorSwatch colorKey="azul-marino" onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('no llama onClick cuando está disabled', () => {
    const handleClick = vi.fn();
    render(<ColorSwatch colorKey="azul-marino" onClick={handleClick} disabled />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('usa color fallback #cccccc cuando colorKey es desconocido', () => {
    render(<ColorSwatch colorKey="color-inexistente" />);
    const btn = screen.getByRole('button');
    expect(btn.style.backgroundColor).toBe('rgb(204, 204, 204)');
  });

  it('usa el colorKey como label cuando no hay label definido', () => {
    render(<ColorSwatch colorKey="color-inexistente" />);
    expect(screen.getByLabelText(/color-inexistente/i)).toBeTruthy();
  });

  it('renderiza correctamente el color blanco (isLight=true)', () => {
    render(<ColorSwatch colorKey="blanco" selected />);
    const btn = screen.getByRole('button');
    expect(btn).toBeTruthy();
  });

  it('renderiza correctamente el color crema (isLight=true)', () => {
    render(<ColorSwatch colorKey="crema" selected />);
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('el checkmark aparece cuando selected=true', () => {
    render(<ColorSwatch colorKey="azul-marino" selected />);
    const svg = document.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('no aparece checkmark cuando selected=false', () => {
    render(<ColorSwatch colorKey="azul-marino" selected={false} />);
    const svg = document.querySelector('svg');
    expect(svg).toBeNull();
  });

  const coloresConocidos = [
    'azul-marino', 'azul-cielo', 'verde-bosque', 'verde-menta',
    'terracota', 'rojo-vibrante', 'morado', 'rosa',
    'negro', 'gris-oscuro', 'gris-neutro', 'blanco',
    'crema', 'amarillo-dorado', 'naranja', 'cian',
  ];

  coloresConocidos.forEach(colorKey => {
    it(`renderiza el color "${colorKey}" sin errores`, () => {
      const { container } = render(<ColorSwatch colorKey={colorKey} />);
      expect(container.firstChild).toBeTruthy();
    });
  });
});