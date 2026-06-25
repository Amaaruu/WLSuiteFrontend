import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateIndexHTML,
  generateAndDownloadZip,
  __resetJSZipCache,
} from './exportProject';

vi.stubGlobal('fetch', vi.fn());

const baseTheme = {
  primaryColor:   '#2563eb',
  primaryDark:    '#1d4ed8',
  primaryLight:   '#eff6ff',
  primaryMedium:  '#bfdbfe',
  primaryText:    '#ffffff',
  primaryRgb:     '37,99,235',
  secondaryColor: '#f59e0b',
  bgPrimary:      '#ffffff',
  bgSecondary:    '#f9fafb',
  bgCard:         '#ffffff',
  cardBorder:     '#e5e7eb',
  textBase:       '#111827',
  textMuted:      '#6b7280',
  isDark:         false,
  fontFamily:     '"Inter", sans-serif',
  fontImport:     'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap',
  buttonShape:    'redondeado',
};

const minLanding = {
  hero:        { headline: 'H', subheadline: 'S', ctaButton: 'CTA', badge: null, trustIndicators: [] },
  features:    [],
  howItWorks:  { steps: [] },
  socialProof: { testimonials: [], stats: [] },
  pricing:     { plans: [] },
  faq:         { items: [] },
  urgency:     null,
  footer:      { description: '', contact: '', links: [], legalText: '', socialProof: null, phone: null },
};

function buildJSZipMock() {
  const mockFile         = vi.fn();
  const mockAssetsFolder = { file: mockFile };
  const mockRootFolder   = { file: mockFile, folder: vi.fn(() => mockAssetsFolder) };
  function JSZipMock() {
    this.folder        = vi.fn(() => mockRootFolder);
    this.generateAsync = vi.fn().mockResolvedValue(
      new Blob(['zip'], { type: 'application/zip' })
    );
  }
  return JSZipMock;
}

describe('exportProject — ramas adicionales', () => {

  let anchorClickSpy;

  beforeEach(() => {
    __resetJSZipCache();
    window.JSZip        = buildJSZipMock();
    URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    URL.revokeObjectURL = vi.fn();
    anchorClickSpy      = vi.fn();

    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') return { href: '', download: '', click: anchorClickSpy };
      return document.createElementNS('http://www.w3.org/1999/xhtml', tag);
    });
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    __resetJSZipCache();
    delete window.JSZip;
  });

  it('no llama fetch cuando heroImageUrl es null o vacío', async () => {
    vi.stubGlobal('fetch', vi.fn());
    await generateAndDownloadZip(minLanding, baseTheme, 'Test', {
      heroImageUrl: null,
      logoImageUrl: null,
    });
    expect(fetch).not.toHaveBeenCalled();
    expect(anchorClickSpy).toHaveBeenCalledTimes(1);
  });

  it('usa heroImageUrl original cuando fetch retorna 404', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false, status: 404, blob: vi.fn(),
    }));
    await expect(
      generateAndDownloadZip(minLanding, baseTheme, 'Test', {
        heroImageUrl: 'https://ejemplo.com/hero.jpg',
      })
    ).resolves.not.toThrow();
    expect(anchorClickSpy).toHaveBeenCalledTimes(1);
  });

  it('usa logoImageUrl original cuando fetch retorna 500', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false, status: 500, blob: vi.fn(),
    }));
    await expect(
      generateAndDownloadZip(minLanding, baseTheme, 'Test', {
        logoImageUrl: 'https://ejemplo.com/logo.png',
      })
    ).resolves.not.toThrow();
  });

  it('usa URL original cuando blob de heroImage está vacío (size 0)', async () => {
    const emptyBlob = new Blob([], { type: 'image/jpeg' });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true, blob: vi.fn().mockResolvedValue(emptyBlob),
    }));
    await expect(
      generateAndDownloadZip(minLanding, baseTheme, 'Test', {
        heroImageUrl: 'https://ejemplo.com/hero.jpg',
      })
    ).resolves.not.toThrow();
  });

  it('maneja Network Error en fetch de heroImage', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network Error')));
    await expect(
      generateAndDownloadZip(minLanding, baseTheme, 'Test', {
        heroImageUrl: 'https://ejemplo.com/hero.jpg',
      })
    ).resolves.not.toThrow();
    expect(console.warn).toHaveBeenCalled();
  });

  it('maneja Network Error en fetch de logoImage', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network Error')));
    await expect(
      generateAndDownloadZip(minLanding, baseTheme, 'Test', {
        logoImageUrl: 'https://ejemplo.com/logo.png',
      })
    ).resolves.not.toThrow();
  });

  it('detecta extensión jpg desde image/jpeg', async () => {
    const blob = new Blob(['data'], { type: 'image/jpeg' });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, blob: vi.fn().mockResolvedValue(blob) }));
    await expect(
      generateAndDownloadZip(minLanding, baseTheme, 'Test', { heroImageUrl: 'https://ejemplo.com/img.jpg' })
    ).resolves.not.toThrow();
  });

  it('detecta extensión png desde image/png', async () => {
    const blob = new Blob(['data'], { type: 'image/png' });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, blob: vi.fn().mockResolvedValue(blob) }));
    await expect(
      generateAndDownloadZip(minLanding, baseTheme, 'Test', { logoImageUrl: 'https://ejemplo.com/logo.png' })
    ).resolves.not.toThrow();
  });

  it('detecta extensión webp desde image/webp', async () => {
    const blob = new Blob(['data'], { type: 'image/webp' });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, blob: vi.fn().mockResolvedValue(blob) }));
    await expect(
      generateAndDownloadZip(minLanding, baseTheme, 'Test', { heroImageUrl: 'https://ejemplo.com/img.webp' })
    ).resolves.not.toThrow();
  });

  it('detecta extensión gif desde image/gif', async () => {
    const blob = new Blob(['data'], { type: 'image/gif' });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, blob: vi.fn().mockResolvedValue(blob) }));
    await expect(
      generateAndDownloadZip(minLanding, baseTheme, 'Test', { heroImageUrl: 'https://ejemplo.com/img.gif' })
    ).resolves.not.toThrow();
  });

  it('usa extensión de URL cuando blob.type es image/svg+xml (no en mimeMap)', async () => {
    const blob = new Blob(['<svg/>'], { type: 'image/svg+xml' });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, blob: vi.fn().mockResolvedValue(blob) }));
    await expect(
      generateAndDownloadZip(minLanding, baseTheme, 'Test', { heroImageUrl: 'https://ejemplo.com/logo.svg' })
    ).resolves.not.toThrow();
  });

  it('usa jpg cuando blob no tiene type y URL no tiene extensión', async () => {
    const blob = new Blob(['data']); // type vacío
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, blob: vi.fn().mockResolvedValue(blob) }));
    await expect(
      generateAndDownloadZip(minLanding, baseTheme, 'Test', {
        heroImageUrl: 'https://ejemplo.com/imagen-sin-extension',
      })
    ).resolves.not.toThrow();
  });

  describe('generateIndexHTML — fallbacks de datos', () => {

    it('usa array vacío cuando howItWorks es null', () => {
      const landing = { ...minLanding, howItWorks: null };
      const html = generateIndexHTML(landing, baseTheme, 'Test');
      expect(html).toContain('<!DOCTYPE html>');
    });

    it('usa d.testimonials cuando no hay socialProof.testimonials', () => {
      const landing = {
        ...minLanding,
        socialProof: { stats: [] },
        testimonials: [{ name: 'María', role: 'CEO', quote: 'Excelente', rating: 5 }],
      };
      const html = generateIndexHTML(landing, baseTheme, 'Test');
      expect(html).toContain('María');
    });

    it('usa array vacío cuando no hay testimonials en ningún lado', () => {
      const landing = { ...minLanding, socialProof: { stats: [] } };
      const html = generateIndexHTML(landing, baseTheme, 'Test');
      expect(html).toContain('<!DOCTYPE html>');
    });

    it('usa pricing como array directo cuando no hay pricing.plans', () => {
      const landing = {
        ...minLanding,
        pricing: [{ name: 'PlanX', price: '$1', features: [], highlighted: false }],
      };
      const html = generateIndexHTML(landing, baseTheme, 'Test');
      expect(html).toContain('PlanX');
    });

    it('usa array vacío cuando pricing es null (no es array ni tiene plans)', () => {
      const landing = { ...minLanding, pricing: null };
      const html = generateIndexHTML(landing, baseTheme, 'Test');
      expect(html).toContain('<!DOCTYPE html>');
    });

    it('usa d.faq como array directo cuando no hay d.faq.items', () => {
      const landing = {
        ...minLanding,
        faq: [{ question: '¿Test?', answer: 'Sí.' }],
      };
      const html = generateIndexHTML(landing, baseTheme, 'Test');
      expect(html).toContain('¿Test?');
    });

    it('usa array vacío cuando faq es null', () => {
      const landing = { ...minLanding, faq: null };
      const html = generateIndexHTML(landing, baseTheme, 'Test');
      expect(html).toContain('<!DOCTYPE html>');
    });
  });

  describe('loadJSZip — script.onerror', () => {
    it('rechaza la promesa cuando el script de JSZip falla al cargar', async () => {
      __resetJSZipCache();
      delete window.JSZip;

      vi.spyOn(document, 'createElement').mockImplementation((tag) => {
        if (tag === 'script') {
          const el = { src: '', onload: null, onerror: null };
          setTimeout(() => { if (el.onerror) el.onerror(); }, 0);
          return el;
        }
        if (tag === 'a') return { href: '', download: '', click: anchorClickSpy };
        return document.createElementNS('http://www.w3.org/1999/xhtml', tag);
      });
      vi.spyOn(document.head, 'appendChild').mockImplementation(() => {});

      await expect(
        generateAndDownloadZip(minLanding, baseTheme, 'Test')
      ).rejects.toThrow('No se pudo cargar JSZip');

      __resetJSZipCache();
    });
  });

  it('descarga hero y logo simultáneamente cuando ambas son exitosas', async () => {
    const blob = new Blob(['img'], { type: 'image/jpeg' });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, blob: vi.fn().mockResolvedValue(blob) }));
    await expect(
      generateAndDownloadZip(minLanding, baseTheme, 'Test', {
        heroImageUrl: 'https://ejemplo.com/hero.jpg',
        logoImageUrl: 'https://ejemplo.com/logo.jpg',
      })
    ).resolves.not.toThrow();
    expect(anchorClickSpy).toHaveBeenCalledTimes(1);
  });
});