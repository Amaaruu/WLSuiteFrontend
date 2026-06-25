import { describe, it, expect } from 'vitest';
import { generateIndexHTML, generateStylesCSS } from './exportProject';

const makeTheme = (overrides = {}) => ({
  primaryColor:   '#1e3a5f',
  primaryDark:    '#152c47',
  primaryLight:   '#e8eef5',
  primaryMedium:  '#7a9bbf',
  primaryText:    '#ffffff',
  primaryRgb:     '30,58,95',
  secondaryColor: '#3b82f6',
  bgPrimary:      '#ffffff',
  bgSecondary:    '#f8f9fc',
  bgCard:         '#ffffff',
  bgTertiary:     '#f0f2f8',
  cardBorder:     '#e4e6f0',
  cardBg:         '#ffffff',
  textBase:       '#0a0a1a',
  textMuted:      '#52526a',
  isDark:         false,
  fontFamily:     '"Inter", sans-serif',
  fontImport:     'https://fonts.googleapis.com/css2?family=Inter&display=swap',
  buttonShape:    'redondeado',
  animationLevel: 'sutil',
  visualStyle:    'moderno',
  scrollEffect:   'fade-in',
  ...overrides,
});

const minLanding = {
  hero:        { headline: 'Headline', subheadline: 'Sub', ctaButton: 'CTA', badge: null, trustIndicators: [] },
  features:    [],
  howItWorks:  { steps: [] },
  socialProof: { testimonials: [], stats: [] },
  pricing:     { plans: [] },
  faq:         { items: [] },
  urgency:     null,
  footer:      null,
};

const fullLanding = {
  hero: {
    headline:        'La mejor solución',
    subheadline:     'Rápido, seguro y confiable',
    ctaButton:       'Empieza gratis',
    badge:           '🚀 Nuevo',
    trustIndicators: ['SSL', 'GDPR'],
  },
  features: [
    { title: 'Velocidad', description: 'Ultra rápido',  icon: '⚡', highlight: true  },
    { title: 'Seguridad', description: 'Datos seguros', icon: '🔒', highlight: false },
    { title: 'Soporte',   description: '24/7',          icon: '💬', highlight: false },
  ],
  howItWorks: {
    title:    '¿Cómo funciona?',
    subtitle: 'Solo 3 pasos simples',
    steps: [
      { number: 1, title: 'Regístrate', description: 'Crea tu cuenta en segundos' },
      { number: 2, title: 'Configura',  description: 'Ajusta a tu negocio'        },
      { number: 3, title: 'Lanza',      description: 'Publica al mundo'            },
    ],
  },
  socialProof: {
    testimonials: [
      { name: 'María López', role: 'CEO', text: 'Excelente producto', rating: 5 },
      { name: 'Juan Pérez',  role: 'CTO', text: 'Muy recomendado',    rating: 4 },
    ],
    stats: [
      { number: '1000+', label: 'Clientes',     description: 'En todo el mundo' },
      { number: '99%',   label: 'Satisfacción', description: null               },
    ],
  },
  pricing: {
    plans: [
      {
        name: 'Básico', price: '$9', period: '/mes', highlighted: false,
        description: 'Para empezar',
        benefits:    ['Feature A', 'Feature B'],
        notIncluded: ['Feature C'],
        ctaButton:   'Empezar',
      },
      {
        name: 'Pro', price: '$29', period: null, highlighted: true,
        description: null,
        benefits:    ['Todo lo anterior', 'Feature C'],
        notIncluded: [],
        ctaButton:   null,
      },
    ],
  },
  faq: {
    title:    'FAQ',
    subtitle: 'Respondemos tus dudas',
    items: [
      { question: '¿Es seguro?',        answer: 'Sí, 100% seguro'     },
      { question: '¿Hay soporte 24/7?', answer: 'Sí, siempre estamos' },
    ],
  },
  urgency: {
    title:         'Oferta por tiempo limitado',
    subtitle:      'Solo hasta el viernes',
    badge:         '🔥 HOT',
    countdown:     { enabled: true, label: 'La oferta termina en:' },
    benefitsList:  ['Ahorro del 50%', 'Bonus exclusivo'],
    ctaButton:     '¡Aprovecha ahora!',
    supportingText:'Sin compromisos',
  },
  cta: {
    title:        '¿Listo para empezar?',
    subtitle:     'Únete a miles de clientes satisfechos',
    ctaButton:    'Comenzar ahora',
    secondaryCta: 'Saber más',
    trustText:    'Pago 100% seguro',
  },
  footer: {
    description: 'La mejor plataforma de landing pages',
    contact:     'info@ejemplo.com',
    phone:       '+56 9 1234 5678',
    links: [
      { label: 'Inicio',   href: '#hero'    },
      { label: 'Contacto', href: '#contact' },
      { label: 'Sin href', href: null       },
    ],
    legalText:   'Todos los derechos reservados.',
    socialProof: 'Más de 1000 clientes confían en nosotros',
  },
};

describe('generateIndexHTML — cobertura de branches', () => {

  describe('hero', () => {
    it('incluye el badge cuando está presente', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('🚀 Nuevo');
    });

    it('no incluye badge cuando es null', () => {
      const html = generateIndexHTML(minLanding, makeTheme(), 'Mi Marca');
      expect(html).not.toContain('badge-white');
    });

    it('incluye trustIndicators cuando están presentes', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('SSL');
    });
  });

  describe('features', () => {
    it('incluye features cuando hay items', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('Velocidad');
      expect(html).toContain('Seguridad');
    });

    it('feature con highlight tiene clase feature-highlight', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('feature-highlight');
    });

    it('no incluye sección features cuando el array está vacío', () => {
      const html = generateIndexHTML(minLanding, makeTheme(), 'Mi Marca');
      expect(html).not.toContain('¿Por qué elegir');
    });
  });

  describe('howItWorks', () => {
    it('incluye sección de pasos cuando hay steps', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('Regístrate');
      expect(html).toContain('Configura');
    });

    it('incluye subtitle de howItWorks cuando está presente', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('Solo 3 pasos simples');
    });

    it('incluye steps-line cuando hay más de 1 paso', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('steps-line');
    });

    it('no incluye sección howItWorks cuando steps está vacío', () => {
      const html = generateIndexHTML(minLanding, makeTheme(), 'Mi Marca');
      expect(html).not.toContain('steps-line');
    });
  });

  describe('testimonials y stats', () => {
    it('incluye testimonios cuando hay datos', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('María López');
      expect(html).toContain('Juan Pérez');
    });

    it('incluye stat con description cuando está presente', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('En todo el mundo');
    });

    it('incluye el label del stat sin description', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('Satisfacción');
    });

    it('no incluye stat-desc cuando description es null', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      const matches = (html.match(/stat-desc/g) || []).length;
      expect(matches).toBe(1);
    });

    it('no incluye sección testimonios cuando arrays están vacíos', () => {
      const html = generateIndexHTML(minLanding, makeTheme(), 'Mi Marca');
      expect(html).not.toContain('testimonials-grid');
    });
  });

  describe('pricing', () => {
    it('incluye planes de precio cuando hay datos', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('Básico');
      expect(html).toContain('Pro');
    });

    it('incluye description del plan cuando está presente', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('Para empezar');
    });

    it('incluye period del plan cuando está presente', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('/mes');
    });

    it('incluye benefits y notIncluded del plan', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('Feature A');
      expect(html).toContain('Feature C');
    });

    it('no incluye sección pricing cuando plans está vacío', () => {
      const html = generateIndexHTML(minLanding, makeTheme(), 'Mi Marca');
      expect(html).not.toContain('pricing-price');
    });
  });

  describe('faq', () => {
    it('incluye preguntas del FAQ cuando hay items', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('¿Es seguro?');
      expect(html).toContain('¿Hay soporte 24/7?');
    });

    it('incluye subtitle del FAQ cuando está presente', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('Respondemos tus dudas');
    });

    it('no incluye sección FAQ cuando items está vacío', () => {
      const html = generateIndexHTML(minLanding, makeTheme(), 'Mi Marca');
      expect(html).not.toContain('faq-question');
    });
  });

  describe('urgency', () => {
    it('incluye sección urgency cuando está presente', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('Oferta por tiempo limitado');
    });

    it('incluye badge de urgency cuando está presente', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('🔥 HOT');
    });

    it('incluye subtitle de urgency cuando está presente', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('Solo hasta el viernes');
    });

    it('incluye countdown cuando está habilitado', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('countdown-timer');
      expect(html).toContain('La oferta termina en:');
    });

    it('incluye benefitsList cuando hay items', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('Ahorro del 50%');
      expect(html).toContain('Bonus exclusivo');
    });

    it('incluye supportingText cuando está presente', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('Sin compromisos');
    });

    it('no incluye sección urgency cuando es null', () => {
      const html = generateIndexHTML(minLanding, makeTheme(), 'Mi Marca');
      expect(html).not.toContain('urgency-section');
    });

    it('urgency sin badge no incluye el badge específico', () => {
      const landing = {
        ...fullLanding,
        urgency: { ...fullLanding.urgency, badge: null },
      };
      const html = generateIndexHTML(landing, makeTheme(), 'Mi Marca');
      expect(html).not.toContain('🔥 HOT');
      expect(html).toContain('Oferta por tiempo limitado');
    });

    it('urgency sin countdown no incluye countdown-timer', () => {
      const landing = {
        ...fullLanding,
        urgency: { ...fullLanding.urgency, countdown: { enabled: false } },
      };
      const html = generateIndexHTML(landing, makeTheme(), 'Mi Marca');
      expect(html).not.toContain('countdown-timer');
    });

    it('urgency sin benefitsList no incluye urgency-benefits', () => {
      const landing = {
        ...fullLanding,
        urgency: { ...fullLanding.urgency, benefitsList: [] },
      };
      const html = generateIndexHTML(landing, makeTheme(), 'Mi Marca');
      expect(html).not.toContain('urgency-benefits');
    });
  });

  describe('cta', () => {
    it('incluye sección CTA cuando está presente', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('¿Listo para empezar?');
    });

    it('incluye secondaryCta cuando está presente', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('Saber más');
    });

    it('incluye trustText cuando está presente', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('Pago 100% seguro');
    });

    it('no incluye sección CTA cuando es null', () => {
      const html = generateIndexHTML(minLanding, makeTheme(), 'Mi Marca');
      expect(html).not.toContain('id="contact"');
    });
  });

  describe('footer', () => {
    it('incluye footer cuando está presente', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('footer-section');
    });

    it('incluye contact del footer cuando está presente', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('info@ejemplo.com');
    });

    it('incluye phone cuando está presente', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('+56 9 1234 5678');
    });

    it('incluye links de navegación del footer', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('Navegación');
      expect(html).toContain('Inicio');
    });

    it('link sin href usa # como fallback', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('href="#"');
    });

    it('incluye socialProof del footer cuando está presente', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca');
      expect(html).toContain('Más de 1000 clientes');
    });

    it('no incluye footer cuando es null', () => {
      const html = generateIndexHTML(minLanding, makeTheme(), 'Mi Marca');
      expect(html).not.toContain('footer-section');
    });
  });

  describe('generateStylesCSS — buttonShape', () => {
    it('genera estilos con buttonShape cuadrado', () => {
      const css = generateStylesCSS(makeTheme({ buttonShape: 'cuadrado' }));
      expect(css).toContain('6px');
    });

    it('genera estilos con buttonShape pildora', () => {
      const css = generateStylesCSS(makeTheme({ buttonShape: 'pildora' }));
      expect(css).toContain('9999px');
    });

    it('genera estilos con buttonShape redondeado', () => {
      const css = generateStylesCSS(makeTheme({ buttonShape: 'redondeado' }));
      expect(css).toContain('12px');
    });

    it('genera estilos con buttonShape desconocido (fallback)', () => {
      const css = generateStylesCSS(makeTheme({ buttonShape: 'desconocido' }));
      expect(css).toContain('12px');
    });

    it('genera estilos en modo oscuro', () => {
      const css = generateStylesCSS(makeTheme({ isDark: true, bgPrimary: '#111827' }));
      expect(css).toBeTruthy();
      expect(css.length).toBeGreaterThan(100);
    });

    it('genera CSS válido independientemente de si hay imagen hero', () => {
      const cssConImagen = generateStylesCSS(
        makeTheme(),
        { heroImageUrl: 'https://example.com/hero.jpg' }
      );
      const cssSinImagen = generateStylesCSS(makeTheme(), {});
      expect(typeof cssConImagen).toBe('string');
      expect(cssConImagen.length).toBeGreaterThan(100);
      expect(typeof cssSinImagen).toBe('string');
      expect(cssConImagen).toContain('hero-img-overlay');
    });
  });

  describe('inlineAssets', () => {
    it('usa <style> inline cuando inlineAssets es true', () => {
      const html = generateIndexHTML(minLanding, makeTheme(), 'Mi Marca', {}, true);
      expect(html).toContain('<style>');
      expect(html).not.toContain('href="styles.css"');
    });

    it('usa <link> externo cuando inlineAssets es false', () => {
      const html = generateIndexHTML(minLanding, makeTheme(), 'Mi Marca', {}, false);
      expect(html).toContain('href="styles.css"');
    });

    it('usa <script> inline cuando inlineAssets es true', () => {
      const html = generateIndexHTML(minLanding, makeTheme(), 'Mi Marca', {}, true);
      expect(html).toContain('<script>');
    });
  });

  describe('imágenes', () => {
    it('incluye heroImageUrl en el HTML cuando está presente', () => {
      const html = generateIndexHTML(
        fullLanding, makeTheme(), 'Mi Marca',
        { heroImageUrl: 'https://example.com/hero.jpg' }
      );
      expect(html).toContain('hero.jpg');
    });

    it('incluye logoImageUrl en el HTML cuando está presente', () => {
      const html = generateIndexHTML(
        fullLanding, makeTheme(), 'Mi Marca',
        { logoImageUrl: 'https://example.com/logo.png' }
      );
      expect(html).toContain('logo.png');
    });

    it('fallback sin imágenes genera HTML válido', () => {
      const html = generateIndexHTML(fullLanding, makeTheme(), 'Mi Marca', {});
      expect(html).toContain('<!DOCTYPE html>');
    });
  });

  describe('socialProof formato alternativo', () => {
    it('soporta testimonials directamente en d.testimonials', () => {
      const landing = {
        ...minLanding,
        socialProof: undefined,
        testimonials: [{ name: 'Ana', role: 'Dev', text: 'Genial', rating: 5 }],
      };
      const html = generateIndexHTML(landing, makeTheme(), 'Mi Marca');
      expect(html).toBeTruthy();
    });

    it('soporta pricing como array directo (no objeto con plans)', () => {
      const landing = {
        ...minLanding,
        pricing: [{ name: 'Plan X', price: '$5', benefits: [], notIncluded: [] }],
      };
      const html = generateIndexHTML(landing, makeTheme(), 'Mi Marca');
      expect(html).toBeTruthy();
    });

    it('soporta faq como array directo (no objeto con items)', () => {
      const landing = {
        ...minLanding,
        faq: [{ question: '¿Pregunta?', answer: 'Respuesta' }],
      };
      const html = generateIndexHTML(landing, makeTheme(), 'Mi Marca');
      expect(html).toContain('¿Pregunta?');
    });
  });
});