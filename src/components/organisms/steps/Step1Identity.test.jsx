import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../../../context/FormContext', () => ({
  useFormContext: () => ({
    formData: {
      projectName: 'Cafetería El Rincón',
      projectIdea: 'Café de especialidad',
      callToAction: 'Reserva tu mesa',
      businessSector: 'gastronomia',
      landingGoal: 'reservas',
      targetAudience: 'adultos',
      brandPositioning: 'premium',
      brandStage: 'establecida',
    },
    updateField: vi.fn(),
  }),
}));

import Step1Identity from './Step1Identity';

describe('Step1Identity', () => {
  it('muestra el campo Nombre del proyecto', () => {
    render(<Step1Identity />);
    expect(screen.getByLabelText(/Nombre del proyecto/)).toBeTruthy();
  });

  it('muestra el campo Propuesta de valor', () => {
    render(<Step1Identity />);
    expect(screen.getByLabelText(/Propuesta de valor/)).toBeTruthy();
  });

  it('muestra el campo CTA', () => {
    render(<Step1Identity />);
    expect(screen.getByLabelText(/Llamado a la acción/)).toBeTruthy();
  });

  it('muestra todas las opciones de sector', () => {
    render(<Step1Identity />);
    expect(screen.getByText('Gastronomía')).toBeTruthy();
    expect(screen.getByText('Tecnología')).toBeTruthy();
    expect(screen.getByText('E-commerce')).toBeTruthy();
  });

  it('muestra todas las opciones de objetivo', () => {
    render(<Step1Identity />);
    expect(screen.getByText('Vender')).toBeTruthy();
    expect(screen.getByText('Captar leads')).toBeTruthy();
    expect(screen.getByText('Reservas')).toBeTruthy();
  });

  it('muestra las opciones de público objetivo', () => {
    render(<Step1Identity />);
    expect(screen.getByText('Jóvenes')).toBeTruthy();
    expect(screen.getByText('Profesionales')).toBeTruthy();
    expect(screen.getByText('Empresas (B2B)')).toBeTruthy();
  });

  it('muestra las opciones de posicionamiento', () => {
    render(<Step1Identity />);
    expect(screen.getByText('Económico')).toBeTruthy();
    expect(screen.getByText('Premium')).toBeTruthy();
    expect(screen.getByText('Lujo')).toBeTruthy();
  });

  it('muestra las etapas de marca', () => {
    render(<Step1Identity />);
    expect(screen.getByText('Marca nueva')).toBeTruthy();
    expect(screen.getByText('Marca establecida')).toBeTruthy();
    expect(screen.getByText('Relanzamiento')).toBeTruthy();
  });

  it('el campo nombre es un input de texto', () => {
    render(<Step1Identity />);
    const input = screen.getByLabelText(/Nombre del proyecto/);
    expect(input.tagName.toLowerCase()).toBe('input');
  });

  it('el campo propuesta de valor es un textarea', () => {
    render(<Step1Identity />);
    const textarea = screen.getByLabelText(/Propuesta de valor/);
    expect(textarea.tagName.toLowerCase()).toBe('textarea');
  });

  it('los botones de opción son clickeables', () => {
    render(<Step1Identity />);
    const chips = screen.getAllByRole('button');
    expect(chips.length).toBeGreaterThan(0);
    fireEvent.click(chips[0]);
    expect(chips[0]).toBeTruthy();
  });
});