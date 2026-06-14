import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LoginForm from './LoginForm';

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderForm = (loginResult = { success: true, role: 'user' }) => {
  mockLogin.mockResolvedValue(loginResult);
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{ login: mockLogin }}>
        <LoginForm />
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('LoginForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('muestra el título de bienvenida', () => {
    renderForm();
    expect(screen.getByText('Bienvenido de nuevo')).toBeTruthy();
  });

  it('muestra los campos de email y contraseña', () => {
    renderForm();
    expect(screen.getByPlaceholderText('tu@correo.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('••••••••')).toBeTruthy();
  });

  it('muestra el botón de submit', () => {
    renderForm();
    expect(screen.getByText('Iniciar Sesión')).toBeTruthy();
  });

  it('muestra el link de registro', () => {
    renderForm();
    expect(screen.getByText('Regístrate aquí')).toBeTruthy();
  });

  it('muestra estado de carga al enviar el formulario', async () => {
    let resolveLogin;
    const promesaCongelada = new Promise((resolve) => {
      resolveLogin = resolve;
    });
    
    mockLogin.mockReturnValueOnce(promesaCongelada);

    renderForm();
    fireEvent.change(screen.getByPlaceholderText('tu@correo.com'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });

    const formulario = screen.getByPlaceholderText('tu@correo.com').closest('form');
    fireEvent.submit(formulario);

    const textoCarga = await screen.findByText('Verificando...');
    expect(textoCarga).toBeTruthy();
    resolveLogin({ success: true, role: 'user' });
  });

  it('muestra mensaje de error cuando falla el login', async () => {
    renderForm({ success: false, message: 'Credenciales incorrectas' });
    fireEvent.change(screen.getByPlaceholderText('tu@correo.com'), { target: { value: 'mal@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrongpass' } });
    fireEvent.submit(screen.getByPlaceholderText('tu@correo.com').closest('form'));
    await waitFor(() => expect(screen.getByText('Credenciales incorrectas')).toBeTruthy());
  });

  it('redirige a /dashboard cuando el login es exitoso como usuario', async () => {
    renderForm({ success: true, role: 'user' });
    fireEvent.change(screen.getByPlaceholderText('tu@correo.com'), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByPlaceholderText('tu@correo.com').closest('form'));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true }));
  });

  it('redirige a /admin cuando el login es exitoso como admin', async () => {
    renderForm({ success: true, role: 'admin' });
    fireEvent.change(screen.getByPlaceholderText('tu@correo.com'), { target: { value: 'admin@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'adminpass' } });
    fireEvent.submit(screen.getByPlaceholderText('tu@correo.com').closest('form'));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true }));
  });

  it('toggle muestra/oculta la contraseña', () => {
    renderForm();
    const passwordInput = screen.getByPlaceholderText('••••••••');
    expect(passwordInput.type).toBe('password');
    fireEvent.click(passwordInput.parentElement.querySelector('button'));
    expect(passwordInput.type).toBe('text');
  });
});
