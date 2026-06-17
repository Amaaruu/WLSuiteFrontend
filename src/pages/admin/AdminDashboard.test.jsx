import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

vi.mock('../../components/organisms/Sidebar', () => ({ default: () => <aside>Sidebar</aside> }));
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: [] }),
  },
}));

import AdminDashboard from './AdminDashboard';

const mockAdmin = { name: 'Admin', email: 'admin@test.com', role: 'admin' };

const renderAdmin = () =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: mockAdmin, logout: vi.fn() }}>
        <AdminDashboard />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Página: AdminDashboard', () => {
  it('renderiza sin errores', () => {
    const { container } = renderAdmin();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Sidebar', () => {
    renderAdmin();
    expect(screen.getByText('Sidebar')).toBeTruthy();
  });

  it('muestra el título del panel', () => {
    renderAdmin();
    expect(screen.getByText('Panel de administración')).toBeTruthy();
  });

  it('muestra la tarjeta de Usuarios', () => {
    renderAdmin();
    expect(screen.getByText('Usuarios')).toBeTruthy();
  });

  it('muestra la tarjeta de Proyectos', () => {
    renderAdmin();
    expect(screen.getByText('Proyectos')).toBeTruthy();
  });
});