import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import RegisterForm from './RegisterForm';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockApiPost = vi.fn();
vi.mock('../../services/api', () => ({
  default: { post: (...args) => mockApiPost(...args) }
}));

describe('Organismo: <RegisterForm />', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderForm = () =>
    render(<MemoryRouter><RegisterForm /></MemoryRouter>);

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

  it('muestra el campo contraseña', () => {
    renderForm();
    expect(screen.getByPlaceholderText('Mínimo 8 caracteres')).toBeTruthy();
  });

  it('muestra el campo confirmar contraseña', () => {
    renderForm();
    expect(screen.getByPlaceholderText('Repite tu contraseña')).toBeTruthy();
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
    fireEvent.change(screen.getByPlaceholderText('Mínimo 8 caracteres'), {
      target: { value: 'pass1234', name: 'password' },
    });
    fireEvent.change(screen.getByPlaceholderText('Repite tu contraseña'), {
      target: { value: 'pass12345', name: 'confirmPassword' },
    });
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

  it('muestra error si confirmación de contraseña está vacía', async () => {
    renderForm();
    fireEvent.change(screen.getByPlaceholderText('Mínimo 8 caracteres'), {
      target: { value: 'pass1234', name: 'password' },
    });
    fireEvent.submit(screen.getByText('Crear cuenta').closest('form'));
    expect(await screen.findByText('Por favor confirma tu contraseña.')).toBeTruthy();
  });

  it('muestra error si apellido es muy corto', async () => {
    renderForm();
    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'Juan', name: 'name' } });
    fireEvent.change(textboxes[1], { target: { value: 'A', name: 'lastname' } });
    fireEvent.submit(screen.getByText('Crear cuenta').closest('form'));
    expect(await screen.findByText('El apellido debe tener al menos 2 caracteres.')).toBeTruthy();
  });

  it('toggle muestra/oculta la contraseña principal', () => {
    renderForm();
    const passwordInput = screen.getByPlaceholderText('Mínimo 8 caracteres');
    expect(passwordInput.type).toBe('password');
    const toggleBtns = screen.getAllByRole('button', { name: '' });
    const passwordToggle = toggleBtns[0];
    fireEvent.click(passwordToggle);
    expect(passwordInput.type).toBe('text');
    fireEvent.click(passwordToggle);
    expect(passwordInput.type).toBe('password');
  });

  it('toggle muestra/oculta la confirmación de contraseña', () => {
    renderForm();
    const confirmInput = screen.getByPlaceholderText('Repite tu contraseña');
    expect(confirmInput.type).toBe('password');
    const toggleBtns = screen.getAllByRole('button', { name: '' });
    const confirmToggle = toggleBtns[1];
    fireEvent.click(confirmToggle);
    expect(confirmInput.type).toBe('text');
    fireEvent.click(confirmToggle);
    expect(confirmInput.type).toBe('password');
  });

  it('muestra warning de caracteres faltantes al escribir contraseña corta', async () => {
    renderForm();
    const passwordInput = screen.getByPlaceholderText('Mínimo 8 caracteres');
    fireEvent.change(passwordInput, { target: { value: 'abc', name: 'password' } });
    await waitFor(() => {
      expect(screen.getByText(/caracteres más requeridos/)).toBeTruthy();
    });
  });

  it('limpia el error de campo al corregir el valor', async () => {
    renderForm();
    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'J', name: 'name' } });
    fireEvent.submit(screen.getByText('Crear cuenta').closest('form'));
    await screen.findByText('El nombre debe tener al menos 2 caracteres.');
    fireEvent.change(textboxes[0], { target: { value: 'Juan', name: 'name' } });
    await waitFor(() => {
      expect(screen.queryByText('El nombre debe tener al menos 2 caracteres.')).toBeNull();
    });
  });

  it('envía el formulario correctamente y muestra mensaje de éxito', async () => {
    mockApiPost.mockResolvedValue({ data: {} });
    renderForm();
    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'Juan', name: 'name' } });
    fireEvent.change(textboxes[1], { target: { value: 'Pérez', name: 'lastname' } });
    fireEvent.change(textboxes[2], { target: { value: 'juan@test.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText('Mínimo 8 caracteres'), {
      target: { value: 'pass1234', name: 'password' },
    });
    fireEvent.change(screen.getByPlaceholderText('Repite tu contraseña'), {
      target: { value: 'pass1234', name: 'confirmPassword' },
    });
    await act(async () => {
      fireEvent.submit(screen.getByText('Crear cuenta').closest('form'));
    });
    expect(await screen.findByText(/Registro exitoso/)).toBeTruthy();
  });

  it('muestra error de API al fallar el registro', async () => {
    mockApiPost.mockRejectedValue({
      response: { data: { message: 'El correo ya está registrado.' } },
    });
    renderForm();
    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'Juan', name: 'name' } });
    fireEvent.change(textboxes[1], { target: { value: 'Pérez', name: 'lastname' } });
    fireEvent.change(textboxes[2], { target: { value: 'juan@test.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText('Mínimo 8 caracteres'), {
      target: { value: 'pass1234', name: 'password' },
    });
    fireEvent.change(screen.getByPlaceholderText('Repite tu contraseña'), {
      target: { value: 'pass1234', name: 'confirmPassword' },
    });
    await act(async () => {
      fireEvent.submit(screen.getByText('Crear cuenta').closest('form'));
    });
    expect(await screen.findByText('El correo ya está registrado.')).toBeTruthy();
  });

  it('limpia el error general al retipear en un campo', async () => {
    mockApiPost.mockRejectedValue({
      response: { data: { message: 'El correo ya está registrado.' } },
    });
    renderForm();
    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'Juan', name: 'name' } });
    fireEvent.change(textboxes[1], { target: { value: 'Pérez', name: 'lastname' } });
    fireEvent.change(textboxes[2], { target: { value: 'juan@test.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText('Mínimo 8 caracteres'), {
      target: { value: 'pass1234', name: 'password' },
    });
    fireEvent.change(screen.getByPlaceholderText('Repite tu contraseña'), {
      target: { value: 'pass1234', name: 'confirmPassword' },
    });
    await act(async () => {
      fireEvent.submit(screen.getByText('Crear cuenta').closest('form'));
    });
    await screen.findByText('El correo ya está registrado.');
    fireEvent.change(textboxes[2], { target: { value: 'otro@test.com', name: 'email' } });
    await waitFor(() => {
      expect(screen.queryByText('El correo ya está registrado.')).toBeNull();
    });
  });
});