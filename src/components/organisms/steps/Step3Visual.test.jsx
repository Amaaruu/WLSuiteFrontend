import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

const mockFormData = {
  visualStyle: 'moderno',
  typographyHierarchy: 'equilibrada',
  visualDensity: 'equilibrado',
  sectionDividers: 'limpia',
  sections: { hero: true, features: true, testimonials: false, faq: false, pricing: false, urgency: false },
  heroImageUrl: null,
  logoImageUrl: null,
};

vi.mock('../../../context/FormContext', () => ({
  useFormContext: () => ({
    formData: mockFormData,
    updateField: vi.fn(),
    toggleSection: vi.fn(),
  }),
}));

import Step3Visual from './Step3Visual';

describe('Step3Visual', () => {
  describe('cuando el plan es menor a 2 (bloqueado)', () => {
    it('muestra el mensaje de campo bloqueado', () => {
      render(<Step3Visual planLevel={1} />);
      expect(screen.getAllByText(/Intermedio/).length).toBeGreaterThan(0);
    });

    it('no muestra las opciones de estilo visual', () => {
      render(<Step3Visual planLevel={1} />);
      expect(screen.queryByText('Minimalista')).toBeNull();
    });
  });

  describe('cuando el plan es 2 o mayor', () => {
    it('muestra los estilos visuales', () => {
      render(<Step3Visual planLevel={2} />);
      expect(screen.getByText('Minimalista')).toBeTruthy();
      expect(screen.getByText('Moderno')).toBeTruthy();
      expect(screen.getByText('Futurista')).toBeTruthy();
    });

    it('muestra las opciones de jerarquía tipográfica', () => {
      render(<Step3Visual planLevel={2} />);
      expect(screen.getByText('Discreta')).toBeTruthy();
      expect(screen.getByText('Equilibrada')).toBeTruthy();
      expect(screen.getByText('Dominante')).toBeTruthy();
    });

    it('muestra las secciones configurables', () => {
      render(<Step3Visual planLevel={2} />);
      expect(screen.getByText('Hero principal')).toBeTruthy();
      expect(screen.getByText('Características y beneficios')).toBeTruthy();
      expect(screen.getByText('Testimonios')).toBeTruthy();
    });

    it('muestra que Hero siempre está activo (locked)', () => {
      render(<Step3Visual planLevel={2} />);
      expect(screen.getByText('Siempre activa')).toBeTruthy();
    });

    it('muestra el contador de secciones activas', () => {
      render(<Step3Visual planLevel={2} />);
      expect(screen.getByText(/secciones activas/)).toBeTruthy();
    });

    it('muestra el uploader de imagen Hero', () => {
      render(<Step3Visual planLevel={2} />);
      expect(screen.getByText('Imagen principal del Hero')).toBeTruthy();
    });

    it('muestra el uploader de logo', () => {
      render(<Step3Visual planLevel={2} />);
      expect(screen.getByText('Logo del negocio')).toBeTruthy();
    });
  });
});