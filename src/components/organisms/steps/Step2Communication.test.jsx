import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

const mockFormData = {
  communicationTone: 'cercano',
  formalityLevel: 'semi-formal',
  primaryColor: 'azul-marino',
  secondaryColor: 'dorado',
  baseMode: 'claro',
  contrastLevel: 'estandar',
};

vi.mock('../../../context/FormContext', () => ({
  useFormContext: () => ({
    formData: mockFormData,
    updateField: vi.fn(),
  }),
}));

import Step2Communication from './Step2Communication';

describe('Step2Communication', () => {
  describe('cuando el plan es menor a 2 (bloqueado)', () => {
    it('muestra el mensaje de campo bloqueado', () => {
      render(<Step2Communication planLevel={1} />);
      expect(screen.getAllByText(/Intermedio/).length).toBeGreaterThan(0);
    });

    it('no muestra las opciones de tono', () => {
      render(<Step2Communication planLevel={1} />);
      expect(screen.queryByText('Profesional')).toBeNull();
    });
  });

  describe('cuando el plan es 2 o mayor', () => {
    it('muestra las opciones de tono de comunicación', () => {
      render(<Step2Communication planLevel={2} />);
      expect(screen.getByText('Profesional')).toBeTruthy();
      expect(screen.getByText('Cercano')).toBeTruthy();
      expect(screen.getByText('Elegante')).toBeTruthy();
    });

    it('muestra las opciones de formalidad', () => {
      render(<Step2Communication planLevel={2} />);
      expect(screen.getByText('Formal')).toBeTruthy();
      expect(screen.getByText('Semi-formal')).toBeTruthy();
      expect(screen.getByText('Informal')).toBeTruthy();
    });

    it('muestra las opciones de modo base', () => {
      render(<Step2Communication planLevel={2} />);
      expect(screen.getByText('Modo claro')).toBeTruthy();
      expect(screen.getByText('Modo oscuro')).toBeTruthy();
      expect(screen.getByText('Mixto')).toBeTruthy();
    });

    it('muestra las opciones de contraste', () => {
      render(<Step2Communication planLevel={2} />);
      expect(screen.getByText('Suave')).toBeTruthy();
      expect(screen.getByText('Estándar')).toBeTruthy();
      expect(screen.getByText('Alto')).toBeTruthy();
    });
  });
});