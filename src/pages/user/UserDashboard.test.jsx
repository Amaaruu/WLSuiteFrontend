import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

vi.mock('../../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../../components/organisms/Navbar',  () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../../components/organisms/Footer',  () => ({ default: () => <footer>Footer</footer> }));
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { content: [] } }),
  },
}));

import UserDashboard from './UserDashboard';

const mockUser = { name: 'Juan', email: 'juan@test.com', role: 'user' };

const renderDashboard = (user = mockUser) =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user, logout: vi.fn() }}>
        <UserDashboard />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Página: UserDashboard', () => {
  it('renderiza sin errores', () => {
    const { container } = renderDashboard();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el saludo con el nombre del usuario', () => {
    renderDashboard();
    expect(screen.getByText(/Hola, Juan/)).toBeTruthy();
  });

  it('muestra el enlace para crear nueva landing', () => {
    renderDashboard();
    expect(screen.getByText('+ Nueva landing page')).toBeTruthy();
  });

  it('muestra el enlace a Mis proyectos', () => {
    renderDashboard();
    expect(screen.getByText('Mis proyectos')).toBeTruthy();
  });

  it('muestra el Navbar', () => {
    renderDashboard();
    expect(screen.getByText('Navbar')).toBeTruthy();
  });

  it('muestra el Footer', () => {
    renderDashboard();
    expect(screen.getByText('Footer')).toBeTruthy();
  });
});