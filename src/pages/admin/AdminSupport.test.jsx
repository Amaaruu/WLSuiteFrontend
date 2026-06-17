import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const { apiGet } = vi.hoisted(() => ({
  apiGet: vi.fn(),
}));

vi.mock('../../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../../components/organisms/Sidebar', () => ({
  default: () => <aside>Sidebar</aside>,
}));
vi.mock('lucide-react', () => ({
  HeadphonesIcon: () => <span>HeadphonesIcon</span>,
  MessageSquare:  () => <span>MessageIcon</span>,
  RefreshCw:      () => <span>RefreshIcon</span>,
  CheckCircle2:   () => <span>CheckIcon</span>,
  Clock:          () => <span>ClockIcon</span>,
  AlertCircle:    () => <span>AlertIcon</span>,
  Headphones:     () => <span>HeadphonesIcon</span>,
  Mail:           () => <span>MailIcon</span>,
  User:           () => <span>UserIcon</span>,
  Calendar:       () => <span>CalendarIcon</span>,
}));
vi.mock('../../services/api', () => ({
  default: { get: apiGet },
}));

import AdminSupport from './AdminSupport';

const mockTickets = [
  {
    id:        1,
    userName:  'Ana García',
    userEmail: 'ana@test.com',
    message:   'Necesito ayuda con mi landing.',
    status:    'open',
    createdAt: '2024-01-15T10:00:00',
  },
  {
    id:        2,
    userName:  'Luis Pérez',
    userEmail: 'luis@test.com',
    message:   'Error al exportar el ZIP.',
    status:    'resuelto',
    createdAt: '2024-01-14T09:00:00',
  },
];

const renderPage = () =>
  render(<MemoryRouter><AdminSupport /></MemoryRouter>);

beforeEach(() => {
  apiGet.mockResolvedValue({ data: mockTickets });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('AdminSupport — renderizado base', () => {

  it('renderiza sin errores', () => {
    const { container } = renderPage();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Sidebar', () => {
    renderPage();
    expect(screen.getByText('Sidebar')).toBeTruthy();
  });

  it('muestra el título Centro de Soporte', () => {
    renderPage();
    expect(screen.getByText('Centro de Soporte')).toBeTruthy();
  });

  it('muestra los nombres de usuario cargados', async () => {
    renderPage();
    expect(await screen.findByText('Ana García')).toBeTruthy();
    expect(await screen.findByText('Luis Pérez')).toBeTruthy();
  });

  it('muestra el email del usuario', async () => {
    renderPage();
    expect(await screen.findByText('ana@test.com')).toBeTruthy();
  });

  it('muestra el mensaje del ticket', async () => {
    renderPage();
    expect(await screen.findByText('Necesito ayuda con mi landing.')).toBeTruthy();
  });

  it('muestra badge "Pendiente" para tickets con status open', async () => {
    renderPage();
    expect(await screen.findByText('Pendiente')).toBeTruthy();
  });

  it('muestra badge "Resuelto" para tickets con status distinto de open', async () => {
    renderPage();
    expect(await screen.findByText('Resuelto')).toBeTruthy();
  });

  it('muestra el botón "Responder" para cada ticket', async () => {
    renderPage();
    await screen.findByText('Ana García');
    const btns = screen.getAllByText('Responder');
    expect(btns.length).toBe(2);
  });

  it('llama a api.get al montar el componente', () => {
    renderPage();
    expect(apiGet).toHaveBeenCalledWith('/support/tickets');
  });
});

describe('AdminSupport — lista vacía', () => {

  it('muestra mensaje cuando no hay tickets', async () => {
    apiGet.mockResolvedValueOnce({ data: [] });
    renderPage();
    expect(await screen.findByText(/No hay mensajes de soporte/i)).toBeTruthy();
  });

  it('maneja array vacío sin crash', async () => {
    apiGet.mockResolvedValueOnce({ data: [] });
    const { container } = renderPage();
    await waitFor(() => {
      expect(container.firstChild).toBeTruthy();
    });
  });
});

describe('AdminSupport — formato de datos', () => {

  it('formatea correctamente la fecha del ticket', async () => {
    renderPage();
    await screen.findByText('Ana García');
    expect(screen.getAllByText(/2024/).length).toBeGreaterThan(0);
  });

  it('muestra la columna Usuario con el header correcto', () => {
    renderPage();
    expect(screen.getByText('Usuario')).toBeTruthy();
  });

  it('muestra la columna Estado con el header correcto', () => {
    renderPage();
    expect(screen.getByText('Estado')).toBeTruthy();
  });
});

describe('AdminSupport — manejo de errores', () => {

  it('muestra lista vacía cuando la API falla (catch silencioso con fallback [])', async () => {
    apiGet.mockRejectedValueOnce(new Error('Network error'));
    renderPage();
    expect(await screen.findByText(/No hay mensajes de soporte/i)).toBeTruthy();
  });

  it('normaliza response.data null a [] sin crash', async () => {
    apiGet.mockResolvedValueOnce({ data: null });
    const { container } = renderPage();
    await waitFor(() => {
      expect(container.firstChild).toBeTruthy();
    });
  });
});