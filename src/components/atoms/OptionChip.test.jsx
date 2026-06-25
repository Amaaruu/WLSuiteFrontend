import { render, screen, fireEvent } from '@testing-library/react';
import OptionChip from './OptionChip';

describe('OptionChip', () => {
  it('muestra el label', () => {
    render(<OptionChip label="React" />);
    expect(screen.getByText('React')).toBeTruthy();
  });

  it('muestra la descripción si se pasa', () => {
    render(<OptionChip label="React" description="Librería UI" />);
    expect(screen.getByText('Librería UI')).toBeTruthy();
  });

  it('llama onClick cuando no está disabled', () => {
    const handleClick = vi.fn();
    render(<OptionChip label="React" onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('no llama onClick cuando está disabled', () => {
    const handleClick = vi.fn();
    render(<OptionChip label="React" onClick={handleClick} disabled />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('muestra aria-pressed true cuando está seleccionado', () => {
    render(<OptionChip label="React" selected />);
    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('true');
  });
});