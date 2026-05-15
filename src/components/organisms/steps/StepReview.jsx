// Panel de revisión completo antes del submit.
// El usuario puede editar cualquier sección volviendo al paso correspondiente.
import React from 'react';
import { useFormContext } from '../../../context/FormContext';
import ReviewRow from '../../molecules/ReviewRow';
import { COLOR_LABELS } from '../../atoms/ColorSwatch';

const LABEL_MAPS = {
  businessSector: {
    gastronomia: 'Gastronomía', tecnologia: 'Tecnología', salud: 'Salud',
    educacion: 'Educación', moda: 'Moda', fitness: 'Fitness',
    legal: 'Legal', inmobiliaria: 'Inmobiliaria', turismo: 'Turismo',
    ecommerce: 'E-commerce', fintech: 'Finanzas', consultoria: 'Consultoría',
    belleza: 'Belleza', eventos: 'Eventos', arte: 'Arte & Creación', otro: 'Otro',
  },
  landingGoal: {
    ventas: 'Vender directamente', leads: 'Captar leads',
    reservas: 'Recibir reservas', informar: 'Informar al visitante',
    descargas: 'Promover descarga', registro: 'Lograr registro',
  },
  targetAudience: {
    jovenes: 'Jóvenes (18–28)', adultos: 'Adultos (30–50)',
    profesionales: 'Profesionales', empresas: 'Empresas (B2B)',
    emprendedores: 'Emprendedores', padres: 'Padres y madres',
    'adultos-mayores': 'Adultos mayores (55+)',
  },
  brandPositioning: {
    economico: 'Económico', 'calidad-precio': 'Calidad-precio',
    premium: 'Premium', lujo: 'Lujo / exclusivo',
  },
  brandStage: {
    'nueva-marca': 'Marca nueva', establecida: 'Marca establecida',
    relanzamiento: 'Relanzamiento',
  },
  communicationTone: {
    profesional: 'Profesional', cercano: 'Cercano y amigable',
    elegante: 'Elegante', jovial: 'Jovial y divertido',
    inspirador: 'Inspirador', tecnico: 'Técnico y especializado',
  },
  formalityLevel: {
    formal: 'Formal (usted)', 'semi-formal': 'Semi-formal', informal: 'Informal',
  },
  baseMode: { claro: 'Modo claro', oscuro: 'Modo oscuro', mixto: 'Mixto' },
  contrastLevel: { suave: 'Suave', estandar: 'Estándar', alto: 'Alto contraste' },
  visualStyle: {
    minimalista: 'Minimalista', moderno: 'Moderno', corporativo: 'Corporativo',
    futurista: 'Futurista', elegante: 'Elegante', organico: 'Orgánico',
    audaz: 'Audaz', retro: 'Retro',
  },
  typographyHierarchy: {
    discreta: 'Discreta', equilibrada: 'Equilibrada', dominante: 'Dominante',
  },
  visualDensity: { aireado: 'Aireado', equilibrado: 'Equilibrado', compacto: 'Compacto' },
  sectionDividers: { limpia: 'Sin divisores', divisores: 'Con líneas', formas: 'Con formas' },
  typographyStyle: {
    geometrica: 'Geométrica', 'sans-humanista': 'Sans humanista',
    'serif-clasico': 'Serif clásica', display: 'Display', monospace: 'Monospace',
  },
  buttonShape: { cuadrado: 'Cuadrado', redondeado: 'Redondeado', pildora: 'Píldora' },
  buttonStyle: { solido: 'Sólido', outline: 'Outline', ghost: 'Ghost', gradiente: 'Gradiente' },
  iconStyle: { outline: 'Outline', filled: 'Rellenos', ninguno: 'Sin íconos' },
  layoutType: {
    centrado: 'Centrado', asimetrico: 'Asimétrico',
    'full-width': 'Full-width', tarjetas: 'En tarjetas',
  },
  creativityLevel: {
    conservadora: 'Conservadora', equilibrada: 'Equilibrada', experimental: 'Experimental',
  },
  animationLevel: {
    ninguna: 'Sin animaciones', sutil: 'Sutil', moderada: 'Moderada', expresiva: 'Expresiva',
  },
  scrollEffect: {
    ninguno: 'Ninguno', 'fade-in': 'Fade-in', 'slide-in': 'Slide-in', parallax: 'Parallax',
  },
  heroEffect: {
    ninguno: 'Ninguno', particulas: 'Partículas', 'gradiente-animado': 'Gradiente animado',
  },
};

const resolve = (map, value) => map?.[value] || value || '—';

const ReviewSection = ({ title, stepNumber, onEdit, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
          {stepNumber}
        </span>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 px-3 py-1.5 rounded-lg transition-all"
      >
        ✎ Editar
      </button>
    </div>
    <div className="px-6 divide-y divide-gray-50">
      {children}
    </div>
  </div>
);

const StepReview = ({ planLevel, onEditStep }) => {
  const { formData } = useFormContext();

  const activeSections = Object.entries(formData.sections)
    .filter(([, active]) => active)
    .map(([key]) => {
      const labels = {
        hero: 'Hero', features: 'Características', testimonials: 'Testimonios',
        faq: 'FAQ', pricing: 'Precios', urgency: 'Urgencia',
      };
      return labels[key] || key;
    })
    .join(', ');

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-blue-700">
          Revisa tu configuración completa. Puedes editar cualquier sección antes de generar tu landing.
        </p>
      </div>

      <ReviewSection title="Identidad del negocio" stepNumber={1} onEdit={() => onEditStep(1)}>
        <ReviewRow label="Nombre del proyecto" value={formData.projectName} />
        <ReviewRow label="Propuesta de valor" value={formData.projectIdea} />
        <ReviewRow label="CTA principal" value={formData.callToAction} />
        <ReviewRow label="Sector" value={resolve(LABEL_MAPS.businessSector, formData.businessSector)} />
        <ReviewRow label="Objetivo de la landing" value={resolve(LABEL_MAPS.landingGoal, formData.landingGoal)} />
        <ReviewRow label="Público objetivo" value={resolve(LABEL_MAPS.targetAudience, formData.targetAudience)} />
        <ReviewRow label="Posicionamiento" value={resolve(LABEL_MAPS.brandPositioning, formData.brandPositioning)} />
        <ReviewRow label="Etapa de la marca" value={resolve(LABEL_MAPS.brandStage, formData.brandStage)} />
        {formData.valueProposition && (
          <ReviewRow label="Diferenciador clave" value={formData.valueProposition} />
        )}
      </ReviewSection>

      {planLevel >= 2 && (
        <ReviewSection title="Comunicación e identidad visual" stepNumber={2} onEdit={() => onEditStep(2)}>
          <ReviewRow label="Tono de comunicación" value={resolve(LABEL_MAPS.communicationTone, formData.communicationTone)} />
          <ReviewRow label="Nivel de formalidad" value={resolve(LABEL_MAPS.formalityLevel, formData.formalityLevel)} />
          <ReviewRow label="Color primario" value={COLOR_LABELS[formData.primaryColor] || formData.primaryColor} />
          <ReviewRow label="Color secundario" value={COLOR_LABELS[formData.secondaryColor] || formData.secondaryColor} />
          <ReviewRow label="Modo base" value={resolve(LABEL_MAPS.baseMode, formData.baseMode)} />
          <ReviewRow label="Contraste" value={resolve(LABEL_MAPS.contrastLevel, formData.contrastLevel)} />
        </ReviewSection>
      )}

      {planLevel >= 2 && (
        <ReviewSection title="Estilo visual y secciones" stepNumber={3} onEdit={() => onEditStep(3)}>
          <ReviewRow label="Estilo visual" value={resolve(LABEL_MAPS.visualStyle, formData.visualStyle)} />
          <ReviewRow label="Jerarquía tipográfica" value={resolve(LABEL_MAPS.typographyHierarchy, formData.typographyHierarchy)} />
          <ReviewRow label="Densidad visual" value={resolve(LABEL_MAPS.visualDensity, formData.visualDensity)} />
          <ReviewRow label="Divisores de sección" value={resolve(LABEL_MAPS.sectionDividers, formData.sectionDividers)} />
          <ReviewRow label="Secciones activas" value={activeSections} />
        </ReviewSection>
      )}

      {planLevel >= 3 && (
        <ReviewSection title="Diseño avanzado" stepNumber={4} onEdit={() => onEditStep(4)}>
          <ReviewRow label="Tipografía" value={resolve(LABEL_MAPS.typographyStyle, formData.typographyStyle)} />
          <ReviewRow label="Forma de botones" value={resolve(LABEL_MAPS.buttonShape, formData.buttonShape)} />
          <ReviewRow label="Estilo de botones" value={resolve(LABEL_MAPS.buttonStyle, formData.buttonStyle)} />
          <ReviewRow label="Íconos" value={resolve(LABEL_MAPS.iconStyle, formData.iconStyle)} />
          <ReviewRow label="Layout" value={resolve(LABEL_MAPS.layoutType, formData.layoutType)} />
          <ReviewRow label="Animaciones" value={resolve(LABEL_MAPS.animationLevel, formData.animationLevel)} />
          <ReviewRow label="Efecto de scroll" value={resolve(LABEL_MAPS.scrollEffect, formData.scrollEffect)} />
          <ReviewRow label="Efecto en hero" value={resolve(LABEL_MAPS.heroEffect, formData.heroEffect)} />
          <ReviewRow label="Creatividad" value={resolve(LABEL_MAPS.creativityLevel, formData.creativityLevel)} />
        </ReviewSection>
      )}

    </div>
  );
};

export default StepReview;