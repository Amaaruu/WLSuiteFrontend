import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

vi.mock('../../components/organisms/Sidebar', () => ({ default: () => <aside>Sidebar</aside> }));

vi.mock('../../services/api', () => {
  globalThis.__adminPlansMock = {
    get:    vi.fn(),
    post:   vi.fn().mockResolvedValue({ data: { planId: 4, name: 'Nuevo', price: 0, description: '' } }),
    put:    vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({}),
  };
  return { default: globalThis.__adminPlansMock };
});

import AdminPlans from './AdminPlans';

const mockPlans = [
  { planId: 1, name: 'Básico',     price: 0,  description: 'Plan gratuito' },
  { planId: 2, name: 'Intermedio', price: 29, description: 'Plan estándar' },
  { planId: 3, name: 'Premium',    price: 59, description: 'Plan completo'  },
];

const mockAdmin = { name: 'Admin', role: 'admin' };

const renderPage = () =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: mockAdmin, logout: vi.fn() }}>
        <AdminPlans />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Página: AdminPlans', () => {
  beforeEach(() => {
    globalThis.__adminPlansMock.get.mockResolvedValue({ data: mockPlans });
  });

  it('renderiza sin errores', () => {
    const { container } = renderPage();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Sidebar', () => {
    renderPage();
    expect(screen.getByText('Sidebar')).toBeTruthy();
  });

  it('muestra el título de planes', () => {
    renderPage();
    expect(screen.getByText(/Planes/)).toBeTruthy();
  });

  it('muestra el botón Nuevo plan', () => {
    renderPage();
    expect(screen.getByText('Nuevo plan')).toBeTruthy();
  });

  it('muestra los planes cargados desde la API', async () => {
    renderPage();
    expect((await screen.findAllByText('Básico')).length).toBeGreaterThanOrEqual(1);
    expect(await screen.findByText('Plan gratuito')).toBeTruthy();
    expect(await screen.findByText('Plan estándar')).toBeTruthy();
  });

  it('muestra la descripción de cada plan', async () => {
    renderPage();
    expect(await screen.findByText('Plan gratuito')).toBeTruthy();
  });

  it('abre el modal de creación al hacer clic en Nuevo plan', () => {
    renderPage();
    fireEvent.click(screen.getByText('Nuevo plan'));
    expect(screen.getByText('Nombre del plan')).toBeTruthy();
    expect(screen.getByText('Crear plan')).toBeTruthy();
  });

  it('abre el modal de edición al hacer clic en Editar', async () => {
    renderPage();
    const editButtons = await screen.findAllByTitle('Editar plan');
    fireEvent.click(editButtons[0]);
    expect(screen.getByText(/Editar plan/i)).toBeTruthy();
  });

  it('abre el modal de eliminación al hacer clic en Eliminar', async () => {
    renderPage();
    const deleteButtons = await screen.findAllByTitle('Eliminar plan');
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByText(/¿Eliminar/i)).toBeTruthy();
  });

  it('muestra mensaje cuando no hay planes', async () => {
    globalThis.__adminPlansMock.get.mockResolvedValueOnce({ data: [] });
    renderPage();
    expect(await screen.findByText('No hay planes creados aún.')).toBeTruthy();
  });
});