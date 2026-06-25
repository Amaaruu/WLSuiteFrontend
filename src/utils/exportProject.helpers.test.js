import { describe, it, expect } from 'vitest';
import { generateIndexHTML } from './exportProject';

const makeTheme = (overrides = {}) => ({
  primaryColor:   '#dc2626',
  primaryDark:    '#b91c1c',
  primaryLight:   '#fee2e2',
  primaryMedium:  '#fca5a5',
  primaryText:    '#ffffff',
  primaryRgb:     '220,38,38',
  secondaryColor: '#7c3aed',
  bgPrimary:      '#ffffff',
  bgSecondary:    '#f9fafb',
  bgCard:         '#ffffff',
  cardBorder:     '#e5e7eb',
  textBase:       '#111827',
  textMuted:      '#6b7280',
  isDark:         false,
  fontFamily:     '"Roboto", sans-serif',
  fontImport:     'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
  buttonShape:    'redondeado',
  ...overrides,
});

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

describe('exportProject — ramas de color y tema', () => {

  it('genera HTML con color rojo', () => {
    const html = generateIndexHTML(minLanding, makeTheme(), 'Test');
    expect(html).toContain('#dc2626');
  });

  it('genera HTML en modo oscuro sin errores', () => {
    const html = generateIndexHTML(minLanding, makeTheme({ isDark: true }), 'Test');
    expect(html).toBeTruthy();
  });

  it('hero sin badge no incluye badge-white', () => {
    const html = generateIndexHTML(minLanding, makeTheme(), 'Test');
    expect(html).not.toContain('badge-white');
  });

  it('hero con badge vacío no incluye badge-white', () => {
    const landing = { ...minLanding, hero: { ...minLanding.hero, badge: '' } };
    const html = generateIndexHTML(landing, makeTheme(), 'Test');
    expect(html).not.toContain('badge-white');
  });

  it('footer sin links no incluye lista de navegación', () => {
    const html = generateIndexHTML(minLanding, makeTheme(), 'Test');
    expect(html).not.toContain('Navegación');
  });

  it('footer sin socialProof no muestra bloque de trust', () => {
    const html = generateIndexHTML(minLanding, makeTheme(), 'Test');
    expect(html).not.toContain('🔒');
  });

  it('urgency sin countdown no muestra countdown box', () => {
    const landing = { ...minLanding, urgency: { title: 'Promo', subtitle: 'Hoy', showCountdown: false } };
    const html = generateIndexHTML(landing, makeTheme(), 'Test');
    expect(html).toContain('Promo');
    expect(html).not.toContain('countdown-box');
  });

  it('pricing como array directo (fallback) funciona sin errores', () => {
    const landing = { ...minLanding, pricing: [{ name: 'Free', price: '$0', features: [], cta: 'Gratis', highlighted: false }] };
    const html = generateIndexHTML(landing, makeTheme(), 'Test');
    expect(html).toContain('Free');
  });

  it('faq como array directo (fallback) funciona sin errores', () => {
    const landing = { ...minLanding, faq: [{ question: '¿Qué es?', answer: 'Un servicio.' }] };
    const html = generateIndexHTML(landing, makeTheme(), 'Test');
    expect(html).toContain('¿Qué es?');
  });

  it('testimonials en root (fallback) funciona sin errores', () => {
    const landing = {
      ...minLanding,
      testimonials: [{ name: 'Bob', quote: 'Bueno', rating: 4, role: 'Dev' }],
      socialProof: { testimonials: [], stats: [] },
    };
    const html = generateIndexHTML(landing, makeTheme(), 'Test');
    expect(html).toBeTruthy();
  });
});