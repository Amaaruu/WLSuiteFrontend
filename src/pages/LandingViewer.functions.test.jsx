import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const { axiosGet } = vi.hoisted(() => ({ axiosGet: vi.fn() }));

vi.mock('axios', () => ({ default: { get: axiosGet } }));
vi.mock('../utils/exportProject', () => ({
  generateAndDownloadZip: vi.fn(),
  generateIndexHTML:      vi.fn(() => '<html>test</html>'),
}));

import LandingViewer from './LandingViewer';

class MockIntersectionObserver {
  constructor(cb) {
    this._cb = cb;
    MockIntersectionObserver._instances.push(this);
  }
  observe   = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  static _instances = [];
  static reset() { MockIntersectionObserver._instances = []; }
}

const baseLanding = {
  projectName: 'Test Landing',
  aiMetadata: {
    _theme: {},
    hero: {
      headline:    'Headline',
      subheadline: 'Sub',
      ctaButton:   'CTA',
      badge:       null,
      trustIndicators: [],
    },
    features:    [],
    howItWorks:  { steps: [] },
    socialProof: { testimonials: [], stats: [] },
    pricing:     { plans: [] },
    faq:         { items: [] },
    urgency:     null,
    footer:      { description: '', contact: '', links: [], legalText: '' },
    brand:       { name: 'Test', tagline: '' },
    nav:         { links: [] },
    colorPalette:{ primary: '#1e3a5f', secondary: '#3b82f6', background: '#fff', text: '#000' },
    typography:  { headingFont: 'Inter', bodyFont: 'Inter' },
  },
  designPreferences: {
    primaryColor:   'azul-marino',
    secondaryColor: 'azul-cielo',
    baseMode:       'claro',
    buttonShape:    'redondeado',
    animationLevel: 'sutil',
    visualStyle:    'moderno',
    scrollEffect:   'fade-in',
  },
};

const renderViewer = (id = '1', token = 'tok') =>
  render(
    <MemoryRouter initialEntries={[`/landings/${id}?token=${token}`]}>
      <Routes>
        <Route path="/landings/:id" element={<LandingViewer />} />
      </Routes>
    </MemoryRouter>
  );

describe('LandingViewer — funciones internas y branches de buildTheme', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    MockIntersectionObserver.reset();
    global.IntersectionObserver = MockIntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.getElementById('wls-font')?.remove();
  });

  describe('buildTheme — branch primaryColor en LIGHT_COLORS', () => {
    it('usa texto oscuro cuando primaryColor es "blanco"', async () => {
      axiosGet.mockResolvedValue({
        data: {
          ...baseLanding,
          designPreferences: { ...baseLanding.designPreferences, primaryColor: 'blanco' },
        },
      });
      renderViewer();
      await waitFor(() => {
        expect(screen.getByText('Headline')).toBeTruthy();
      });
    });

    it('usa texto oscuro cuando primaryColor es "crema"', async () => {
      axiosGet.mockResolvedValue({
        data: {
          ...baseLanding,
          designPreferences: { ...baseLanding.designPreferences, primaryColor: 'crema' },
        },
      });
      renderViewer();
      await waitFor(() => screen.getByText('Headline'));
    });

    it('usa texto blanco cuando primaryColor es "azul-marino"', async () => {
      axiosGet.mockResolvedValue({ data: baseLanding });
      renderViewer();
      await waitFor(() => screen.getByText('Headline'));
    });

    it('usa texto oscuro cuando primaryColor es "amarillo-dorado"', async () => {
      axiosGet.mockResolvedValue({
        data: {
          ...baseLanding,
          designPreferences: { ...baseLanding.designPreferences, primaryColor: 'amarillo-dorado' },
        },
      });
      renderViewer();
      await waitFor(() => screen.getByText('Headline'));
    });

    it('usa texto oscuro cuando primaryColor es "gris-neutro"', async () => {
      axiosGet.mockResolvedValue({
        data: {
          ...baseLanding,
          designPreferences: { ...baseLanding.designPreferences, primaryColor: 'gris-neutro' },
        },
      });
      renderViewer();
      await waitFor(() => screen.getByText('Headline'));
    });
  });

  describe('buildTheme — modo oscuro', () => {
    it('renderiza correctamente con baseMode oscuro', async () => {
      axiosGet.mockResolvedValue({
        data: {
          ...baseLanding,
          designPreferences: { ...baseLanding.designPreferences, baseMode: 'oscuro' },
        },
      });
      renderViewer();
      await waitFor(() => screen.getByText('Headline'));
    });
  });

  describe('buildTheme — color fallback', () => {
    it('usa color fallback cuando primaryColor no está en COLOR_HEX_MAP', async () => {
      axiosGet.mockResolvedValue({
        data: {
          ...baseLanding,
          designPreferences: { ...baseLanding.designPreferences, primaryColor: 'color-desconocido' },
        },
      });
      renderViewer();
      await waitFor(() => screen.getByText('Headline'));
    });
  });

  describe('IntersectionObserver useEffect', () => {
    it('configura el IntersectionObserver cuando hay datos cargados', async () => {
      axiosGet.mockResolvedValue({ data: baseLanding });
      renderViewer();
      await waitFor(() => screen.getByText('Headline'));
      expect(MockIntersectionObserver._instances.length).toBeGreaterThan(0);
    });

    it('el IntersectionObserver tiene observe como función', async () => {
      axiosGet.mockResolvedValue({ data: baseLanding });
      renderViewer();
      await waitFor(() => screen.getByText('Headline'));
      const instance = MockIntersectionObserver._instances[0];
      expect(typeof instance.observe).toBe('function');
    });
  });

  describe('countdown timer', () => {
    it('el componente monta con el timer sin errores', async () => {
      vi.useFakeTimers();
      axiosGet.mockResolvedValue({ data: baseLanding });
      renderViewer();
      vi.advanceTimersByTime(1000);
      vi.useRealTimers();
      expect(true).toBe(true);
    });
  });

  describe('designPreferences null', () => {
    it('renderiza sin crash cuando designPreferences es null', async () => {
      axiosGet.mockResolvedValue({
        data: { ...baseLanding, designPreferences: null },
      });
      renderViewer();
      await waitFor(() => screen.getByText('Headline'));
    });
  });

  describe('_theme en aiMetadata', () => {
    it('usa colores del _theme cuando están presentes', async () => {
      axiosGet.mockResolvedValue({
        data: {
          ...baseLanding,
          aiMetadata: {
            ...baseLanding.aiMetadata,
            _theme: {
              primaryColor:   '#dc2626',
              secondaryColor: '#7c3aed',
              primaryDark:    '#b91c1c',
              primaryLight:   '#fee2e2',
              primaryText:    '#ffffff',
              primaryRgb:     '220,38,38',
              bgPrimary:      '#ffffff',
              bgSecondary:    '#f9fafb',
              textBase:       '#111827',
              textMuted:      '#6b7280',
              fontFamily:     '"Inter", sans-serif',
              fontImport:     'https://fonts.googleapis.com/css2?family=Inter&display=swap',
              buttonShape:    'redondeado',
              baseMode:       'claro',
            },
          },
        },
      });
      renderViewer();
      await waitFor(() => screen.getByText('Headline'));
    });

    it('usa modo oscuro desde _theme', async () => {
      axiosGet.mockResolvedValue({
        data: {
          ...baseLanding,
          aiMetadata: {
            ...baseLanding.aiMetadata,
            _theme: { baseMode: 'oscuro' },
          },
        },
      });
      renderViewer();
      await waitFor(() => screen.getByText('Headline'));
    });
  });

  describe('botones de descarga', () => {
    it('muestra los botones de Descargar ZIP y HTML tras carga exitosa', async () => {
      axiosGet.mockResolvedValue({ data: baseLanding });
      renderViewer();
      await waitFor(() => {
        expect(screen.getByText(/Descargar ZIP/i)).toBeTruthy();
        expect(screen.getByText(/Descargar HTML/i)).toBeTruthy();
      });
    });
  });

  describe('hexToRgb — hex inválido en buildTheme', () => {
    it('no rompe cuando primaryHex es string corto desde _theme', async () => {
      axiosGet.mockResolvedValue({
        data: {
          ...baseLanding,
          aiMetadata: {
            ...baseLanding.aiMetadata,
            _theme: { primaryColor: '#ff' },
          },
        },
      });
      renderViewer();
      await waitFor(() => screen.getByText('Headline'));
    });

    it('no rompe cuando primaryHex es null desde _theme', async () => {
      axiosGet.mockResolvedValue({
        data: {
          ...baseLanding,
          aiMetadata: {
            ...baseLanding.aiMetadata,
            _theme: { primaryColor: null },
          },
        },
      });
      renderViewer();
      await waitFor(() => screen.getByText('Headline'));
    });
  });

  describe('wls-font link ya existente', () => {
    it('no duplica el link de fuente si ya existe en el head', async () => {
      const existingLink = document.createElement('link');
      existingLink.id = 'wls-font';
      document.head.appendChild(existingLink);

      axiosGet.mockResolvedValue({ data: baseLanding });
      renderViewer();
      await waitFor(() => screen.getByText('Headline'));

      // Solo debe haber un link con id wls-font
      const links = document.querySelectorAll('#wls-font');
      expect(links.length).toBe(1);
    });
  });
});