import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import RegisterForm from './RegisterForm';

// 1. Mock de react-router-dom para espiar la navegación después del registro
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// 2. EL SECRETO REVELADO: Mockeamos el servicio API que usa tu componente
const mockApiPost = vi.fn();
vi.mock('../../services/api', () => ({
  default: { post: (...args) => mockApiPost(...args) }
}));

describe('Organismo: <RegisterForm />', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderForm = () => {
    return render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );
  };

  it('muestra el título de registro', () => {
    renderForm();
    expect(screen.getByText('Crea tu cuenta')).toBeTruthy();
  });

  it('muestra el campo nombre', () => {
    renderForm();
    expect(screen.getByText('Nombre')).toBeTruthy();
  });

  it('muestra el campo apellido', () => {
    renderForm();
    expect(screen.getByText('Apellido')).toBeTruthy();
  });

  it('muestra el campo email', () => {
    renderForm();
    expect(screen.getByText('Correo Electrónico')).toBeTruthy();
  });

  it('muestra error si el nombre es muy corto', async () => {
    renderForm();
    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'J', name: 'name' } });
    fireEvent.submit(screen.getByText('Crear cuenta').closest('form'));
    
    expect(await screen.findByText('El nombre debe tener al menos 2 caracteres.')).toBeTruthy();
  });

  it('muestra error si las contraseñas no coinciden', async () => {
    renderForm();
    fireEvent.change(screen.getByPlaceholderText('Mínimo 8 caracteres'), { target: { value: 'pass1234', name: 'password' } });
    fireEvent.change(screen.getByPlaceholderText('Repite tu contraseña'), { target: { value: 'pass12345', name: 'confirmPassword' } });
    fireEvent.submit(screen.getByText('Crear cuenta').closest('form'));
    
    expect(await screen.findByText('Las contraseñas no coinciden.')).toBeTruthy();
  });

  it('muestra error de email inválido', async () => {
    renderForm();
    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[2], { target: { value: 'correo-malo', name: 'email' } });
    fireEvent.submit(screen.getByText('Crear cuenta').closest('form'));
    
    expect(await screen.findByText('Ingresa un correo electrónico válido.')).toBeTruthy();
  });

  it('muestra link para ir al login', () => {
    renderForm();
    expect(screen.getByText('Inicia sesión aquí')).toBeTruthy();
  });

  it('muestra éxito al registrar correctamente', async () => {
    // Configuramos el mock de la API para que responda con éxito
    mockApiPost.mockResolvedValueOnce({ data: { success: true } });

    renderForm();

    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'Juan', name: 'name' } });
    fireEvent.change(textboxes[1], { target: { value: 'Pérez', name: 'lastname' } });
    fireEvent.change(textboxes[2], { target: { value: 'juan@test.com', name: 'email' } });
    
    fireEvent.change(screen.getByPlaceholderText('Mínimo 8 caracteres'), { target: { value: 'pass1234', name: 'password' } });
    fireEvent.change(screen.getByPlaceholderText('Repite tu contraseña'), { target: { value: 'pass1234', name: 'confirmPassword' } });

    fireEvent.submit(screen.getByText('Crear cuenta').closest('form'));

    // Verificamos que la API haya sido llamada con la ruta correcta
    await waitFor(() => {
      expect(mockApiPost).toHaveBeenCalledWith('/auth/register', expect.any(Object));
    });

    // Verificamos que el mensaje de éxito del componente aparezca en el DOM
    const mensajeExito = await screen.findByText(/¡Registro exitoso/i);
    expect(mensajeExito).toBeTruthy();
  });
});