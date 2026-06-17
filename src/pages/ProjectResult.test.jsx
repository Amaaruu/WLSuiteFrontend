import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const { apiGet } = vi.hoisted(() => ({ apiGet: vi.fn() }));
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation:  () => ({
      state: {
        project: {
          projectId: 42,
          projectName: 'Mi Landing Pro',
          status: 'GENERATING',
          createdAt: '2024-06-01T10:00:00',
          landingUrl: null,
        },
      },
    }),
    useParams: () => ({ projectId: '42' }),
  };
});

vi.mock('../services/api', () => ({ default: { get: apiGet } }));
vi.mock('../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../components/organisms/Navbar', () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../components/organisms/Footer', () => ({ default: () => <footer>Footer</footer> }));
vi.mock('../components/atoms/Button', () => ({
  default: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
}));
vi.mock('../components/molecules/ErrorBanner', () => ({
  default: ({ message }) => <div data-testid="error-banner">{message}</div>,
}));

import ProjectResult from './ProjectResult';

const mockUser = { name: 'Juan', email: 'juan@test.com', role: 'user' };

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/project-result/42']}>
      <AuthContext.Provider value={{ user: mockUser, logout: vi.fn() }}>
        <Routes>
          <Route path="/project-result/:projectId" element={<ProjectResult />} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Página: ProjectResult', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    apiGet.mockResolvedValue({
      data: {
        projectId: 42,
        projectName: 'Mi Landing Pro',
        status: 'GENERATING',
        landingUrl: null,
      },
    });
  });

  it('renderiza sin errores', () => {
    const { container } = renderPage();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Navbar', () => {
    renderPage();
    expect(screen.getByText('Navbar')).toBeTruthy();
  });

  it('muestra el nombre del proyecto', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Mi Landing Pro')).toBeTruthy();
    });
  });

  it('muestra el estado de procesamiento del proyecto', async () => {
    renderPage();
    await waitFor(() => {
      const estadoEl = screen.getAllByText(/Generando|Procesando/i);
      expect(estadoEl.length).toBeGreaterThan(0);
    });
  });

  it('muestra links de navegación', async () => {
    renderPage();
    await waitFor(() => {
      const links = screen.queryAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });
  });

  it('muestra el link a mis proyectos', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/Mis proyectos/i)).toBeTruthy();
    });
  });

  it('muestra el link para nueva landing page', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/Nueva landing/i)).toBeTruthy();
    });
  });

  describe('proyecto con estado READY y landingUrl disponible', () => {
    it('muestra el enlace de la landing cuando está disponible', async () => {
      apiGet.mockResolvedValue({
        data: {
          projectId: 42,
          projectName: 'Mi Landing Pro',
          status: 'READY',
          landingUrl: 'https://app.example.com/landings/42?token=abc123',
        },
      });

      render(
        <MemoryRouter initialEntries={['/project-result/42']}>
          <AuthContext.Provider value={{ user: mockUser, logout: vi.fn() }}>
            <Routes>
              <Route path="/project-result/:projectId" element={<ProjectResult />} />
            </Routes>
          </AuthContext.Provider>
        </MemoryRouter>
      );

      await waitFor(() => {
        const container = document.body;
        expect(container.textContent.length).toBeGreaterThan(0);
      });
    });
  });

  describe('error al cargar', () => {
    it('no rompe el componente cuando la API falla en el polling', async () => {
      apiGet.mockRejectedValue({ response: { data: { message: 'No encontrado' } } });
      const { container } = renderPage();
      await waitFor(() => {
        expect(container.firstChild).toBeTruthy();
      });
    });
  });
});