// src/components/molecules/SelectField.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SelectField from './SelectField';

describe('Molécula: <SelectField />', () => {
  it('Debe renderizar la etiqueta y el selector correctamente', () => {
    render(
      <SelectField id="pais" name="country" label="País de origen">
        <option value="cl">Chile</option>
        <option value="ar">Argentina</option>
      </SelectField>
    );

    // Verificamos que el Label se imprime
    expect(screen.getByText('País de origen')).toBeInTheDocument();

    // Verificamos la accesibilidad: El select debe estar vinculado al label
    const selector = screen.getByLabelText('País de origen');
    expect(selector).toBeInTheDocument();
    
    // Verificamos que se le inyectó la prop "name"
    expect(selector).toHaveAttribute('name', 'country');
  });

  it('Debe renderizar las opciones (children) proporcionadas', () => {
    render(
      <SelectField id="rol" label="Rol de usuario">
        <option value="admin">Administrador</option>
        <option value="user">Usuario normal</option>
      </SelectField>
    );

    // Validamos que las opciones existan en el DOM
    expect(screen.getByText('Administrador')).toBeInTheDocument();
    expect(screen.getByText('Usuario normal')).toBeInTheDocument();
  });

  it('Debe disparar la función onChange al seleccionar una nueva opción', () => {
    const mockOnChange = vi.fn();
    render(
      <SelectField id="tema" label="Tema" onChange={mockOnChange}>
        <option value="claro">Modo Claro</option>
        <option value="oscuro">Modo Oscuro</option>
      </SelectField>
    );

    const selector = screen.getByLabelText('Tema');
    
    // Simulamos que el usuario elige "Modo Oscuro"
    fireEvent.change(selector, { target: { value: 'oscuro' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('Debe mostrar el mensaje de error en rojo si la prop error tiene contenido', () => {
    const mensajeError = "Debes seleccionar un país válido";
    
    render(
      <SelectField id="pais" label="País" error={mensajeError}>
        <option value="">Seleccione...</option>
      </SelectField>
    );

    const errorP = screen.getByText(mensajeError);
    expect(errorP).toBeInTheDocument();
    
    // Validamos que tenga la clase de texto rojo de Tailwind
    expect(errorP).toHaveClass('text-red-500');
  });
});