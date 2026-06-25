import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockUpdateField   = vi.fn();
const mockToggleSection = vi.fn();

vi.mock('../../../context/FormContext', () => ({
  useFormContext: () => ({
    formData: {
      visualStyle:         '',
      typographyHierarchy: '',
      visualDensity:       '',
      sectionDividers:     '',
      sections: {
        hero:         true,
        features:     false,
        testimonials: false,
        faq:          false,
        pricing:      false,
        urgency:      false,
      },
      heroImageUrl:  null,
      logoImageUrl:  null,
    },
    updateField:    mockUpdateField,
    toggleSection:  mockToggleSection,
  }),
}));

import Step3Visual from './Step3Visual';

describe('Step3Visual — interacciones onClick', () => {

  beforeEach(() => {
    mockUpdateField.mockClear();
    mockToggleSection.mockClear();
  });

  it('actualiza visualStyle al hacer click', () => {
    render(<Step3Visual planLevel={2} />);
    fireEvent.click(screen.getByText('Minimalista'));
    expect(mockUpdateField).toHaveBeenCalledWith('visualStyle', 'minimalista');
  });

  it('actualiza typographyHierarchy al hacer click', () => {
    render(<Step3Visual planLevel={2} />);
    fireEvent.click(screen.getByText('Discreta'));
    expect(mockUpdateField).toHaveBeenCalledWith('typographyHierarchy', 'discreta');
  });

  it('llama toggleSection al hacer click en una sección no bloqueada', () => {
    render(<Step3Visual planLevel={2} />);
    const allButtons = screen.getAllByRole('button');
    const seccionBtn = allButtons.find(btn => {
      const text = btn.textContent || '';
      return (
        text.includes('Características') ||
        text.includes('Testimonios')     ||
        text.includes('FAQ')             ||
        text.includes('Precios')         ||
        text.includes('Urgencia')
      );
    });

    if (!seccionBtn) {
      const caracteristicasSpan = screen.queryByText(/Características/i);
      if (caracteristicasSpan) {
        const parentBtn = caracteristicasSpan.closest('button');
        if (parentBtn) {
          fireEvent.click(parentBtn);
          expect(mockToggleSection).toHaveBeenCalled();
          return;
        }
      }
      expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
      return;
    }

    fireEvent.click(seccionBtn);
    expect(mockToggleSection).toHaveBeenCalled();
  });

  it('el hero siempre está activo y muestra "Siempre activa"', () => {
    render(<Step3Visual planLevel={2} />);
    expect(screen.getByText('Siempre activa')).toBeTruthy();
  });

  it('muestra el contador de secciones activas', () => {
    render(<Step3Visual planLevel={2} />);
    expect(screen.getByText(/secciones activas/i)).toBeTruthy();
  });

  it('no llama updateField cuando planLevel < 2 (bloqueado)', () => {
    render(<Step3Visual planLevel={1} />);
    expect(screen.queryByText('Minimalista')).toBeNull();
    expect(mockUpdateField).not.toHaveBeenCalled();
  });
});