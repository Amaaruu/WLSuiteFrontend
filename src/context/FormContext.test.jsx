// src/context/FormContext.test.jsx
import { render, act } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { useContext } from 'react';
import { FormProvider, useFormContext, FormContext } from './FormContext';

// ── Componente auxiliar ───────────────────────────────────────────────────────
const ContextReader = ({ onRead }) => {
  const ctx = useFormContext();
  onRead(ctx);
  return null;
};

const renderContext = (onRead) => {
  render(
    <FormProvider>
      <ContextReader onRead={onRead} />
    </FormProvider>
  );
};

describe('FormContext', () => {

  // ── Estado inicial ──────────────────────────────────────────────────────────
  describe('estado inicial', () => {
    it('tiene currentStep en 1', () => {
      let ctx;
      renderContext((c) => { ctx = c; });
      expect(ctx.currentStep).toBe(1);
    });

    it('tiene hero activo y el resto de secciones inactivas por defecto', () => {
      let ctx;
      renderContext((c) => { ctx = c; });
      expect(ctx.formData.sections.hero).toBe(true);
      expect(ctx.formData.sections.features).toBe(true);
      expect(ctx.formData.sections.testimonials).toBe(false);
      expect(ctx.formData.sections.faq).toBe(false);
    });

    it('tiene campos de texto vacíos por defecto', () => {
      let ctx;
      renderContext((c) => { ctx = c; });
      expect(ctx.formData.projectName).toBe('');
      expect(ctx.formData.projectIdea).toBe('');
      expect(ctx.formData.callToAction).toBe('');
    });

    it('tiene valores visuales por defecto correctos', () => {
      let ctx;
      renderContext((c) => { ctx = c; });
      expect(ctx.formData.visualStyle).toBe('moderno');
      expect(ctx.formData.buttonShape).toBe('redondeado');
      expect(ctx.formData.animationLevel).toBe('sutil');
    });
  });

  // ── updateField() ───────────────────────────────────────────────────────────
  describe('updateField()', () => {
    it('actualiza un campo de texto correctamente', () => {
      let ctx;
      renderContext((c) => { ctx = c; });

      act(() => {
        ctx.updateField('projectName', 'Mi Empresa');
      });

      expect(ctx.formData.projectName).toBe('Mi Empresa');
    });

    it('actualiza un campo sin afectar los demás', () => {
      let ctx;
      renderContext((c) => { ctx = c; });

      const previousIdea = ctx.formData.projectIdea;

      act(() => {
        ctx.updateField('projectName', 'Solo el nombre');
      });

      expect(ctx.formData.projectIdea).toBe(previousIdea);
    });

    it('actualiza el color primario correctamente', () => {
      let ctx;
      renderContext((c) => { ctx = c; });

      act(() => {
        ctx.updateField('primaryColor', 'verde-esmeralda');
      });

      expect(ctx.formData.primaryColor).toBe('verde-esmeralda');
    });
  });

  // ── toggleSection() ─────────────────────────────────────────────────────────
  describe('toggleSection()', () => {
    it('activa una sección que estaba inactiva', () => {
      let ctx;
      renderContext((c) => { ctx = c; });

      expect(ctx.formData.sections.testimonials).toBe(false);

      act(() => {
        ctx.toggleSection('testimonials');
      });

      expect(ctx.formData.sections.testimonials).toBe(true);
    });

    it('desactiva una sección que estaba activa', () => {
      let ctx;
      renderContext((c) => { ctx = c; });

      act(() => {
        ctx.toggleSection('faq');
      });
      act(() => {
        ctx.toggleSection('faq');
      });

      expect(ctx.formData.sections.faq).toBe(false);
    });

    it('NO permite desactivar la sección hero (siempre activa)', () => {
      let ctx;
      renderContext((c) => { ctx = c; });

      act(() => {
        ctx.toggleSection('hero');
      });

      expect(ctx.formData.sections.hero).toBe(true);
    });
  });

  // ── goToStep() ──────────────────────────────────────────────────────────────
  describe('goToStep()', () => {
    it('navega al paso indicado', () => {
      let ctx;
      renderContext((c) => { ctx = c; });

      act(() => {
        ctx.goToStep(3);
      });

      expect(ctx.currentStep).toBe(3);
    });

    it('puede volver al paso 1', () => {
      let ctx;
      renderContext((c) => { ctx = c; });

      act(() => { ctx.goToStep(4); });
      act(() => { ctx.goToStep(1); });

      expect(ctx.currentStep).toBe(1);
    });
  });

  // ── buildPayload() ──────────────────────────────────────────────────────────
  describe('buildPayload()', () => {
    it('incluye el transactionId en el payload', () => {
      let ctx;
      renderContext((c) => { ctx = c; });

      act(() => { ctx.updateField('projectName', 'Test Project'); });

      const payload = ctx.buildPayload('tx-123');
      expect(payload.transactionId).toBe('tx-123');
    });

    it('incluye los campos del formulario en el payload', () => {
      let ctx;
      renderContext((c) => { ctx = c; });

      act(() => {
        ctx.updateField('projectName', 'Mi Café');
        ctx.updateField('projectIdea', 'Café de especialidad');
        ctx.updateField('callToAction', 'Reserva ya');
      });

      const payload = ctx.buildPayload('tx-456');
      expect(payload.projectName).toBe('Mi Café');
      expect(payload.projectIdea).toBe('Café de especialidad');
      expect(payload.callToAction).toBe('Reserva ya');
    });

    it('incluye solo las secciones activas en designPreferences.sections', () => {
      let ctx;
      renderContext((c) => { ctx = c; });

      act(() => { ctx.toggleSection('testimonials'); });

      const payload = ctx.buildPayload('tx-789');
      expect(payload.designPreferences.sections).toContain('hero');
      expect(payload.designPreferences.sections).toContain('testimonials');
      expect(payload.designPreferences.sections).not.toContain('faq');
    });

    it('incluye heroImageUrl en el payload solo si está definida', () => {
      let ctx;
      renderContext((c) => { ctx = c; });

      act(() => { ctx.updateField('heroImageUrl', 'https://img.com/hero.jpg'); });

      const payload = ctx.buildPayload('tx-abc');
      expect(payload.designPreferences.heroImageUrl).toBe('https://img.com/hero.jpg');
    });

    it('NO incluye heroImageUrl en el payload si es null', () => {
      let ctx;
      renderContext((c) => { ctx = c; });
      const payload = ctx.buildPayload('tx-abc');
      expect(payload.designPreferences.heroImageUrl).toBeUndefined();
    });

    it('incluye logoImageUrl en el payload cuando está definida', () => {
      let ctx;
      renderContext((c) => { ctx = c; });
      act(() => { ctx.updateField('logoImageUrl', 'https://img.com/logo.png'); });
      const payload = ctx.buildPayload('tx-logo');
      expect(payload.designPreferences.logoImageUrl).toBe('https://img.com/logo.png');
    });

    it('NO incluye logoImageUrl en el payload si es null', () => {
      let ctx;
      renderContext((c) => { ctx = c; });
      const payload = ctx.buildPayload('tx-logo');
      expect(payload.designPreferences.logoImageUrl).toBeUndefined();
    });

  });

  // ── useFormContext fuera del Provider ────────────────────────────────────────
  describe('useFormContext fuera del Provider', () => {
    it('lanza error si se usa fuera del FormProvider', () => {
      const BadComponent = () => { useFormContext(); return null; };
      expect(() => render(<BadComponent />)).toThrow('useFormContext debe usarse dentro de <FormProvider>');
    });
  });
});