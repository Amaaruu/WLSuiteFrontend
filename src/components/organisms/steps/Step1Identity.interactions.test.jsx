import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';

const mockUpdateField = vi.fn();

vi.mock('../../../context/FormContext', () => ({
  useFormContext: () => ({
    formData: {
      projectName:       '',
      projectIdea:       '',
      callToAction:      '',
      businessSector:    '',
      landingGoal:       '',
      targetAudience:    '',
      brandPositioning:  '',
      brandStage:        '',
    },
    updateField: mockUpdateField,
  }),
}));

import Step1Identity from './Step1Identity';

describe('Step1Identity — interacciones (coverage de funciones onClick)', () => {

  beforeEach(() => {
    mockUpdateField.mockClear();
  });

  it('actualiza projectName al escribir', () => {
    render(<Step1Identity />);
    const input = screen.getByLabelText(/Nombre del proyecto/i);
    fireEvent.change(input, { target: { value: 'Mi Empresa' } });
    expect(mockUpdateField).toHaveBeenCalledWith('projectName', 'Mi Empresa');
  });

  it('actualiza projectIdea al escribir', () => {
    render(<Step1Identity />);
    const textarea = screen.getByLabelText(/Propuesta de valor/i);
    fireEvent.change(textarea, { target: { value: 'Venta de café artesanal' } });
    expect(mockUpdateField).toHaveBeenCalledWith('projectIdea', 'Venta de café artesanal');
  });

  it('actualiza callToAction al escribir', () => {
    render(<Step1Identity />);
    const input = screen.getByLabelText(/Llamado a la acción/i);
    fireEvent.change(input, { target: { value: 'Reserva ahora' } });
    expect(mockUpdateField).toHaveBeenCalledWith('callToAction', 'Reserva ahora');
  });

  it('actualiza businessSector al hacer click en un chip', () => {
    render(<Step1Identity />);
    const chip = screen.getByText('Gastronomía');
    fireEvent.click(chip);
    expect(mockUpdateField).toHaveBeenCalledWith('businessSector', 'gastronomia');
  });

  it('actualiza landingGoal al hacer click en un chip', () => {
    render(<Step1Identity />);
    const chip = screen.getByText('Vender');
    fireEvent.click(chip);
    expect(mockUpdateField).toHaveBeenCalledWith('landingGoal', 'ventas');
  });

  it('actualiza targetAudience al hacer click en un chip', () => {
    render(<Step1Identity />);
    const chip = screen.getByText('Jóvenes');
    fireEvent.click(chip);
    expect(mockUpdateField).toHaveBeenCalledWith('targetAudience', 'jovenes');
  });

  it('actualiza brandPositioning al hacer click en un chip', () => {
        render(<Step1Identity />);
        const chip = screen.getByText('Económico');
        fireEvent.click(chip);
        expect(mockUpdateField).toHaveBeenCalledWith('brandPositioning', 'economico');
    });

  it('actualiza brandStage al hacer click en un chip', () => {
        render(<Step1Identity />);
        const chip = screen.getByText('Marca nueva');
        fireEvent.click(chip);
        expect(mockUpdateField).toHaveBeenCalledWith('brandStage', 'nueva-marca');
    });
});