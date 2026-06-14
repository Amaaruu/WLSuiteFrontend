import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

const mockFormData = {
  typographyStyle: 'geometrica',
  buttonShape: 'redondeado',
  buttonStyle: 'solido',
  iconStyle: 'outline',
  layoutType: 'centrado',
  animationLevel: 'sutil',
  scrollEffect: 'fade-in',
  heroEffect: 'ninguno',
  creativityLevel: 'equilibrada',
};

vi.mock('../../../context/FormContext', () => ({
  useFormContext: () => ({
    formData: mockFormData,
    updateField: vi.fn(),
  }),
}));

import Step4Advanced from './Step4Advanced';

describe('Step4Advanced', () => {
  describe('cuando el plan es menor a 3 (bloqueado)', () => {
    it('muestra el mensaje de plan Premium requerido', () => {
      render(<Step4Advanced planLevel={2} />);
      expect(screen.getAllByText(/Premium/).length).toBeGreaterThan(0);
    });

    it('no muestra las opciones de tipografía', () => {
      render(<Step4Advanced planLevel={2} />);
      expect(screen.queryByText('Geométrica')).toBeNull();
    });
  });

  describe('cuando el plan es 3 o mayor', () => {
    it('muestra las opciones de tipografía', () => {
      render(<Step4Advanced planLevel={3} />);
      expect(screen.getByText('Geométrica')).toBeTruthy();
      expect(screen.getByText('Serif clásica')).toBeTruthy();
      expect(screen.getByText('Monospace')).toBeTruthy();
    });

    it('muestra las formas de botón', () => {
      render(<Step4Advanced planLevel={3} />);
      expect(screen.getByText('Cuadrado')).toBeTruthy();
      expect(screen.getByText('Redondeado')).toBeTruthy();
      expect(screen.getByText('Píldora')).toBeTruthy();
    });

    it('muestra los estilos de botón', () => {
      render(<Step4Advanced planLevel={3} />);
      expect(screen.getByText('Sólido')).toBeTruthy();
      expect(screen.getAllByText('Outline').length).toBeGreaterThan(0);
      expect(screen.getByText('Gradiente')).toBeTruthy();
    });

    it('muestra las opciones de animación', () => {
      render(<Step4Advanced planLevel={3} />);
      expect(screen.getByText('Sin animaciones')).toBeTruthy();
      expect(screen.getByText('Moderada')).toBeTruthy();
      expect(screen.getByText('Expresiva')).toBeTruthy();
    });

    it('muestra los efectos de hero', () => {
      render(<Step4Advanced planLevel={3} />);
      expect(screen.getByText('Partículas')).toBeTruthy();
      expect(screen.getByText('Gradiente vivo')).toBeTruthy();
    });

    it('muestra las opciones de creatividad', () => {
      render(<Step4Advanced planLevel={3} />);
      expect(screen.getByText('Conservadora')).toBeTruthy();
      expect(screen.getByText('Experimental')).toBeTruthy();
    });
  });
});