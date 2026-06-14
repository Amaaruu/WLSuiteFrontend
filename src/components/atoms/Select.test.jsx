import { render, screen, fireEvent } from '@testing-library/react';
import Select from './Select';

describe('Select', () => {
  it('renderiza las opciones', () => {
    render(
      <Select>
        <option value="a">Opción A</option>
        <option value="b">Opción B</option>
      </Select>
    );
    expect(screen.getByText('Opción A')).toBeTruthy();
    expect(screen.getByText('Opción B')).toBeTruthy();
  });

  it('llama onChange al seleccionar', () => {
    const handleChange = vi.fn();
    render(
      <Select onChange={handleChange} value="a">
        <option value="a">A</option>
        <option value="b">B</option>
      </Select>
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'b' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('aplica estilos de error', () => {
    render(<Select error="requerido"><option value="">-</option></Select>);
    expect(screen.getByRole('combobox').className).toContain('border-red-500');
  });
});