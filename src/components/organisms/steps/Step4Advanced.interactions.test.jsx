import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockUpdateField = vi.fn();

vi.mock('../../../context/FormContext', () => ({
  useFormContext: () => ({
    formData: {
      typographyStyle: '',
      buttonShape:     '',
      buttonStyle:     '',
      iconStyle:       '',
      layoutType:      '',
      animationLevel:  '',
      scrollEffect:    '',
      heroEffect:      '',
      creativityLevel: '',
    },
    updateField: mockUpdateField,
  }),
}));

import Step4Advanced from './Step4Advanced';

describe('Step4Advanced — interacciones onClick', () => {

  beforeEach(() => mockUpdateField.mockClear());

  it('actualiza typographyStyle al hacer click', () => {
    render(<Step4Advanced planLevel={3} />);
    fireEvent.click(screen.getByText('Geométrica'));
    expect(mockUpdateField).toHaveBeenCalledWith('typographyStyle', 'geometrica');
  });

  it('actualiza buttonShape al hacer click', () => {
    render(<Step4Advanced planLevel={3} />);
    fireEvent.click(screen.getByText('Cuadrado'));
    expect(mockUpdateField).toHaveBeenCalledWith('buttonShape', 'cuadrado');
  });

  it('actualiza buttonStyle al hacer click', () => {
    render(<Step4Advanced planLevel={3} />);
    fireEvent.click(screen.getByText('Sólido'));
    expect(mockUpdateField).toHaveBeenCalledWith('buttonStyle', 'solido');
  });

  it('actualiza animationLevel al hacer click', () => {
    render(<Step4Advanced planLevel={3} />);
    fireEvent.click(screen.getByText('Sin animaciones'));
    expect(mockUpdateField).toHaveBeenCalledWith('animationLevel', 'ninguna');
  });

  it('actualiza heroEffect al hacer click', () => {
    render(<Step4Advanced planLevel={3} />);
    fireEvent.click(screen.getByText('Partículas'));
    expect(mockUpdateField).toHaveBeenCalledWith('heroEffect', 'particulas');
  });

  it('actualiza creativityLevel al hacer click', () => {
    render(<Step4Advanced planLevel={3} />);
    fireEvent.click(screen.getByText('Conservadora'));
    expect(mockUpdateField).toHaveBeenCalledWith('creativityLevel', 'conservadora');
  });

  it('no llama updateField cuando planLevel < 3 (bloqueado)', () => {
    render(<Step4Advanced planLevel={2} />);
    expect(screen.queryByText('Geométrica')).toBeNull();
    expect(mockUpdateField).not.toHaveBeenCalled();
  });
});