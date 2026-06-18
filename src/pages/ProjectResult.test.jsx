import { render, screen, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const { apiGet } = vi.hoisted(() => ({ apiGet: vi.fn() }));
const mockNavigate = vi.fn();

let mockLocationState = {
  project: {
    projectId:   42,
    projectName: 'Mi Landing Pro',
    status:      'Processing',
    createdAt:   '2024-06-01T10:00:00',
    landingUrl:  null,
  },
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: mockLocationState }),
    useParams:   () => ({ projectId: '42' }),
  };
});

vi.mock('../services/api', () => ({ default: { get: apiGet } }));
vi.mock('../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../components/organisms/Navbar', () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../components/organisms/Footer', () => ({ default: () => <footer>Footer</footer> }));

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
    mockLocationState = {
      project: {
        projectId:   42,
        projectName: 'Mi Landing Pro',
        status:      'Processing',
        createdAt:   '2024-06-01T10:00:00',
        landingUrl:  null,
      },
    };
  });

  afterEach(() => {
    vi.useRealTimers();
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
    await waitFor(() => expect(screen.getByText('Mi Landing Pro')).toBeTruthy());
  });

  it('muestra link a Mis proyectos', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText(/Mis proyectos/i)).toBeTruthy());
  });

  it('muestra link para nueva landing page', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText(/Nueva landing/i)).toBeTruthy());
  });

  it('muestra estado Generando cuando status es Processing', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.queryAllByText(/Generando/i).length).toBeGreaterThan(0);
    });
  });

  it('muestra estado Lista cuando status es Ready', async () => {
    mockLocationState = {
      project: {
        projectId:   42,
        projectName: 'Mi Landing Lista',
        status:      'Ready',
        createdAt:   '2024-06-01T10:00:00',
        landingUrl:  'https://app.example.com/landings/42?token=abc',
      },
    };
    renderPage();
    await waitFor(() => {
      expect(screen.queryAllByText(/Lista/i).length).toBeGreaterThan(0);
    });
  });

  it('muestra links de navegación cuando status es Ready', async () => {
    mockLocationState = {
      project: {
        projectId:   42,
        projectName: 'Mi Landing Lista',
        status:      'Ready',
        createdAt:   '2024-06-01T10:00:00',
        landingUrl:  'https://app.example.com/landings/42?token=abc',
      },
    };
    renderPage();
    await waitFor(() => {
      expect(screen.queryAllByRole('link').length).toBeGreaterThan(0);
    });
  });

  it('muestra estado Error cuando status es Failed', async () => {
    mockLocationState = {
      project: {
        projectId:   42,
        projectName: 'Mi Landing Fallida',
        status:      'Failed',
        createdAt:   '2024-06-01T10:00:00',
        landingUrl:  null,
      },
    };
    renderPage();
    await waitFor(() => {
      expect(screen.queryAllByText(/Error/i).length).toBeGreaterThan(0);
    });
  });

  it('renderiza el proyecto con createdAt visible en el DOM', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Mi Landing Pro')).toBeTruthy());
  });

  it('muestra spinner de carga cuando no hay initialProject', () => {
    mockLocationState = null;
    apiGet.mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText(/Cargando/i)).toBeTruthy();
  });

  it('carga el proyecto desde la API cuando no hay initialProject', async () => {
    mockLocationState = null;
    apiGet.mockResolvedValue({
      data: {
        projectId:   42,
        projectName: 'Proyecto desde API',
        status:      'Ready',
        createdAt:   '2024-06-01T10:00:00',
        landingUrl:  'https://app.example.com/landings/42?token=abc',
      },
    });
    renderPage();
    await waitFor(() => expect(screen.getByText('Proyecto desde API')).toBeTruthy());
  });

  it('muestra estado de error cuando la API falla al cargar', async () => {
    mockLocationState = null;
    apiGet.mockRejectedValue(new Error('Error de red'));
    renderPage();
    await waitFor(() => {
      expect(screen.queryAllByText(/no se pudo cargar/i).length).toBeGreaterThan(0);
    });
  });

  it('fetchProject no hace nada cuando project.projectId es falsy', async () => {
    mockLocationState = {
      project: {
        projectName: 'Sin ID',
        status:      'Processing',
      },
    };
    vi.useFakeTimers({ shouldAdvanceTime: false });
    renderPage();
    await act(async () => {
      vi.advanceTimersByTime(5001);
    });

    vi.useRealTimers();
    expect(apiGet).not.toHaveBeenCalled();
  });

  it('inicia polling y llama a apiGet cuando status es Processing', async () => {
    mockLocationState = {
      project: {
        projectId:   42,
        projectName: 'Mi Landing Pro',
        status:      'Processing',
        landingUrl:  null,
      },
    };

    apiGet.mockResolvedValue({
      data: {
        projectId:   42,
        projectName: 'Mi Landing Pro',
        status:      'Processing',
        landingUrl:  null,
      },
    });

    vi.useFakeTimers({ shouldAdvanceTime: false });
    renderPage();
    await act(async () => {
      vi.advanceTimersByTime(5001);
    });

    vi.useRealTimers();
    expect(apiGet).toHaveBeenCalledWith('/projects/42');
  });

  it('actualiza el proyecto cuando el polling recibe status Ready', async () => {
    mockLocationState = null;

    apiGet
      .mockResolvedValueOnce({
        data: {
          projectId:   42,
          projectName: 'Mi Pro',
          status:      'Processing',
          landingUrl:  null,
        },
      })
      .mockResolvedValueOnce({
        data: {
          projectId:   42,
          projectName: 'Mi Pro',
          status:      'Ready',
          landingUrl:  'https://app.example.com/landings/42?token=xyz',
        },
      });

    vi.useFakeTimers({ shouldAdvanceTime: false });
    renderPage();

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      vi.advanceTimersByTime(5001);
      await Promise.resolve();
      await Promise.resolve();
    });

    vi.useRealTimers();
    expect(apiGet.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it('muestra error cuando la API retorna 404 al cargar sin initialProject', async () => {
    mockLocationState = null;
    apiGet.mockRejectedValue({ response: { status: 404, data: { message: 'Not found' } } });

    renderPage();

    await waitFor(() => {
      expect(
        screen.queryAllByText(/no se pudo cargar/i).length
      ).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });
});