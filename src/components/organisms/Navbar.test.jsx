import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Navbar from './Navbar';

vi.mock('../../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

const renderNav = (user = null) =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user, logout: vi.fn() }}>
        <Navbar />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Navbar', () => {
  it('muestra los links de navegación', () => {
    renderNav();
    expect(screen.getAllByText('Inicio').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Planes').length).toBeGreaterThan(0);
  });

  it('muestra botones de login y registro cuando no hay usuario', () => {
    renderNav();
    expect(screen.getByText('Iniciar Sesión')).toBeTruthy();
    expect(screen.getByText('Registrarse')).toBeTruthy();
  });

  it('muestra el nombre del usuario cuando está autenticado', () => {
    renderNav({ name: 'Juan', email: 'juan@test.com', role: 'user' });
    expect(screen.getByText('Juan')).toBeTruthy();
  });

  it('muestra "Panel Admin" cuando el usuario es admin', () => {
    renderNav({ name: 'Admin', email: 'admin@test.com', role: 'admin' });
    expect(screen.getByText('Panel Admin')).toBeTruthy();
  });

  it('muestra el menú de usuario al hacer clic en el avatar', () => {
    renderNav({ name: 'Juan', email: 'juan@test.com', role: 'user' });
    fireEvent.click(screen.getByText('Juan').closest('button'));
    expect(screen.getByText('Mi dashboard')).toBeTruthy();
  });

  it('muestra botón Cerrar sesión en el menú de usuario', () => {
    renderNav({ name: 'Juan', email: 'juan@test.com', role: 'user' });
    fireEvent.click(screen.getByText('Juan').closest('button'));
    expect(screen.getByText('Cerrar sesión')).toBeTruthy();
  });
});
