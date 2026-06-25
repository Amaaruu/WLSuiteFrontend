import { describe, it, expect } from 'vitest';
import { PLAN_CONFIG, getPlanConfig } from './plansConfig';

describe('PLAN_CONFIG — estructura de datos', () => {

  it('exporta los tres planes: basico, intermedio, premium', () => {
    expect(PLAN_CONFIG.basico).toBeTruthy();
    expect(PLAN_CONFIG.intermedio).toBeTruthy();
    expect(PLAN_CONFIG.premium).toBeTruthy();
  });

  it('plan basico tiene badge null', () => {
    expect(PLAN_CONFIG.basico.badge).toBeNull();
  });

  it('plan intermedio tiene badge "Más popular"', () => {
    expect(PLAN_CONFIG.intermedio.badge).toBe('Más popular');
  });

  it('plan premium tiene badge distinto de null', () => {
    expect(PLAN_CONFIG.premium.badge).toBeTruthy();
  });

  it('cada plan tiene array de features no vacío', () => {
    expect(PLAN_CONFIG.basico.features.length).toBeGreaterThan(0);
    expect(PLAN_CONFIG.intermedio.features.length).toBeGreaterThan(0);
    expect(PLAN_CONFIG.premium.features.length).toBeGreaterThan(0);
  });

  it('cada plan tiene ctaLabel definido', () => {
    expect(typeof PLAN_CONFIG.basico.ctaLabel).toBe('string');
    expect(typeof PLAN_CONFIG.intermedio.ctaLabel).toBe('string');
    expect(typeof PLAN_CONFIG.premium.ctaLabel).toBe('string');
  });

  it('cada plan tiene accentClass definido', () => {
    expect(PLAN_CONFIG.basico.accentClass).toBe('basic');
    expect(PLAN_CONFIG.intermedio.accentClass).toBe('popular');
    expect(PLAN_CONFIG.premium.accentClass).toBe('premium');
  });
});

describe('getPlanConfig — resolución por nombre', () => {

  it('resuelve "Básico" (con acento) correctamente', () => {
    const config = getPlanConfig('Básico');
    expect(config.accentClass).toBe('basic');
  });

  it('resuelve "basico" (minúscula sin acento) correctamente', () => {
    const config = getPlanConfig('basico');
    expect(config.accentClass).toBe('basic');
  });

  it('resuelve "BASICO" (mayúsculas) correctamente', () => {
    const config = getPlanConfig('BASICO');
    expect(config.accentClass).toBe('basic');
  });

  it('resuelve "Intermedio" correctamente', () => {
    const config = getPlanConfig('Intermedio');
    expect(config.accentClass).toBe('popular');
    expect(config.badge).toBe('Más popular');
  });

  it('resuelve "intermedio" (minúscula) correctamente', () => {
    const config = getPlanConfig('intermedio');
    expect(config.accentClass).toBe('popular');
  });

  it('resuelve "Premium" correctamente', () => {
    const config = getPlanConfig('Premium');
    expect(config.accentClass).toBe('premium');
  });

  it('resuelve "premium" (minúscula) correctamente', () => {
    const config = getPlanConfig('premium');
    expect(config.accentClass).toBe('premium');
  });

  it('devuelve fallback para nombre desconocido', () => {
    const config = getPlanConfig('PlanDesconocido');
    expect(config.features).toEqual([]);
    expect(config.ctaLabel).toBe('Elegir plan');
    expect(config.accentClass).toBe('basic');
  });

  it('devuelve fallback cuando se llama sin argumentos', () => {
    const config = getPlanConfig();
    expect(config.features).toEqual([]);
    expect(config.ctaLabel).toBe('Elegir plan');
  });

  it('devuelve fallback para string vacío', () => {
    const config = getPlanConfig('');
    expect(config.features).toEqual([]);
  });

});

describe('getPlanConfig — estructura de features', () => {

  it('cada feature del plan basico tiene text e included', () => {
    const { features } = getPlanConfig('basico');
    features.forEach(f => {
      expect(typeof f.text).toBe('string');
      expect(typeof f.included).toBe('boolean');
    });
  });

  it('plan basico tiene features excluidas (included: false)', () => {
    const { features } = getPlanConfig('basico');
    const excluded = features.filter(f => !f.included);
    expect(excluded.length).toBeGreaterThan(0);
  });

  it('plan premium tiene todas las features incluidas', () => {
    const { features } = getPlanConfig('premium');
    const allIncluded = features.every(f => f.included);
    expect(allIncluded).toBe(true);
  });

  it('plan intermedio tiene features highlight marcadas', () => {
    const { features } = getPlanConfig('intermedio');
    const highlighted = features.filter(f => f.highlight);
    expect(highlighted.length).toBeGreaterThan(0);
  });
});