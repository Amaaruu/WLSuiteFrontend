import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

vi.mock('../../components/organisms/Sidebar', () => ({ default: () => <aside>Sidebar</aside> }));
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: [
        { logId: 1, eventType: 'LOGIN', userEmail: 'user@test.com', ipClient: '127.0.0.1', eventAt: '2024-01-01T10:00:00' },
      ],
    }),
  },
}));

import AdminLogs from './AdminLogs';

const mockAdmin = { name: 'Admin', role: 'admin' };

const renderLogs = () =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: mockAdmin, logout: vi.fn() }}>
        <AdminLogs />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Página: AdminLogs', () => {
  it('renderiza sin errores', () => {
    const { container } = renderLogs();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Sidebar', () => {
    renderLogs();
    expect(screen.getByText('Sidebar')).toBeTruthy();
  });

  it('muestra el título de la página', () => {
    renderLogs();
    expect(screen.getByText('Historial de Eventos')).toBeTruthy();
  });

  it('muestra el subtítulo de monitoreo', () => {
    renderLogs();
    expect(screen.getByText('Monitoreo de actividad del sistema.')).toBeTruthy();
  });

  it('muestra el botón de actualizar', () => {
    renderLogs();
    expect(screen.getByText('Actualizar')).toBeTruthy();
  });
});