import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockUpdateField = vi.fn();

vi.mock('../../../context/FormContext', () => ({
  useFormContext: () => ({
    formData: {
      communicationTone: '',
      formalityLevel:    '',
      primaryColor:      '',
      secondaryColor:    '',
      baseMode:          '',
      contrastLevel:     '',
    },
    updateField: mockUpdateField,
  }),
}));

vi.mock('../../../components/atoms/ColorSwatch', async () => {
  const actual = await vi.importActual('../../../components/atoms/ColorSwatch');
  return {
    ...actual,
    default: ({ colorKey, onClick, selected }) => (
      <button
        data-testid={`color-swatch-${colorKey}`}
        onClick={onClick}
        aria-pressed={selected}
        type="button"
      >
        {colorKey}
      </button>
    ),
  };
});

import Step2Communication from './Step2Communication';

describe('Step2Communication — interacciones onClick', () => {

  beforeEach(() => mockUpdateField.mockClear());

  it('actualiza communicationTone al hacer click', () => {
    render(<Step2Communication planLevel={2} />);
    fireEvent.click(screen.getByText('Profesional'));
    expect(mockUpdateField).toHaveBeenCalledWith('communicationTone', 'profesional');
  });

  it('actualiza formalityLevel al hacer click', () => {
    render(<Step2Communication planLevel={2} />);
    fireEvent.click(screen.getByText('Formal'));
    expect(mockUpdateField).toHaveBeenCalledWith('formalityLevel', 'formal');
  });

  it('actualiza baseMode al hacer click en Modo claro', () => {
    render(<Step2Communication planLevel={2} />);
    fireEvent.click(screen.getByText('Modo claro'));
    expect(mockUpdateField).toHaveBeenCalledWith('baseMode', 'claro');
  });

  it('actualiza baseMode al hacer click en Modo oscuro', () => {
    render(<Step2Communication planLevel={2} />);
    fireEvent.click(screen.getByText('Modo oscuro'));
    expect(mockUpdateField).toHaveBeenCalledWith('baseMode', 'oscuro');
  });

  it('actualiza contrastLevel al hacer click', () => {
    render(<Step2Communication planLevel={2} />);
    fireEvent.click(screen.getByText('Suave'));
    expect(mockUpdateField).toHaveBeenCalledWith('contrastLevel', 'suave');
  });

  it('actualiza primaryColor al hacer click en el ColorSwatch de azul-marino', () => {
    render(<Step2Communication planLevel={2} />);
    const swatches = screen.getAllByTestId('color-swatch-azul-marino');
    fireEvent.click(swatches[0]);
    expect(mockUpdateField).toHaveBeenCalledWith('primaryColor', 'azul-marino');
  });

  it('actualiza secondaryColor al hacer click en el segundo ColorSwatch de azul-marino', () => {
    render(<Step2Communication planLevel={2} />);
    const swatches = screen.getAllByTestId('color-swatch-azul-marino');
    if (swatches.length > 1) {
      fireEvent.click(swatches[1]);
      expect(mockUpdateField).toHaveBeenCalledWith('secondaryColor', 'azul-marino');
    } else {
      const verdeBosqueSwatches = screen.getAllByTestId('color-swatch-verde-bosque');
      fireEvent.click(verdeBosqueSwatches[1]);
      expect(mockUpdateField).toHaveBeenCalledWith('secondaryColor', 'verde-bosque');
    }
  });

  it('renderiza todos los swatches de color para primario y secundario', () => {
    render(<Step2Communication planLevel={2} />);
    const azulSwatches = screen.getAllByTestId('color-swatch-azul-marino');
    expect(azulSwatches.length).toBe(2);
  });

  it('no llama updateField cuando planLevel < 2 (bloqueado)', () => {
    render(<Step2Communication planLevel={1} />);
    expect(screen.queryByText('Profesional')).toBeNull();
    expect(mockUpdateField).not.toHaveBeenCalled();
  });
});