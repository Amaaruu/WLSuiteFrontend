import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const { apiGet } = vi.hoisted(() => ({ apiGet: vi.fn() }));

vi.mock('../../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../../components/organisms/Sidebar', () => ({
  default: () => <aside>Sidebar</aside>,
}));
vi.mock('lucide-react', () => ({
  Terminal:    () => <span>TerminalIcon</span>,
  RefreshCw:   () => <span>RefreshIcon</span>,
  AlertCircle: () => <span>AlertIcon</span>,
}));
vi.mock('../../services/api', () => ({
  default: { get: apiGet },
}));

import AdminLogs from './AdminLogs';

// ── Fixtures ──────────────────────────────────────────────────────────────────
const mockLogs = [
  { logId: 1, eventType: 'LOGIN',    userEmail: 'user@test.com',  ipClient: '127.0.0.1',   eventAt: '2024-01-15T10:30:00' },
  { logId: 2, eventType: 'REGISTER', userEmail: 'new@test.com',   ipClient: '192.168.1.1', eventAt: '2024-01-15T11:00:00' },
  { logId: 3, eventType: 'DELETE',   userEmail: 'admin@test.com', ipClient: null,           eventAt: '2024-01-15T12:00:00' },
  { logId: 4, eventType: 'CREATE',   userEmail: 'dev@test.com',   ipClient: '10.0.0.1',    eventAt: '2024-01-15T13:00:00' },
  { logId: 5, eventType: 'PROJECT',  userEmail: 'dev2@test.com',  ipClient: '10.0.0.2',    eventAt: null },
  { logId: 6, eventType: 'EXPORT',   userEmail: 'other@test.com', ipClient: '10.0.0.3',    eventAt: '2024-01-15T14:00:00' },
];

const renderPage = () =>
  render(<MemoryRouter><AdminLogs /></MemoryRouter>);

beforeEach(() => {
  apiGet.mockResolvedValue({ data: mockLogs });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('AdminLogs — renderizado base', () => {

  it('renderiza sin errores', () => {
    const { container } = renderPage();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Sidebar', () => {
    renderPage();
    expect(screen.getByText('Sidebar')).toBeTruthy();
  });

  it('muestra el título Historial de Eventos', () => {
    renderPage();
    expect(screen.getByText('Historial de Eventos')).toBeTruthy();
  });

  it('muestra los logs cargados desde la API', async () => {
    renderPage();
    expect(await screen.findByText('user@test.com')).toBeTruthy();
    expect(await screen.findByText('new@test.com')).toBeTruthy();
  });

  it('muestra el conteo correcto de eventos', async () => {
    renderPage();
    expect(await screen.findByText(/6 eventos registrados/)).toBeTruthy();
  });

  it('muestra la IP del cliente cuando existe', async () => {
    renderPage();
    expect(await screen.findByText('127.0.0.1')).toBeTruthy();
  });

  it('muestra "—" cuando la IP del cliente es null', async () => {
    renderPage();
    await screen.findByText('user@test.com');
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });

  it('muestra "—" cuando eventAt es null', async () => {
    renderPage();
    await screen.findByText('dev2@test.com');
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });

  it('muestra el botón de actualizar', () => {
    renderPage();
    expect(screen.getByText('Actualizar')).toBeTruthy();
  });
});

describe('AdminLogs — clases de badge por tipo de evento', () => {

  it('aplica clase azul para eventos LOGIN', async () => {
    renderPage();
    await screen.findByText('LOGIN');
    expect(screen.getByText('LOGIN').className).toContain('bg-blue-100');
  });

  it('aplica clase verde para eventos REGISTER', async () => {
    renderPage();
    await screen.findByText('REGISTER');
    expect(screen.getByText('REGISTER').className).toContain('bg-green-100');
  });

  it('aplica clase roja para eventos DELETE', async () => {
    renderPage();
    await screen.findByText('DELETE');
    expect(screen.getByText('DELETE').className).toContain('bg-red-100');
  });

  it('aplica clase morada para eventos CREATE', async () => {
    renderPage();
    await screen.findByText('CREATE');
    expect(screen.getByText('CREATE').className).toContain('bg-purple-100');
  });

  it('aplica clase morada para eventos PROJECT', async () => {
    renderPage();
    await screen.findByText('PROJECT');
    expect(screen.getByText('PROJECT').className).toContain('bg-purple-100');
  });

  it('aplica clase gris para eventos sin clasificar', async () => {
    renderPage();
    await screen.findByText('EXPORT');
    expect(screen.getByText('EXPORT').className).toContain('bg-gray-100');
  });
});

describe('AdminLogs — manejo de errores', () => {

  it('muestra error 403 con mensaje de permisos', async () => {
    apiGet.mockRejectedValueOnce({ response: { status: 403 } });
    renderPage();
    expect(await screen.findByText(/Sin permisos para ver los logs/)).toBeTruthy();
  });

  it('muestra error 401 con mensaje de sesión expirada', async () => {
    apiGet.mockRejectedValueOnce({ response: { status: 401 } });
    renderPage();
    expect(await screen.findByText(/Sesión expirada/)).toBeTruthy();
  });

  it('muestra mensaje genérico para errores 500 con mensaje de API', async () => {
    apiGet.mockRejectedValueOnce({
      response: { status: 500, data: { message: 'Error interno' } },
    });
    renderPage();
    expect(await screen.findByText(/Error al cargar logs/)).toBeTruthy();
  });

  it('muestra mensaje genérico para network error sin response', async () => {
    apiGet.mockRejectedValueOnce({ message: 'Network Error' });
    renderPage();
    expect(await screen.findByText(/Error al cargar logs/)).toBeTruthy();
  });
});

describe('AdminLogs — lista vacía y recarga', () => {

  it('muestra mensaje cuando no hay logs', async () => {
    apiGet.mockResolvedValueOnce({ data: [] });
    renderPage();
    expect(await screen.findByText(/No hay eventos registrados aún/)).toBeTruthy();
  });

  it('normaliza a [] cuando la API devuelve un no-array', async () => {
    apiGet.mockResolvedValueOnce({ data: null });
    renderPage();
    await waitFor(() => {
      expect(apiGet).toHaveBeenCalledWith('/logs/all');
    });
  });

  it('el botón Actualizar recarga los logs', async () => {
    renderPage();
    await screen.findByText('user@test.com');
    fireEvent.click(screen.getByText('Actualizar'));
    await waitFor(() => {
      expect(apiGet).toHaveBeenCalledTimes(2);
    });
  });
});