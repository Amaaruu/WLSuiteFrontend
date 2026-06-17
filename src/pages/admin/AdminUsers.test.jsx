import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

vi.mock('../../components/organisms/Sidebar', () => ({ default: () => <aside>Sidebar</aside> }));

vi.mock('../../services/api', () => {
  globalThis.__adminUsersMock = {
    get:    vi.fn(),
    delete: vi.fn().mockResolvedValue({}),
    put:    vi.fn().mockResolvedValue({}),
  };
  return { default: globalThis.__adminUsersMock };
});

import AdminUsers from './AdminUsers';

const mockUsers = [
  { userId: 1, name: 'Juan', lastName: 'Pérez', email: 'juan@test.com', role: 'user',  registeredAt: '2024-01-01' },
  { userId: 2, name: 'Ana',  lastName: 'Gómez', email: 'ana@test.com',  role: 'admin', registeredAt: '2024-01-02' },
];

const mockAdmin = { name: 'Admin', role: 'admin' };

const renderPage = () =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: mockAdmin, logout: vi.fn() }}>
        <AdminUsers />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Página: AdminUsers', () => {
  beforeEach(() => {
    globalThis.__adminUsersMock.get.mockResolvedValue({ data: mockUsers });
    globalThis.__adminUsersMock.delete.mockResolvedValue({});
    globalThis.__adminUsersMock.put.mockResolvedValue({});
  });

  it('renderiza sin errores', () => {
    const { container } = renderPage();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Sidebar', () => {
    renderPage();
    expect(screen.getByText('Sidebar')).toBeTruthy();
  });

  it('muestra el título Usuarios', () => {
    renderPage();
    expect(screen.getByText('Usuarios')).toBeTruthy();
  });

  it('muestra el botón Actualizar', () => {
    renderPage();
    expect(screen.getByText('Actualizar')).toBeTruthy();
  });

  it('muestra los usuarios cargados (por email, no por nombre partido)', async () => {
    renderPage();
    // El nombre se renderiza con whitespace entre nombre y apellido — buscamos por email
    expect(await screen.findByText('juan@test.com')).toBeTruthy();
    expect(await screen.findByText('ana@test.com')).toBeTruthy();
  });

  it('muestra el nombre completo con regex flexible', async () => {
    renderPage();
    expect(await screen.findByText(/Juan/)).toBeTruthy();
    expect(await screen.findByText(/Ana/)).toBeTruthy();
  });

  it('muestra los badges de rol', async () => {
    renderPage();
    expect(await screen.findByText('Usuario')).toBeTruthy();
    expect(await screen.findByText('Administrador')).toBeTruthy();
  });

  it('muestra botones Dar admin y Quitar admin', async () => {
    renderPage();
    expect(await screen.findByText('Dar admin')).toBeTruthy();
    expect(await screen.findByText('Quitar admin')).toBeTruthy();
  });

  it('abre el modal de eliminar al hacer clic en Eliminar', async () => {
    renderPage();
    const deleteButtons = await screen.findAllByText('Eliminar');
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByText('Eliminar usuario')).toBeTruthy();
  });

  it('cierra el modal al hacer clic en Cancelar', async () => {
    renderPage();
    const deleteButtons = await screen.findAllByText('Eliminar');
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(screen.getByText('Cancelar'));
    expect(screen.queryByText('Eliminar usuario')).toBeNull();
  });

  it('abre el modal de cambio de rol al hacer clic en Dar admin', async () => {
    renderPage();
    const darAdmin = await screen.findByText('Dar admin');
    fireEvent.click(darAdmin);
    expect(screen.getByText('Cambiar rol de usuario')).toBeTruthy();
  });

  it('llama a api.put al confirmar cambio de rol', async () => {
    renderPage();
    const darAdmin = await screen.findByText('Dar admin');
    fireEvent.click(darAdmin);
    fireEvent.click(screen.getByText('Confirmar cambio'));
    await waitFor(() => expect(globalThis.__adminUsersMock.put).toHaveBeenCalled());
  });

  it('muestra error cuando la API falla con 500', async () => {
    globalThis.__adminUsersMock.get.mockRejectedValueOnce({ response: { status: 500 } });
    renderPage();
    expect(await screen.findByText('El servidor encontró un error. Por favor, intenta más tarde.')).toBeTruthy();
  });

  it('muestra mensaje cuando no hay usuarios', async () => {
    globalThis.__adminUsersMock.get.mockResolvedValueOnce({ data: [] });
    renderPage();
    expect(await screen.findByText('No hay usuarios registrados.')).toBeTruthy();
  });
});