import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockOnEditStep = vi.fn();

vi.mock('../../../context/FormContext', () => ({
  useFormContext: () => ({
    formData: {
      projectName:         'Mi Proyecto',
      projectIdea:         'Vender café artesanal',
      callToAction:        'Reserva ahora',
      businessSector:      'gastronomia',
      landingGoal:         'reservas',
      targetAudience:      'adultos',
      brandPositioning:    'premium',
      brandStage:          'establecida',
      valueProposition:    'El mejor café',
      communicationTone:   'profesional',
      formalityLevel:      'formal',
      primaryColor:        'azul-marino',
      secondaryColor:      'blanco',
      baseMode:            'claro',
      contrastLevel:       'estandar',
      visualStyle:         'moderno',
      typographyHierarchy: 'equilibrada',
      visualDensity:       'equilibrado',
      sectionDividers:     'limpia',
      sections: {
        hero: true, features: true, testimonials: true,
        faq: false, pricing: false, urgency: false,
      },
      heroImageUrl:    'https://img.com/hero.jpg',
      logoImageUrl:    'https://img.com/logo.png',
      typographyStyle: 'geometrica',
      buttonShape:     'redondeado',
      buttonStyle:     'solido',
      iconStyle:       'outline',
      layoutType:      'centrado',
      animationLevel:  'sutil',
      scrollEffect:    'fade-in',
      heroEffect:      'ninguno',
      creativityLevel: 'equilibrada',
    },
    updateField: vi.fn(),
  }),
}));

import StepReview from './StepReview';

const getEditButtons = () =>
  screen.getAllByRole('button').filter(btn =>
    btn.textContent?.includes('Editar')
  );

const getCalledWith = () => mockOnEditStep.mock.calls[0]?.[0];

describe('StepReview — interacciones y branches', () => {

  beforeEach(() => mockOnEditStep.mockClear());

  describe('con planLevel=1', () => {
    it('muestra solo la sección de identidad del negocio', () => {
      render(<StepReview planLevel={1} onEditStep={mockOnEditStep} />);
      expect(screen.getByText('Identidad del negocio')).toBeTruthy();
      expect(screen.queryByText('Comunicación e identidad visual')).toBeNull();
    });

    it('muestra el nombre del proyecto', () => {
      render(<StepReview planLevel={1} onEditStep={mockOnEditStep} />);
      expect(screen.getByText('Mi Proyecto')).toBeTruthy();
    });

    it('muestra el aviso informativo de revisión', () => {
      render(<StepReview planLevel={1} onEditStep={mockOnEditStep} />);
      expect(screen.getByText(/Revisa tu configuración/i)).toBeTruthy();
    });

    it('llama onEditStep al hacer clic en el botón Editar', () => {
      render(<StepReview planLevel={1} onEditStep={mockOnEditStep} />);
      const editBtns = getEditButtons();
      expect(editBtns.length).toBeGreaterThan(0);
      fireEvent.click(editBtns[0]);
      expect(mockOnEditStep).toHaveBeenCalled();
      expect(getCalledWith()).toBe(1);
    });

    it('hay exactamente 1 botón Editar en plan 1', () => {
      render(<StepReview planLevel={1} onEditStep={mockOnEditStep} />);
      expect(getEditButtons().length).toBe(1);
    });
  });

  describe('con planLevel=2', () => {
    it('muestra sección de comunicación', () => {
      render(<StepReview planLevel={2} onEditStep={mockOnEditStep} />);
      expect(screen.getByText('Comunicación e identidad visual')).toBeTruthy();
    });

    it('muestra sección de estilo visual', () => {
      render(<StepReview planLevel={2} onEditStep={mockOnEditStep} />);
      expect(screen.getByText('Estilo visual y secciones')).toBeTruthy();
    });

    it('no muestra sección de diseño avanzado con plan 2', () => {
      render(<StepReview planLevel={2} onEditStep={mockOnEditStep} />);
      expect(screen.queryByText('Diseño avanzado')).toBeNull();
    });

    it('hay exactamente 3 botones Editar en plan 2', () => {
      render(<StepReview planLevel={2} onEditStep={mockOnEditStep} />);
      expect(getEditButtons().length).toBe(3);
    });

    it('el primer botón Editar llama a onEditStep con valor 1', () => {
      render(<StepReview planLevel={2} onEditStep={mockOnEditStep} />);
      fireEvent.click(getEditButtons()[0]);
      expect(mockOnEditStep).toHaveBeenCalled();
      expect(getCalledWith()).toBe(1);
    });

    it('el segundo botón Editar llama a onEditStep con valor 2', () => {
      render(<StepReview planLevel={2} onEditStep={mockOnEditStep} />);
      fireEvent.click(getEditButtons()[1]);
      expect(mockOnEditStep).toHaveBeenCalled();
      expect(getCalledWith()).toBe(2);
    });

    it('el tercer botón Editar llama a onEditStep con valor 3', () => {
      render(<StepReview planLevel={2} onEditStep={mockOnEditStep} />);
      fireEvent.click(getEditButtons()[2]);
      expect(mockOnEditStep).toHaveBeenCalled();
      expect(getCalledWith()).toBe(3);
    });

    it('muestra preview de imagen hero cuando heroImageUrl está definida', () => {
      render(<StepReview planLevel={2} onEditStep={mockOnEditStep} />);
      const imgs = document.querySelectorAll('img');
      const heroImg = Array.from(imgs).find(img => img.src.includes('hero.jpg'));
      expect(heroImg).toBeTruthy();
    });

    it('muestra preview de logo cuando logoImageUrl está definida', () => {
      render(<StepReview planLevel={2} onEditStep={mockOnEditStep} />);
      const imgs = document.querySelectorAll('img');
      const logoImg = Array.from(imgs).find(img => img.src.includes('logo.png'));
      expect(logoImg).toBeTruthy();
    });
  });

  describe('con planLevel=3', () => {
    it('muestra sección de diseño avanzado', () => {
      render(<StepReview planLevel={3} onEditStep={mockOnEditStep} />);
      expect(screen.getByText('Diseño avanzado')).toBeTruthy();
    });

    it('muestra todas las secciones: identidad, comunicación, visual y avanzado', () => {
      render(<StepReview planLevel={3} onEditStep={mockOnEditStep} />);
      expect(screen.getByText('Identidad del negocio')).toBeTruthy();
      expect(screen.getByText('Comunicación e identidad visual')).toBeTruthy();
      expect(screen.getByText('Estilo visual y secciones')).toBeTruthy();
      expect(screen.getByText('Diseño avanzado')).toBeTruthy();
    });

    it('hay exactamente 4 botones Editar en plan 3', () => {
      render(<StepReview planLevel={3} onEditStep={mockOnEditStep} />);
      expect(getEditButtons().length).toBe(4);
    });

    it('el primer botón Editar llama a onEditStep con valor 1', () => {
      render(<StepReview planLevel={3} onEditStep={mockOnEditStep} />);
      fireEvent.click(getEditButtons()[0]);
      expect(mockOnEditStep).toHaveBeenCalled();
      expect(getCalledWith()).toBe(1);
    });

    it('el segundo botón Editar llama a onEditStep con valor 2', () => {
      render(<StepReview planLevel={3} onEditStep={mockOnEditStep} />);
      fireEvent.click(getEditButtons()[1]);
      expect(mockOnEditStep).toHaveBeenCalled();
      expect(getCalledWith()).toBe(2);
    });

    it('el tercer botón Editar llama a onEditStep con valor 3', () => {
      render(<StepReview planLevel={3} onEditStep={mockOnEditStep} />);
      fireEvent.click(getEditButtons()[2]);
      expect(mockOnEditStep).toHaveBeenCalled();
      expect(getCalledWith()).toBe(3);
    });

    it('el cuarto botón Editar llama a onEditStep con valor 4', () => {
      render(<StepReview planLevel={3} onEditStep={mockOnEditStep} />);
      fireEvent.click(getEditButtons()[3]);
      expect(mockOnEditStep).toHaveBeenCalled();
      expect(getCalledWith()).toBe(4);
    });
  });

  describe('branch hasImages = false', () => {
    it('verifica que con imágenes el branch hasImages=true se cubre', () => {
      render(<StepReview planLevel={2} onEditStep={mockOnEditStep} />);
      const imgs = document.querySelectorAll('img');
      expect(imgs.length).toBeGreaterThan(0);
    });

    it('el componente renderiza sin crash con planLevel=3 y tiene imágenes', () => {
      render(<StepReview planLevel={3} onEditStep={mockOnEditStep} />);
      const imgs = document.querySelectorAll('img');
      expect(imgs.length).toBeGreaterThan(0);
    });

    it('plan 1 no muestra la sección de imágenes (solo identidad)', () => {
      render(<StepReview planLevel={1} onEditStep={mockOnEditStep} />);
      expect(screen.queryByText('Estilo visual y secciones')).toBeNull();
    });
  });
});