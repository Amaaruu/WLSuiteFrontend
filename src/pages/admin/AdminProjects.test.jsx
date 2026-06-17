import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

vi.mock('../../components/organisms/Sidebar', () => ({ default: () => <aside>Sidebar</aside> }));

vi.mock('../../services/api', () => {
  globalThis.__adminProjectsMock = {
    get:    vi.fn(),
    delete: vi.fn().mockResolvedValue({}),
    patch:  vi.fn().mockResolvedValue({}),
  };
  return { default: globalThis.__adminProjectsMock };
});

import AdminProjects from './AdminProjects';

const mockProjects = [
  { projectId: 1, projectName: 'Mi Tienda', status: 'Ready',   ownerName: 'Juan Pérez', ownerEmail: 'juan@test.com', createdAt: '2024-01-01T10:00:00', businessSector: 'retail'      },
  { projectId: 2, projectName: 'Cafetería', status: 'Pending', ownerName: 'Ana Gómez',  ownerEmail: 'ana@test.com',  createdAt: '2024-01-02T10:00:00', businessSector: 'gastronomia' },
];

const mockAdmin = { name: 'Admin', role: 'admin' };

const renderPage = () =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: mockAdmin, logout: vi.fn() }}>
        <AdminProjects />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Página: AdminProjects', () => {
  beforeEach(() => {
    globalThis.__adminProjectsMock.get.mockResolvedValue({ data: { content: mockProjects, totalPages: 1 } });
    globalThis.__adminProjectsMock.delete.mockResolvedValue({});
  });

  it('renderiza sin errores', () => {
    const { container } = renderPage();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Sidebar', () => {
    renderPage();
    expect(screen.getByText('Sidebar')).toBeTruthy();
  });

  it('muestra el título Gestión de Proyectos', () => {
    renderPage();
    expect(screen.getByText('Gestión de Proyectos')).toBeTruthy();
  });

  it('muestra los proyectos cargados', async () => {
    renderPage();
    expect(await screen.findByText('Mi Tienda')).toBeTruthy();
    expect(await screen.findByText('Cafetería')).toBeTruthy();
  });

  it('muestra el propietario de cada proyecto', async () => {
    renderPage();
    expect(await screen.findByText('Juan Pérez')).toBeTruthy();
  });

  it('muestra el estado de los proyectos traducido', async () => {
    renderPage();
    expect(await screen.findByText('Listo')).toBeTruthy();
    expect(await screen.findByText('Procesando')).toBeTruthy();
  });

  it('muestra mensaje cuando no hay proyectos', async () => {
    globalThis.__adminProjectsMock.get.mockResolvedValueOnce({ data: { content: [], totalPages: 1 } });
    renderPage();
    expect(await screen.findByText('No hay proyectos registrados.')).toBeTruthy();
  });

  it('abre modal de confirmación al hacer clic en eliminar', async () => {
    renderPage();
    await screen.findByText('Mi Tienda');
    const deleteButtons = screen.getAllByTitle('Eliminar proyecto');
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByText('Sí, eliminar')).toBeTruthy();
  });

  it('cierra el modal al cancelar', async () => {
    renderPage();
    await screen.findByText('Mi Tienda');
    const deleteButtons = screen.getAllByTitle('Eliminar proyecto');
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(screen.getByText('Cancelar'));
    expect(screen.queryByText('Sí, eliminar')).toBeNull();
  });

  it('llama a api.delete al confirmar eliminación', async () => {
    renderPage();
    await screen.findByText('Mi Tienda');
    const deleteButtons = screen.getAllByTitle('Eliminar proyecto');
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(screen.getByText('Sí, eliminar'));
    await waitFor(() => expect(globalThis.__adminProjectsMock.delete).toHaveBeenCalled());
  });
});