import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const { apiGet, apiDelete } = vi.hoisted(() => ({
  apiGet:    vi.fn(),
  apiDelete: vi.fn(),
}));

vi.mock('../../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../../components/organisms/Navbar',  () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../../components/organisms/Footer',  () => ({ default: () => <footer>Footer</footer> }));
vi.mock('../../components/molecules/ErrorBanner', () => ({
  default: ({ message }) => <div data-testid="error-banner">{message}</div>,
}));
vi.mock('../../components/molecules/EmptyState', () => ({
  default: ({ message }) => <div data-testid="empty-state">{message}</div>,
}));
vi.mock('../../components/molecules/ConfirmModal', () => ({
  default: ({ title, onConfirm, onClose }) => (
    <div data-testid="confirm-modal">
      <span>{title}</span>
      <button onClick={onConfirm}>Confirmar</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  ),
}));
vi.mock('../../components/molecules/ProjectRow', () => ({
  default: ({ project, onDelete }) => (
    <div data-testid="project-row">
      <span>{project.projectName}</span>
      <button onClick={() => onDelete(project)}>Eliminar</button>
    </div>
  ),
}));
vi.mock('../../components/atoms/Button', () => ({
  default: ({ children }) => <button>{children}</button>,
}));
vi.mock('../../services/api', () => ({
  default: { get: apiGet, delete: apiDelete },
}));

import UserProjects from './UserProjects';

const mockUser = { name: 'Juan', email: 'juan@test.com', role: 'user' };

const mockProjects = [
  { projectId: 1, projectName: 'Tienda Online',  status: 'Ready',      createdAt: '2024-01-01' },
  { projectId: 2, projectName: 'Portafolio Web', status: 'Processing', createdAt: '2024-01-02' },
];

const renderPage = (user = mockUser) =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user, logout: vi.fn() }}>
        <UserProjects />
      </AuthContext.Provider>
    </MemoryRouter>
  );

beforeEach(() => {
  apiGet.mockResolvedValue({ data: { content: mockProjects } });
  apiDelete.mockResolvedValue({});
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe('UserProjects — renderizado base', () => {

  it('renderiza sin errores', () => {
    const { container } = renderPage();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Navbar', () => {
    renderPage();
    expect(screen.getByText('Navbar')).toBeTruthy();
  });

  it('muestra el Footer', () => {
    renderPage();
    expect(screen.getByText('Footer')).toBeTruthy();
  });

  it('muestra el título Mis proyectos', () => {
    renderPage();
    expect(screen.getByText('Mis proyectos')).toBeTruthy();
  });

  it('muestra los proyectos cargados', async () => {
    renderPage();
    expect(await screen.findByText('Tienda Online')).toBeTruthy();
    expect(await screen.findByText('Portafolio Web')).toBeTruthy();
  });

  it('muestra el conteo correcto de proyectos', async () => {
    renderPage();
    expect(await screen.findByText(/2 proyectos registrados/)).toBeTruthy();
  });

  it('muestra el botón de nueva landing', () => {
    renderPage();
    expect(screen.getByText('+ Nueva landing')).toBeTruthy();
  });
});

describe('UserProjects — sin usuario autenticado', () => {

  it('no llama a la API cuando no hay usuario', () => {
    renderPage(null);
    expect(apiGet).not.toHaveBeenCalled();
  });
});

describe('UserProjects — estados de error', () => {

  it('muestra el ErrorBanner cuando la API falla', async () => {
    apiGet.mockRejectedValueOnce(new Error('Network error'));
    renderPage();
    expect(await screen.findByTestId('error-banner')).toBeTruthy();
    expect(await screen.findByText(/No se pudieron cargar tus proyectos/)).toBeTruthy();
  });

  it('muestra EmptyState cuando no hay proyectos', async () => {
    apiGet.mockResolvedValueOnce({ data: { content: [] } });
    renderPage();
    expect(await screen.findByTestId('empty-state')).toBeTruthy();
  });

  it('normaliza a [] cuando content es undefined', async () => {
    apiGet.mockResolvedValueOnce({ data: {} });
    renderPage();
    await waitFor(() => {
      expect(screen.queryByTestId('project-row')).toBeNull();
      expect(screen.queryByTestId('error-banner')).toBeNull();
    });
  });
});

describe('UserProjects — eliminación de proyecto exitosa', () => {

  it('abre el modal de confirmación al hacer clic en Eliminar', async () => {
    renderPage();
    await screen.findByText('Tienda Online');
    fireEvent.click(screen.getAllByText('Eliminar')[0]);
    expect(screen.getByTestId('confirm-modal')).toBeTruthy();
  });

  it('cierra el modal al hacer clic en Cancelar', async () => {
    renderPage();
    await screen.findByText('Tienda Online');
    fireEvent.click(screen.getAllByText('Eliminar')[0]);
    fireEvent.click(screen.getByText('Cancelar'));
    expect(screen.queryByTestId('confirm-modal')).toBeNull();
  });

  it('llama a api.delete con el id correcto al confirmar', async () => {
    renderPage();
    await screen.findByText('Tienda Online');
    fireEvent.click(screen.getAllByText('Eliminar')[0]);
    fireEvent.click(screen.getByText('Confirmar'));
    await waitFor(() => {
      expect(apiDelete).toHaveBeenCalledWith('/projects/1');
    });
  });

  it('muestra toast de éxito tras eliminar', async () => {
    renderPage();
    await screen.findByText('Tienda Online');
    fireEvent.click(screen.getAllByText('Eliminar')[0]);
    fireEvent.click(screen.getByText('Confirmar'));
    expect(await screen.findByText(/eliminado correctamente/i)).toBeTruthy();
  });

  it('quita el proyecto de la lista tras eliminarlo', async () => {
    renderPage();
    await screen.findByText('Tienda Online');
    fireEvent.click(screen.getAllByText('Eliminar')[0]);
    fireEvent.click(screen.getByText('Confirmar'));
    await waitFor(() => {
      expect(screen.queryByText('Tienda Online')).toBeNull();
    });
  });

  it('el toast de éxito es visible tras confirmar eliminación', async () => {
    renderPage();
    await screen.findByText('Tienda Online');
    fireEvent.click(screen.getAllByText('Eliminar')[0]);
    fireEvent.click(screen.getByText('Confirmar'));
    const toast = await screen.findByText(/eliminado correctamente/i);
    expect(toast).toBeTruthy();
  });
});

describe('UserProjects — errores al eliminar', () => {

  it('muestra toast de error 403 al eliminar sin permisos', async () => {
    apiDelete.mockRejectedValueOnce({ response: { status: 403 } });
    renderPage();
    await screen.findByText('Tienda Online');
    fireEvent.click(screen.getAllByText('Eliminar')[0]);
    fireEvent.click(screen.getByText('Confirmar'));
    expect(await screen.findByText(/No tienes permisos/)).toBeTruthy();
  });

  it('muestra toast de error 404 cuando el proyecto no existe', async () => {
    apiDelete.mockRejectedValueOnce({ response: { status: 404 } });
    renderPage();
    await screen.findByText('Tienda Online');
    fireEvent.click(screen.getAllByText('Eliminar')[0]);
    fireEvent.click(screen.getByText('Confirmar'));
    expect(await screen.findByText(/no fue encontrado/i)).toBeTruthy();
  });

  it('muestra toast de error genérico para código 500', async () => {
    apiDelete.mockRejectedValueOnce({ response: { status: 500 } });
    renderPage();
    await screen.findByText('Tienda Online');
    fireEvent.click(screen.getAllByText('Eliminar')[0]);
    fireEvent.click(screen.getByText('Confirmar'));
    expect(await screen.findByText(/No se pudo eliminar/)).toBeTruthy();
  });
});