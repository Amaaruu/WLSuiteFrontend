import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FormField from './FormField';

describe('Molécula: <FormField />', () => {
  it('Debe renderizar un <Input /> y su <Label /> por defecto', () => {
    render(<FormField id="nombre" label="Nombre de Usuario" placeholder="Ej: Juan" />);
    
    expect(screen.getByText('Nombre de Usuario')).toBeInTheDocument();
    
    const campo = screen.getByPlaceholderText('Ej: Juan');
    expect(campo.tagName).toBe('INPUT');
  });

  it('Debe renderizar un <TextArea /> cuando la prop isTextArea es true', () => {
    render(<FormField id="bio" label="Biografía" placeholder="Habla sobre ti" isTextArea={true} />);
    
    const campo = screen.getByPlaceholderText('Habla sobre ti');
    expect(campo.tagName).toBe('TEXTAREA');
  });

  it('Debe mostrar el texto de error en color rojo si se pasa la prop error', () => {
    const mensajeError = "Este campo es obligatorio";
    render(<FormField id="email" label="Correo" error={mensajeError} />);
    
    const parrafoError = screen.getByText(mensajeError);
    expect(parrafoError).toBeInTheDocument();
    expect(parrafoError).toHaveClass('text-red-500');
  });

  it('Debe asignar la prop "name" y usar el "id" como respaldo si el name no se provee', () => {
    const { rerender } = render(<FormField id="userId" label="ID" placeholder="Solo ID" />);
    expect(screen.getByPlaceholderText('Solo ID')).toHaveAttribute('name', 'userId');

    rerender(<FormField id="userId" name="username_field" label="Usuario" placeholder="Con Name" />);
    expect(screen.getByPlaceholderText('Con Name')).toHaveAttribute('name', 'username_field');
  });

  it('Debe aplicar correctamente los atributos de validación HTML (required y minLength)', () => {
    render(
      <FormField 
        id="password" 
        label="Contraseña" 
        placeholder="Ingresa clave" 
        required={true} 
        minLength={8} 
      />
    );
    
    const campo = screen.getByPlaceholderText('Ingresa clave');
    
    expect(campo).toBeRequired();
    expect(campo).toHaveAttribute('minlength', '8');
  });
});