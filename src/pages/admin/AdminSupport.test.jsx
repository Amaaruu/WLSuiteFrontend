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

import AdminSupport from './AdminSupport';

const mockAdmin = { name: 'Admin', role: 'admin' };

const renderSupport = () =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: mockAdmin, logout: vi.fn() }}>
        <AdminSupport />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Página: AdminSupport', () => {
  it('renderiza sin errores', () => {
    const { container } = renderSupport();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Sidebar', () => {
    renderSupport();
    expect(screen.getByText('Sidebar')).toBeTruthy();
  });

  it('muestra el título Centro de Soporte', () => {
    renderSupport();
    expect(screen.getByText('Centro de Soporte')).toBeTruthy();
  });

  it('muestra el mensaje cuando no hay tickets', async () => {
    renderSupport();
    expect(await screen.findByText('No hay mensajes de soporte pendientes.')).toBeTruthy();
  });
});