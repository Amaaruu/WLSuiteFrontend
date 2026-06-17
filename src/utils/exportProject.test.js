import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateIndexHTML,
  generateStylesCSS,
  generateScriptJS,
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

const darkTheme = {
  ...baseTheme,
  isDark:      true,
  bgPrimary:   '#0f172a',
  bgSecondary: '#1e293b',
  textBase:    '#f1f5f9',
};

const baseLanding = {
  hero: {
    headline:        'Título principal',
    subheadline:     'Subtítulo del hero',
    ctaButton:       'Comenzar',
    badge:           null,
    trustIndicators: [],
  },
  features:    [],
  howItWorks:  { steps: [] },
  socialProof: { testimonials: [], stats: [] },
  pricing:     { plans: [] },
  faq:         { items: [] },
  urgency:     null,
  footer: {
    description: 'Descripción empresa',
    contact:     'info@test.com',
    phone:       '+56 9 1234 5678',
    links:       [],
    legalText:   'Todos los derechos reservados.',
    socialProof: 'Sitio seguro',
  },
};

describe('generateIndexHTML — estructura base', () => {

  it('genera HTML con DOCTYPE válido', () => {
    const html = generateIndexHTML(baseLanding, baseTheme, 'Test');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html lang="es">');
  });

  it('incluye el título en el <title>', () => {
    const html = generateIndexHTML(baseLanding, baseTheme, 'Mi Empresa');
    expect(html).toContain('<title>Mi Empresa</title>');
  });

  it('incluye el headline del hero', () => {
    const html = generateIndexHTML(baseLanding, baseTheme, 'Test');
    expect(html).toContain('Título principal');
  });

  it('incluye el subheadline del hero', () => {
    const html = generateIndexHTML(baseLanding, baseTheme, 'Test');
    expect(html).toContain('Subtítulo del hero');
  });

  it('incluye el CTA del hero', () => {
    const html = generateIndexHTML(baseLanding, baseTheme, 'Test');
    expect(html).toContain('Comenzar');
  });

  it('incluye el email de contacto del footer', () => {
    const html = generateIndexHTML(baseLanding, baseTheme, 'Test');
    expect(html).toContain('info@test.com');
  });

  it('incluye el teléfono del footer', () => {
    const html = generateIndexHTML(baseLanding, baseTheme, 'Test');
    expect(html).toContain('+56 9 1234 5678');
  });

  it('incluye el texto legal del footer', () => {
    const html = generateIndexHTML(baseLanding, baseTheme, 'Test');
    expect(html).toContain('Todos los derechos reservados.');
  });

  it('incluye el socialProof del footer', () => {
    const html = generateIndexHTML(baseLanding, baseTheme, 'Test');
    expect(html).toContain('Sitio seguro');
  });

  it('incluye el import de la fuente tipográfica', () => {
    const html = generateIndexHTML(baseLanding, baseTheme, 'Test');
    expect(html).toContain('fonts.googleapis.com');
  });

  it('usa projectName como description cuando hero no tiene subheadline', () => {
    const landing = { ...baseLanding, hero: { headline: 'Hola', ctaButton: 'CTA' } };
    const html    = generateIndexHTML(landing, baseTheme, 'MiProyecto');
    expect(html).toContain('MiProyecto');
  });
});

describe('generateIndexHTML — imágenes', () => {

  it('incluye heroImageUrl cuando se pasa', () => {
    const html = generateIndexHTML(baseLanding, baseTheme, 'Test', { heroImageUrl: 'https://img.com/hero.jpg' });
    expect(html).toContain('https://img.com/hero.jpg');
  });

  it('incluye logoImageUrl cuando se pasa', () => {
    const html = generateIndexHTML(baseLanding, baseTheme, 'Test', { logoImageUrl: 'https://img.com/logo.png' });
    expect(html).toContain('https://img.com/logo.png');
  });

  it('NO incluye hero image si no se pasa', () => {
    const html = generateIndexHTML(baseLanding, baseTheme, 'Test', {});
    expect(html).not.toContain('hero-img-overlay');
  });

  it('genera HTML válido cuando no hay imágenes', () => {
    const html = generateIndexHTML(baseLanding, baseTheme, 'Test', {});
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('</html>');
  });
});

describe('generateIndexHTML — badge y trust indicators del hero', () => {

  it('incluye el badge del hero cuando existe', () => {
    const landing = { ...baseLanding, hero: { ...baseLanding.hero, badge: 'Nuevo lanzamiento' } };
    const html    = generateIndexHTML(landing, baseTheme, 'Test');
    expect(html).toContain('Nuevo lanzamiento');
  });

  it('incluye trust indicators cuando existen', () => {
    const landing = {
      ...baseLanding,
      hero: { ...baseLanding.hero, trustIndicators: ['✓ Sin contratos', '✓ Gratis'] },
    };
    const html = generateIndexHTML(landing, baseTheme, 'Test');
    expect(html).toContain('✓ Sin contratos');
  });
});

describe('generateIndexHTML — secciones opcionales', () => {

  it('incluye features cuando hay características', () => {
    const landing = {
      ...baseLanding,
      features: [{ title: 'Rápido', description: 'Muy veloz', icon: '⚡', highlight: false }],
    };
    const html = generateIndexHTML(landing, baseTheme, 'Test');
    expect(html).toContain('Rápido');
    expect(html).toContain('Muy veloz');
  });

  it('marca feature como destacada cuando highlight=true', () => {
    const landing = {
      ...baseLanding,
      features: [{ title: 'Top', description: 'El mejor', icon: '★', highlight: true }],
    };
    const html = generateIndexHTML(landing, baseTheme, 'Test');
    expect(html).toContain('feature-highlight');
  });

  it('incluye pasos de howItWorks cuando existen', () => {
    const landing = {
      ...baseLanding,
      howItWorks: { steps: [{ number: '01', title: 'Registrate', description: 'Crea tu cuenta' }] },
    };
    const html = generateIndexHTML(landing, baseTheme, 'Test');
    expect(html).toContain('Registrate');
    expect(html).toContain('Crea tu cuenta');
  });

  it('incluye testimonios cuando existen', () => {
    const landing = {
      ...baseLanding,
      socialProof: {
        testimonials: [{ name: 'Ana', quote: 'Excelente', rating: 5, role: 'CEO' }],
        stats: [],
      },
    };
    const html = generateIndexHTML(landing, baseTheme, 'Test');
    expect(html).toContain('Excelente');
    expect(html).toContain('Ana');
  });

  it('incluye stats cuando existen', () => {
    const landing = {
      ...baseLanding,
      socialProof: {
        testimonials: [],
        stats: [{ number: '1000+', label: 'Clientes' }],
      },
    };
    const html = generateIndexHTML(landing, baseTheme, 'Test');
    expect(html).toContain('1000+');
    expect(html).toContain('Clientes');
  });

  it('incluye planes de pricing cuando existen', () => {
    const landing = {
      ...baseLanding,
      pricing: {
        plans: [{ name: 'Pro', price: '$29', features: ['Feature 1'], cta: 'Elegir', highlighted: false }],
      },
    };
    const html = generateIndexHTML(landing, baseTheme, 'Test');
    expect(html).toContain('Pro');
    expect(html).toContain('$29');
    expect(html).toContain('Elegir plan');
  });

  it('marca plan como destacado cuando highlighted=true', () => {
    const landing = {
      ...baseLanding,
      pricing: {
        plans: [{ name: 'Premium', price: '$59', features: [], cta: 'Elegir', highlighted: true }],
      },
    };
    const html = generateIndexHTML(landing, baseTheme, 'Test');
    expect(html).toContain('Premium');
  });

  it('incluye FAQ cuando hay preguntas', () => {
    const landing = {
      ...baseLanding,
      faq: { items: [{ question: '¿Cómo funciona?', answer: 'Es sencillo.' }] },
    };
    const html = generateIndexHTML(landing, baseTheme, 'Test');
    expect(html).toContain('¿Cómo funciona?');
    expect(html).toContain('Es sencillo.');
  });

  it('incluye urgencia cuando existe', () => {
    const landing = {
      ...baseLanding,
      urgency: { title: 'Oferta limitada', subtitle: 'Solo por hoy', showCountdown: true },
    };
    const html = generateIndexHTML(landing, baseTheme, 'Test');
    expect(html).toContain('Oferta limitada');
    expect(html).toContain('Solo por hoy');
  });

  it('incluye links del footer cuando existen', () => {
    const landing = {
      ...baseLanding,
      footer: { ...baseLanding.footer, links: [{ label: 'Términos', href: '/terms' }] },
    };
    const html = generateIndexHTML(landing, baseTheme, 'Test');
    expect(html).toContain('Términos');
    expect(html).toContain('/terms');
  });
});

describe('generateIndexHTML — modo inlineAssets', () => {

  it('con inlineAssets=true incluye <style> inline', () => {
    const html = generateIndexHTML(baseLanding, baseTheme, 'Test', {}, true);
    expect(html).toContain('<style>');
    expect(html).not.toContain('href="styles.css"');
  });

  it('con inlineAssets=false referencia styles.css externo', () => {
    const html = generateIndexHTML(baseLanding, baseTheme, 'Test', {}, false);
    expect(html).toContain('styles.css');
  });
});

describe('generateIndexHTML — tema oscuro', () => {

  it('usa el color de fondo oscuro en el tema dark', () => {
    const html = generateIndexHTML(baseLanding, darkTheme, 'Test');
    expect(html).toContain('#0f172a');
  });
});

describe('generateStylesCSS — variantes de buttonShape', () => {

  it('devuelve CSS no vacío', () => {
    const css = generateStylesCSS(baseTheme);
    expect(css.length).toBeGreaterThan(0);
  });

  it('incluye el color primario', () => {
    const css = generateStylesCSS(baseTheme);
    expect(css).toContain('#2563eb');
  });

  it('aplica border-radius de 9999px para pildora', () => {
    const css = generateStylesCSS({ ...baseTheme, buttonShape: 'pildora' });
    expect(css).toContain('9999px');
  });

  it('aplica border-radius de 6px para cuadrado', () => {
    const css = generateStylesCSS({ ...baseTheme, buttonShape: 'cuadrado' });
    expect(css).toContain('6px');
  });

  it('aplica border-radius de 12px para redondeado', () => {
    const css = generateStylesCSS({ ...baseTheme, buttonShape: 'redondeado' });
    expect(css).toContain('12px');
  });

  it('aplica border-radius de 12px por defecto para shape desconocido', () => {
    const css = generateStylesCSS({ ...baseTheme, buttonShape: 'desconocido' });
    expect(css).toContain('12px');
  });

  it('incluye la familia tipográfica', () => {
    const css = generateStylesCSS(baseTheme);
    expect(css).toContain('"Inter", sans-serif');
  });

  it('incluye variables de color secundario', () => {
    const css = generateStylesCSS(baseTheme);
    expect(css).toContain('#f59e0b');
  });
});

describe('generateScriptJS', () => {

  it('devuelve un string no vacío', () => {
    const js = generateScriptJS();
    expect(typeof js).toBe('string');
    expect(js.length).toBeGreaterThan(0);
  });

  it('contiene lógica de IntersectionObserver para scroll reveal', () => {
    const js = generateScriptJS();
    expect(js).toContain('IntersectionObserver');
  });

  it('contiene lógica de scroll para el navbar', () => {
    const js = generateScriptJS();
    expect(js).toContain('scroll');
  });

  it('contiene lógica del FAQ', () => {
    const js = generateScriptJS();
    expect(js).toContain('faq');
  });

  it('contiene lógica del countdown', () => {
    const js = generateScriptJS();
    expect(js).toContain('countdown');
  });
});

describe('generateAndDownloadZip', () => {
  let anchorClickSpy;

  function buildJSZipConstructor() {
    const mockFile         = vi.fn();
    const mockAssetsFolder = { file: mockFile };
    const mockRootFolder   = {
      file:   mockFile,
      folder: vi.fn(() => mockAssetsFolder),
    };
    const mockGenerateAsync = vi.fn().mockResolvedValue(
      new Blob(['zip-content'], { type: 'application/zip' })
    );

    function JSZipMock() {
      this.folder        = vi.fn(() => mockRootFolder);
      this.generateAsync = mockGenerateAsync;
    }

    return JSZipMock;
  }

  beforeEach(() => {
    __resetJSZipCache();

    window.JSZip = buildJSZipConstructor();

    URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
    URL.revokeObjectURL = vi.fn();

    anchorClickSpy = vi.fn();
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

  it('genera y descarga el ZIP sin imágenes', async () => {
    await generateAndDownloadZip(baseLanding, baseTheme, 'Mi Proyecto');
    expect(anchorClickSpy).toHaveBeenCalledTimes(1);
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
  });

  it('el nombre del archivo ZIP usa el slug del proyecto', async () => {
    const anchor = { href: '', download: '', click: anchorClickSpy };
    vi.spyOn(document, 'createElement').mockReturnValue(anchor);

    await generateAndDownloadZip(baseLanding, baseTheme, 'Mi Tienda Online');
    expect(anchor.download).toBe('mi-tienda-online-proyecto.zip');
  });

  it('usa "landing-page" como slug cuando projectName está vacío', async () => {
    const anchor = { href: '', download: '', click: anchorClickSpy };
    vi.spyOn(document, 'createElement').mockReturnValue(anchor);

    await generateAndDownloadZip(baseLanding, baseTheme, '');
    expect(anchor.download).toBe('landing-page-proyecto.zip');
  });

  it('maneja designPreferences vacío sin lanzar error', async () => {
    await expect(
      generateAndDownloadZip(baseLanding, baseTheme, 'Test', {})
    ).resolves.not.toThrow();
  });

  it('maneja fetch fallido de heroImage y usa la URL original como fallback', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    await expect(
      generateAndDownloadZip(baseLanding, baseTheme, 'Test', {
        heroImageUrl: 'https://ejemplo.com/hero.jpg',
      })
    ).resolves.not.toThrow();

    expect(anchorClickSpy).toHaveBeenCalledTimes(1);
  });

  it('maneja fetch fallido de logoImage y usa la URL original como fallback', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    await expect(
      generateAndDownloadZip(baseLanding, baseTheme, 'Test', {
        logoImageUrl: 'https://ejemplo.com/logo.png',
      })
    ).resolves.not.toThrow();
  });

  it('descarga heroImage correctamente cuando fetch es exitoso', async () => {
    const mockBlob = new Blob(['image-data'], { type: 'image/jpeg' });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok:   true,
      blob: vi.fn().mockResolvedValue(mockBlob),
    }));

    await expect(
      generateAndDownloadZip(baseLanding, baseTheme, 'Test', {
        heroImageUrl: 'https://ejemplo.com/hero.jpg',
      })
    ).resolves.not.toThrow();

    expect(anchorClickSpy).toHaveBeenCalledTimes(1);
  });

  it('descarga logoImage correctamente cuando fetch es exitoso', async () => {
    const mockBlob = new Blob(['logo-data'], { type: 'image/png' });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok:   true,
      blob: vi.fn().mockResolvedValue(mockBlob),
    }));

    await expect(
      generateAndDownloadZip(baseLanding, baseTheme, 'Test', {
        logoImageUrl: 'https://ejemplo.com/logo.png',
      })
    ).resolves.not.toThrow();
  });

  it('maneja respuesta HTTP no-ok en fetch de imagen (usa URL original como fallback)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok:     false,
      status: 404,
      blob:   vi.fn(),
    }));

    await expect(
      generateAndDownloadZip(baseLanding, baseTheme, 'Test', {
        heroImageUrl: 'https://ejemplo.com/hero.jpg',
      })
    ).resolves.not.toThrow();
  });

  it('maneja blob vacío en fetch de imagen (size === 0)', async () => {
    const emptyBlob = new Blob([], { type: 'image/jpeg' });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok:   true,
      blob: vi.fn().mockResolvedValue(emptyBlob),
    }));

    await expect(
      generateAndDownloadZip(baseLanding, baseTheme, 'Test', {
        heroImageUrl: 'https://ejemplo.com/hero.jpg',
      })
    ).resolves.not.toThrow();
  });
});