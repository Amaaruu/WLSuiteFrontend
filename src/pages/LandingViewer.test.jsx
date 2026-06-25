import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const { axiosGet } = vi.hoisted(() => ({ axiosGet: vi.fn() }));

vi.mock('axios', () => ({ default: { get: axiosGet } }));
vi.mock('../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('jszip', () => ({
  default: vi.fn().mockImplementation(() => ({
    folder: vi.fn().mockReturnThis(),
    file:   vi.fn().mockReturnThis(),
    generateAsync: vi.fn().mockResolvedValue(new Blob(['zip'])),
  })),
}));
vi.mock('file-saver', () => ({ saveAs: vi.fn() }));

import LandingViewer from './LandingViewer';

const mockLandingData = {
  projectName: 'Mi Tienda Online',
  aiMetadata: {
    hero: {
      headline:    'La mejor tienda',
      subheadline: 'Calidad garantizada',
      ctaText:     'Compra ahora',
    },
    features: {
      title: 'Nuestras características',
      items: [
        { title: 'Rápido',  description: 'Entrega en 24h', icon: '🚀' },
        { title: 'Seguro',  description: 'Pago seguro',    icon: '🔒' },
      ],
    },
    socialProof: {
      testimonials: [
        { name: 'Ana', role: 'Compradora', text: 'Excelente producto', rating: 5 },
      ],
      stats: [{ value: '1000+', label: 'Clientes' }],
    },
    faq: {
      items: [
        { question: '¿Cuánto demora?',        answer: '24 horas hábiles' },
        { question: '¿Aceptan devoluciones?',  answer: 'Sí, 30 días'     },
      ],
    },
    pricing: {
      plans: [
        { name: 'Básico', price: '$9',  features: ['Feature A'], highlighted: false },
        { name: 'Pro',    price: '$29', features: ['Feature C'], highlighted: true  },
      ],
    },
    howItWorks: {
      steps: [
        { title: 'Paso 1', description: 'Elige tu plan'       },
        { title: 'Paso 2', description: 'Configura tu tienda'  },
      ],
    },
    urgency: { title: 'Oferta limitada', description: 'Solo por hoy' },
    footer:   { text: '© 2024 Mi Tienda' },
    brand:    { name: 'Mi Tienda', tagline: 'La mejor opción' },
    nav:      { links: [{ label: 'Inicio', href: '#hero' }] },
    colorPalette: {
      primary: '#1e3a5f', secondary: '#f59e0b',
      background: '#ffffff', text: '#0f172a',
    },
    typography: { headingFont: 'Inter', bodyFont: 'Inter' },
  },
  designPreferences: {
    heroImageUrl:  null,
    logoImageUrl:  null,
    primaryColor:  'azul',
    baseMode:      'claro',
    visualStyle:   'moderno',
    animationLevel:'sutil',
    buttonShape:   'redondeado',
  },
};

const renderViewer = (id = '123', token = 'valid-token') =>
  render(
    <MemoryRouter initialEntries={[`/landings/${id}?token=${token}`]}>
      <Routes>
        <Route path="/landings/:id" element={<LandingViewer />} />
      </Routes>
    </MemoryRouter>
  );

describe('LandingViewer', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.getElementById('wls-font')?.remove();
  });

  describe('sin token en la URL', () => {
    it('muestra mensaje de enlace inválido sin llamar a la API', async () => {
      render(
        <MemoryRouter initialEntries={['/landings/123']}>
          <Routes>
            <Route path="/landings/:id" element={<LandingViewer />} />
          </Routes>
        </MemoryRouter>
      );
      await waitFor(() => {
        expect(screen.getByText(/Página no disponible/i)).toBeTruthy();
      });
      expect(axiosGet).not.toHaveBeenCalled();
    });
  });

  describe('estado de carga', () => {
    it('no muestra el contenido principal mientras carga', () => {
      axiosGet.mockReturnValue(new Promise(() => {}));
      renderViewer();
      expect(screen.queryByText('La mejor tienda')).toBeNull();
    });
  });

  describe('carga exitosa', () => {
    beforeEach(() => {
      axiosGet.mockResolvedValue({ data: mockLandingData });
    });

    it('renderiza el headline del hero', async () => {
      renderViewer();
      await waitFor(() => {
        expect(screen.getByText('La mejor tienda')).toBeTruthy();
      });
    });

    it('renderiza el subheadline', async () => {
      renderViewer();
      await waitFor(() => {
        expect(screen.getByText('Calidad garantizada')).toBeTruthy();
      });
    });

    it('renderiza el botón CTA del hero', async () => {
      renderViewer();
      await waitFor(() => {
        const ctaLinks = document.querySelectorAll('a.btn-primary');
        expect(ctaLinks.length).toBeGreaterThan(0);
      });
    });

    it('renderiza contenido de la landing correctamente', async () => {
        renderViewer();
        await waitFor(() => {
            expect(screen.getByText('La mejor tienda')).toBeTruthy();
            const clientesEls = screen.getAllByText('Clientes');
            expect(clientesEls.length).toBeGreaterThan(0);
        });
    });

    it('renderiza la sección FAQ', async () => {
      renderViewer();
      await waitFor(() => {
        expect(screen.getByText('¿Cuánto demora?')).toBeTruthy();
        expect(screen.getByText('¿Aceptan devoluciones?')).toBeTruthy();
      });
    });

    it('renderiza los pasos de cómo funciona', async () => {
      renderViewer();
      await waitFor(() => {
        expect(screen.getByText('Paso 1')).toBeTruthy();
        expect(screen.getByText('Paso 2')).toBeTruthy();
      });
    });

    it('renderiza la sección de urgencia', async () => {
      renderViewer();
      await waitFor(() => {
        expect(screen.getByText('Oferta limitada')).toBeTruthy();
      });
    });

    it('renderiza el nombre del proyecto en el DOM', async () => {
      renderViewer();
      await waitFor(() => {
        const elements = screen.getAllByText('Mi Tienda Online');
        expect(elements.length).toBeGreaterThan(0);
      });
    });

    it('la llamada a la API usa el id y token correctos', async () => {
      renderViewer('456', 'mi-token');
      await waitFor(() => {
        expect(axiosGet).toHaveBeenCalledWith(
          expect.stringContaining('/landings/456?token=mi-token')
        );
      });
    });

    it('muestra los botones de descarga', async () => {
      renderViewer();
      await waitFor(() => {
        expect(screen.getByText(/Descargar ZIP/i)).toBeTruthy();
        expect(screen.getByText(/Descargar HTML/i)).toBeTruthy();
      });
    });
  });

  describe('error de API', () => {
    it('muestra mensaje de error cuando la API falla con mensaje', async () => {
      axiosGet.mockRejectedValue({
        response: { data: { error: 'El enlace ha expirado o no es válido.' } },
      });
      renderViewer();
      await waitFor(() => {
        expect(screen.getByText('Página no disponible')).toBeTruthy();
        expect(screen.getByText('El enlace ha expirado o no es válido.')).toBeTruthy();
      });
    });

    it('muestra la página de error genérico cuando no hay mensaje', async () => {
      axiosGet.mockRejectedValue(new Error('Network Error'));
      renderViewer();
      await waitFor(() => {
        expect(screen.getByText('Página no disponible')).toBeTruthy();
      });
    });

    it('muestra el link de volver al inicio en caso de error', async () => {
      axiosGet.mockRejectedValue({ response: { data: { error: 'Expirado' } } });
      renderViewer();
      await waitFor(() => {
        expect(screen.getByText('Volver al inicio')).toBeTruthy();
      });
    });
  });

  describe('sin aiMetadata (landingData null)', () => {
    it('no renderiza contenido cuando aiMetadata es null', async () => {
      axiosGet.mockResolvedValue({
        data: { projectName: 'Test', aiMetadata: null, designPreferences: null },
      });
      renderViewer();
      await waitFor(() => {
        expect(screen.queryByText('La mejor tienda')).toBeNull();
      });
    });
  });
});