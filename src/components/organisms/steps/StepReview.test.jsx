import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

const mockFormData = {
  projectName: 'Cafetería El Rincón',
  projectIdea: 'Café de especialidad',
  callToAction: 'Reserva tu mesa',
  businessSector: 'gastronomia',
  landingGoal: 'reservas',
  targetAudience: 'adultos',
  brandPositioning: 'premium',
  brandStage: 'establecida',
  communicationTone: 'cercano',
  formalityLevel: 'semi-formal',
  primaryColor: 'azul-marino',
  secondaryColor: 'dorado',
  baseMode: 'claro',
  contrastLevel: 'estandar',
  visualStyle: 'moderno',
  typographyHierarchy: 'equilibrada',
  sections: { hero: true, features: true, testimonials: false, faq: false, pricing: false, urgency: false },
  heroImageUrl: null,
  logoImageUrl: null,
  typographyStyle: 'geometrica',
  buttonShape: 'redondeado',
  buttonStyle: 'solido',
  animationLevel: 'sutil',
  heroEffect: 'ninguno',
  creativityLevel: 'equilibrada',
};

vi.mock('../../../context/FormContext', () => ({
  useFormContext: () => ({
    formData: mockFormData,
    updateField: vi.fn(),
  }),
}));

import StepReview from './StepReview';

describe('StepReview', () => {
  it('muestra el aviso de revisión', () => {
    render(<StepReview planLevel={1} onEditStep={() => {}} />);
    expect(screen.getByText(/Revisa tu configuración/)).toBeTruthy();
  });

  it('muestra siempre la sección de identidad del negocio', () => {
    render(<StepReview planLevel={1} onEditStep={() => {}} />);
    expect(screen.getByText('Identidad del negocio')).toBeTruthy();
  });

  it('muestra el nombre del proyecto', () => {
    render(<StepReview planLevel={1} onEditStep={() => {}} />);
    expect(screen.getByText('Cafetería El Rincón')).toBeTruthy();
  });

  it('llama onEditStep(1) al hacer clic en Editar del paso 1', () => {
    const handleEdit = vi.fn();
    render(<StepReview planLevel={1} onEditStep={handleEdit} />);
    fireEvent.click(screen.getAllByText(/Editar/)[0]);
    expect(handleEdit).toHaveBeenCalledWith(1);
  });

  it('no muestra la sección de comunicación con plan < 2', () => {
    render(<StepReview planLevel={1} onEditStep={() => {}} />);
    expect(screen.queryByText('Comunicación e identidad visual')).toBeNull();
  });

  it('muestra la sección de comunicación con plan >= 2', () => {
    render(<StepReview planLevel={2} onEditStep={() => {}} />);
    expect(screen.getByText('Comunicación e identidad visual')).toBeTruthy();
  });

  it('muestra la sección visual con plan >= 2', () => {
    render(<StepReview planLevel={2} onEditStep={() => {}} />);
    expect(screen.getByText('Estilo visual y secciones')).toBeTruthy();
  });

  it('no muestra la sección de diseño avanzado con plan < 3', () => {
    render(<StepReview planLevel={2} onEditStep={() => {}} />);
    expect(screen.queryByText('Diseño avanzado')).toBeNull();
  });

  it('muestra la sección de diseño avanzado con plan >= 3', () => {
    render(<StepReview planLevel={3} onEditStep={() => {}} />);
    expect(screen.getByText('Diseño avanzado')).toBeTruthy();
  });

  it('muestra mensaje de gradientes cuando no hay imágenes', () => {
    render(<StepReview planLevel={2} onEditStep={() => {}} />);
    expect(screen.getByText(/gradientes automáticos/)).toBeTruthy();
  });
});