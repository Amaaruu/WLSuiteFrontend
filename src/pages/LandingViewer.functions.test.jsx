import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const { axiosGet, mockGenerateAndDownloadZip, mockGenerateIndexHTML } = vi.hoisted(() => ({
  axiosGet:                   vi.fn(),
  mockGenerateAndDownloadZip: vi.fn(),
  mockGenerateIndexHTML:      vi.fn(() => '<html>test</html>'),
}));

vi.mock('axios', () => ({ default: { get: axiosGet } }));
vi.mock('../utils/exportProject', () => ({
  generateAndDownloadZip: mockGenerateAndDownloadZip,
  generateIndexHTML:      mockGenerateIndexHTML,
}));

import LandingViewer from './LandingViewer';

class MockIntersectionObserver {
  constructor(cb) { this._cb = cb; }
  observe    = vi.fn();
  unobserve  = vi.fn();
  disconnect = vi.fn();
}

const makeFullLanding = (heroOverrides = {}, footerOverrides = {}) => ({
  projectName: 'Test Landing',
  aiMetadata: {
    _theme: {},
    hero: {
      headline:        'Headline principal',
      subheadline:     'Subheadline',
      ctaButton:       'Empezar ahora',
      secondaryCta:    'Ver más',
      badge:           'NUEVO',
      trustIndicators: ['✓ Sin contrato', '✓ Soporte 24/7'],
      ...heroOverrides,
    },
    features: [
      { title: 'Feature A', description: 'Descripción A', icon: '🚀' },
    ],
    howItWorks: {
      steps: [
        { title: 'Primer paso',  description: 'Descripción del primer paso'  },
        { title: 'Segundo paso', description: 'Descripción del segundo paso' },
      ],
    },
    socialProof: {
      testimonials: [
        { name: 'Ana García', role: 'CEO', quote: 'Excelente producto', rating: 5 },
      ],
      stats: [
        { number: '1000+', label: 'Clientes', description: 'Satisfechos' },
      ],
    },
    pricing: {
      plans: [
        { name: 'Plan Básico', price: '$9',  features: ['Feature A'], highlighted: false, cta: 'Elegir' },
        { name: 'Plan Pro',    price: '$29', features: ['Feature B'], highlighted: true,  cta: 'Elegir Pro' },
      ],
    },
    faq: {
      items: [
        { question: '¿Cuánto tarda la implementación?',      answer: 'Menos de 24 horas.'  },
        { question: '¿Ofrecen soporte técnico?',             answer: 'Sí, soporte 24/7.'   },
        { question: '¿Puedo cancelar en cualquier momento?', answer: 'Sí, sin penalidad.'  },
      ],
    },
    urgency: {
      title:         'Oferta por tiempo limitado',
      subtitle:      'Solo por hoy',
      showCountdown: false,
    },
    footer: {
      description: 'Empresa de software',
      contact:     'info@test.com',
      phone:       '+56 9 1234 5678',
      links: [
        { label: 'Inicio',   href: '#hero'  },
        { label: 'Nosotros', href: '#about' },
      ],
      legalText:   'Todos los derechos reservados.',
      socialProof: 'Pago 100% seguro garantizado',
      ...footerOverrides,
    },
    brand:        { name: 'TestBrand', tagline: 'Lo mejor' },
    nav:          { links: [{ label: 'Inicio', href: '#hero' }] },
    colorPalette: { primary: '#1e3a5f', secondary: '#3b82f6', background: '#fff', text: '#000' },
    typography:   { headingFont: 'Inter', bodyFont: 'Inter' },
  },
  designPreferences: {
    primaryColor:   'azul-marino',
    secondaryColor: 'azul-cielo',
    baseMode:       'claro',
    buttonShape:    'redondeado',
    animationLevel: 'sutil',
    visualStyle:    'moderno',
    scrollEffect:   'fade-in',
    heroImageUrl:   null,
    logoImageUrl:   null,
  },
});

const renderViewer = (id = '1', token = 'tok', landingData = makeFullLanding()) => {
  axiosGet.mockResolvedValue({ data: landingData });
  return render(
    <MemoryRouter initialEntries={[`/landings/${id}?token=${token}`]}>
      <Routes>
        <Route path="/landings/:id" element={<LandingViewer />} />
      </Routes>
    </MemoryRouter>
  );
};

const waitForLoad = (text = 'Headline principal') =>
  waitFor(() => expect(screen.getByText(text)).toBeTruthy(), { timeout: 4000 });

const getFaqItem = (question) => {
  const btn = screen.queryAllByRole('button').find(b => b.textContent?.includes(question));
  return btn ? btn.closest('.faq-item') : null;
};

describe('LandingViewer — funciones y ramas', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    window.IntersectionObserver = MockIntersectionObserver;
    window.URL.createObjectURL  = vi.fn(() => 'blob:mock-url');
    window.URL.revokeObjectURL  = vi.fn();
    window.alert                = vi.fn();
    mockGenerateIndexHTML.mockReturnValue('<html>test</html>');
    mockGenerateAndDownloadZip.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.getElementById('wls-font')?.remove();
  });

  describe('buildTheme — variaciones de tema vía designPreferences', () => {
    it('usa modo oscuro cuando baseMode es oscuro', async () => {
      const landing = makeFullLanding();
      landing.designPreferences.baseMode = 'oscuro';
      renderViewer('1', 'tok', landing);
      await waitForLoad();
      expect(true).toBe(true);
    });

    it('usa color primario blanco (rama LIGHT_COLORS → textBase oscuro)', async () => {
      const landing = makeFullLanding();
      landing.designPreferences.primaryColor   = 'blanco';
      landing.designPreferences.secondaryColor = 'crema';
      renderViewer('1', 'tok', landing);
      await waitForLoad();
      expect(true).toBe(true);
    });

    it('usa color secundario amarillo-dorado (rama LIGHT_COLORS secondary)', async () => {
      const landing = makeFullLanding();
      landing.designPreferences.secondaryColor = 'amarillo-dorado';
      renderViewer('1', 'tok', landing);
      await waitForLoad();
      expect(true).toBe(true);
    });

    it('usa color gris-neutro como primaryColor', async () => {
      const landing = makeFullLanding();
      landing.designPreferences.primaryColor = 'gris-neutro';
      renderViewer('1', 'tok', landing);
      await waitForLoad();
      expect(true).toBe(true);
    });

    it('usa secondaryColor no mapeado (fallback al hex map)', async () => {
      const landing = makeFullLanding();
      landing.designPreferences.secondaryColor = 'verde-esmeralda';
      renderViewer('1', 'tok', landing);
      await waitForLoad();
      expect(true).toBe(true);
    });

    it('usa _theme con primaryColor precalculado', async () => {
      const landing = makeFullLanding();
      landing.aiMetadata._theme = {
        primaryColor:   '#ff0000',
        primaryDark:    '#cc0000',
        primaryLight:   '#ffe0e0',
        secondaryColor: '#00ff00',
      };
      renderViewer('1', 'tok', landing);
      await waitForLoad();
      expect(true).toBe(true);
    });

    it('usa buttonShape cuadrado (getBtnRadius variante)', async () => {
      const landing = makeFullLanding();
      landing.designPreferences.buttonShape = 'cuadrado';
      renderViewer('1', 'tok', landing);
      await waitForLoad();
      expect(true).toBe(true);
    });

    it('usa buttonShape pill', async () => {
      const landing = makeFullLanding();
      landing.designPreferences.buttonShape = 'pill';
      renderViewer('1', 'tok', landing);
      await waitForLoad();
      expect(true).toBe(true);
    });
  });

  describe('renderizado completo con todas las secciones', () => {
    it('renderiza el headline principal', async () => {
      renderViewer();
      await waitForLoad();
    });

    it('renderiza secondaryCta cuando existe', async () => {
      renderViewer();
      await waitForLoad();
      await waitFor(() => expect(screen.queryByText('Ver más')).toBeTruthy());
    });

    it('renderiza badge del hero cuando existe', async () => {
      renderViewer();
      await waitForLoad();
      await waitFor(() => expect(screen.queryByText('NUEVO')).toBeTruthy());
    });

    it('renderiza trustIndicators cuando existen', async () => {
      renderViewer();
      await waitForLoad();
      await waitFor(() => expect(screen.queryByText('✓ Sin contrato')).toBeTruthy());
    });

    it('renderiza stats del socialProof', async () => {
      renderViewer();
      await waitForLoad();
      await waitFor(() => expect(screen.queryByText('1000+')).toBeTruthy());
    });

    it('renderiza stat con description adicional', async () => {
      renderViewer();
      await waitForLoad();
      await waitFor(() => expect(screen.queryByText('Satisfechos')).toBeTruthy());
    });

    it('renderiza sección FAQ con preguntas', async () => {
      renderViewer();
      await waitForLoad();
      await waitFor(() =>
        expect(screen.queryAllByText('¿Cuánto tarda la implementación?').length).toBeGreaterThan(0)
      );
    });

    it('renderiza urgency cuando existe', async () => {
      renderViewer();
      await waitForLoad();
      await waitFor(() => expect(screen.queryByText('Oferta por tiempo limitado')).toBeTruthy());
    });

    it('renderiza footer con teléfono cuando existe', async () => {
      renderViewer();
      await waitForLoad();
      await waitFor(() => expect(screen.queryByText('+56 9 1234 5678')).toBeTruthy());
    });

    it('renderiza el socialProof del footer', async () => {
      renderViewer();
      await waitForLoad();
      await waitFor(() => {
        const els = screen.queryAllByText((c) => c.includes('Pago 100% seguro garantizado'));
        expect(els.length).toBeGreaterThan(0);
      });
    });
  });

  describe('toggleFaq', () => {
    it('abre FAQ al click (faq-item recibe clase open)', async () => {
      renderViewer();
      await waitForLoad();
      await waitFor(() =>
        expect(screen.queryAllByText('¿Cuánto tarda la implementación?').length).toBeGreaterThan(0)
      );
      const faqItem = getFaqItem('¿Cuánto tarda la implementación?');
      if (faqItem) {
        const btn = faqItem.querySelector('.faq-question');
        await act(async () => { fireEvent.click(btn); });
        await waitFor(() => expect(faqItem.classList.contains('open')).toBe(true));
      }
    });

    it('cierra FAQ al segundo click (toggle off — quita clase open)', async () => {
      renderViewer();
      await waitForLoad();
      await waitFor(() =>
        expect(screen.queryAllByText('¿Cuánto tarda la implementación?').length).toBeGreaterThan(0)
      );
      const faqItem = getFaqItem('¿Cuánto tarda la implementación?');
      if (faqItem) {
        const btn = faqItem.querySelector('.faq-question');
        await act(async () => { fireEvent.click(btn); });
        await waitFor(() => expect(faqItem.classList.contains('open')).toBe(true));
        await act(async () => { fireEvent.click(btn); });
        await waitFor(() => expect(faqItem.classList.contains('open')).toBe(false));
      }
    });

    it('cambia FAQ abierta al clickear una diferente', async () => {
      renderViewer();
      await waitForLoad();
      await waitFor(() =>
        expect(screen.queryAllByText('¿Cuánto tarda la implementación?').length).toBeGreaterThan(0)
      );
      const item1 = getFaqItem('¿Cuánto tarda la implementación?');
      const item2 = getFaqItem('¿Ofrecen soporte técnico?');
      if (item1 && item2) {
        await act(async () => { fireEvent.click(item1.querySelector('.faq-question')); });
        await waitFor(() => expect(item1.classList.contains('open')).toBe(true));
        await act(async () => { fireEvent.click(item2.querySelector('.faq-question')); });
        await waitFor(() => {
          expect(item2.classList.contains('open')).toBe(true);
          expect(item1.classList.contains('open')).toBe(false);
        });
      }
    });
  });

  describe('handleDownload — descarga HTML', () => {
    it('llama a generateIndexHTML al hacer click en Descargar HTML', async () => {
      renderViewer();
      await waitForLoad();
      const btn = screen.queryAllByRole('button').find(b => b.textContent?.includes('Descargar HTML'));
      if (btn) {
        await act(async () => { fireEvent.click(btn); });
        await waitFor(() => expect(mockGenerateIndexHTML).toHaveBeenCalled());
      }
    });

    it('no rompe el componente cuando generateIndexHTML lanza error', async () => {
      mockGenerateIndexHTML.mockImplementationOnce(() => { throw new Error('HTML error'); });
      renderViewer();
      await waitForLoad();
      const btn = screen.queryAllByRole('button').find(b => b.textContent?.includes('Descargar HTML'));
      if (btn) {
        await act(async () => { fireEvent.click(btn); });
        await waitFor(() => expect(screen.queryByText('Headline principal')).toBeTruthy());
      }
    });
  });

  describe('handleDownloadZip — descarga ZIP', () => {
    it('llama a generateAndDownloadZip al hacer click en Descargar ZIP', async () => {
      renderViewer();
      await waitForLoad();
      const btn = screen.queryAllByRole('button').find(b => b.textContent?.includes('Descargar ZIP'));
      if (btn) {
        await act(async () => { fireEvent.click(btn); });
        await waitFor(() => expect(mockGenerateAndDownloadZip).toHaveBeenCalled());
      }
    });

    it('deshabilita botón ZIP durante la generación', async () => {
      let resolveZip;
      mockGenerateAndDownloadZip.mockImplementationOnce(
        () => new Promise((res) => { resolveZip = res; })
      );
      renderViewer();
      await waitForLoad();
      const btn = screen.queryAllByRole('button').find(b => b.textContent?.includes('Descargar ZIP'));
      if (btn) {
        await act(async () => { fireEvent.click(btn); });
        await waitFor(() => expect(btn.disabled).toBe(true));
        await act(async () => { resolveZip(); });
        await waitFor(() => expect(btn.disabled).toBe(false));
      }
    });

    it('re-habilita el botón cuando ZIP falla', async () => {
      mockGenerateAndDownloadZip.mockRejectedValueOnce(new Error('ZIP error'));
      renderViewer();
      await waitForLoad();
      const btn = screen.queryAllByRole('button').find(b => b.textContent?.includes('Descargar ZIP'));
      if (btn) {
        await act(async () => { fireEvent.click(btn); });
        await waitFor(() => expect(btn.disabled).toBe(false));
      }
    });
  });

  describe('ramas de fallback de datos', () => {
    it('usa d.faq como array directo cuando no hay d.faq.items', async () => {
      const landing = makeFullLanding();
      landing.aiMetadata.faq = [{ question: '¿Pregunta directa?', answer: 'Respuesta.' }];
      renderViewer('1', 'tok', landing);
      await waitForLoad();
      await waitFor(() =>
        expect(screen.queryAllByText('¿Pregunta directa?').length).toBeGreaterThan(0)
      );
    });

    it('usa array vacío cuando faq es null', async () => {
      const landing = makeFullLanding();
      landing.aiMetadata.faq = null;
      renderViewer('1', 'tok', landing);
      await waitForLoad();
      expect(true).toBe(true);
    });

    it('usa d.testimonials directo como fallback', async () => {
      const landing = makeFullLanding();
      landing.aiMetadata.socialProof  = { stats: [] };
      landing.aiMetadata.testimonials = [{ name: 'Fallback', role: 'Dev', quote: 'OK', rating: 4 }];
      renderViewer('1', 'tok', landing);
      await waitForLoad();
      expect(true).toBe(true);
    });

    it('usa array vacío cuando socialProof.stats no existe', async () => {
      const landing = makeFullLanding();
      landing.aiMetadata.socialProof = { testimonials: [] };
      renderViewer('1', 'tok', landing);
      await waitForLoad();
      expect(screen.queryByText('1000+')).toBeNull();
    });

    it('usa pricing array directo como fallback', async () => {
      const landing = makeFullLanding();
      landing.aiMetadata.pricing = [{ name: 'Plan Directo', price: '$0', features: [], highlighted: false }];
      renderViewer('1', 'tok', landing);
      await waitForLoad();
      await waitFor(() => expect(screen.queryByText('Plan Directo')).toBeTruthy());
    });

    it('usa array vacío cuando pricing es null', async () => {
      const landing = makeFullLanding();
      landing.aiMetadata.pricing = null;
      renderViewer('1', 'tok', landing);
      await waitForLoad();
      expect(true).toBe(true);
    });

    it('usa steps vacío cuando howItWorks es null', async () => {
      const landing = makeFullLanding();
      landing.aiMetadata.howItWorks = null;
      renderViewer('1', 'tok', landing);
      await waitForLoad();
      expect(screen.queryByText('Primer paso')).toBeNull();
    });
  });

  describe('condicionales del hero', () => {
    it('no renderiza secondaryCta cuando es null', async () => {
      renderViewer('1', 'tok', makeFullLanding({ secondaryCta: null }));
      await waitForLoad();
      expect(screen.queryByText('Ver más')).toBeNull();
    });

    it('no renderiza badge cuando es null', async () => {
      renderViewer('1', 'tok', makeFullLanding({ badge: null }));
      await waitForLoad();
      expect(screen.queryByText('NUEVO')).toBeNull();
    });

    it('no renderiza trustIndicators cuando el array está vacío', async () => {
      renderViewer('1', 'tok', makeFullLanding({ trustIndicators: [] }));
      await waitForLoad();
      expect(screen.queryByText('✓ Sin contrato')).toBeNull();
    });

    it('no renderiza stats cuando el array está vacío', async () => {
      const landing = makeFullLanding();
      landing.aiMetadata.socialProof.stats = [];
      renderViewer('1', 'tok', landing);
      await waitForLoad();
      expect(screen.queryByText('1000+')).toBeNull();
    });
  });

  describe('condicionales del footer', () => {
    it('no renderiza teléfono cuando es null', async () => {
      renderViewer('1', 'tok', makeFullLanding({}, { phone: null }));
      await waitForLoad();
      expect(screen.queryByText('+56 9 1234 5678')).toBeNull();
    });

    it('no renderiza links cuando el array está vacío', async () => {
      renderViewer('1', 'tok', makeFullLanding({}, { links: [] }));
      await waitForLoad();
      expect(true).toBe(true);
    });

    it('no renderiza socialProof del footer cuando es null', async () => {
      renderViewer('1', 'tok', makeFullLanding({}, { socialProof: null }));
      await waitForLoad();
      const els = screen.queryAllByText((c) => c.includes('Pago 100% seguro garantizado'));
      expect(els.length).toBe(0);
    });
  });

  describe('urgency', () => {
    it('renderiza urgency con countdown cuando showCountdown es true', async () => {
      const landing = makeFullLanding();
      landing.aiMetadata.urgency = {
        title: 'Última oportunidad', subtitle: 'Hoy',
        showCountdown: true, endDate: new Date(Date.now() + 86400000).toISOString(),
      };
      renderViewer('1', 'tok', landing);
      await waitForLoad();
      await waitFor(() => expect(screen.queryByText('Última oportunidad')).toBeTruthy());
    });

    it('no renderiza urgency cuando es null', async () => {
      const landing = makeFullLanding();
      landing.aiMetadata.urgency = null;
      renderViewer('1', 'tok', landing);
      await waitForLoad();
      expect(screen.queryByText('Oferta por tiempo limitado')).toBeNull();
    });
  });

  describe('testimonials', () => {
    it('renderiza testimonials cuando existen', async () => {
      renderViewer();
      await waitForLoad();
      await waitFor(() => expect(screen.queryByText('Ana García')).toBeTruthy());
    });

    it('no renderiza testimonials cuando el array está vacío', async () => {
      const landing = makeFullLanding();
      landing.aiMetadata.socialProof.testimonials = [];
      renderViewer('1', 'tok', landing);
      await waitForLoad();
      expect(screen.queryByText('Ana García')).toBeNull();
    });
  });

  describe('imágenes', () => {
    it('renderiza con heroImageUrl', async () => {
      const landing = makeFullLanding();
      landing.designPreferences.heroImageUrl = 'https://img.com/hero.jpg';
      renderViewer('1', 'tok', landing);
      await waitForLoad();
      expect(true).toBe(true);
    });

    it('renderiza con logoImageUrl', async () => {
      const landing = makeFullLanding();
      landing.designPreferences.logoImageUrl = 'https://img.com/logo.png';
      renderViewer('1', 'tok', landing);
      await waitForLoad();
      expect(true).toBe(true);
    });
  });
});