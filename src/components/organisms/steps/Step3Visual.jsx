//Estilo visual y secciones. Plan Intermedio+.
import React from 'react';
import { useFormContext } from '../../../context/FormContext';
import FieldGroup from '../../molecules/FieldGroup';
import OptionChip from '../../atoms/OptionChip';
import SectionToggle from '../../atoms/SectionToggle';
import LockedField from '../../molecules/LockedField';

const VISUAL_STYLES = [
  { value: 'minimalista',  label: 'Minimalista',  description: 'Mucho espacio en blanco, austero' },
  { value: 'moderno',      label: 'Moderno',      description: 'Líneas limpias, contemporáneo' },
  { value: 'corporativo',  label: 'Corporativo',  description: 'Serio, institucional, confiable' },
  { value: 'futurista',    label: 'Futurista',    description: 'Tech, dark mode, acentos neón' },
  { value: 'elegante',     label: 'Elegante',     description: 'Alta gama, serif, mucho aire' },
  { value: 'organico',     label: 'Orgánico',     description: 'Natural, cálido, formas curvas' },
  { value: 'audaz',        label: 'Audaz',        description: 'Contrastes altos, impacto visual' },
  { value: 'retro',        label: 'Retro',        description: 'Vintage, nostalgia controlada' },
];

const HIERARCHIES = [
  { value: 'discreta',    label: 'Discreta',    description: 'Títulos modestos, equilibrado' },
  { value: 'equilibrada', label: 'Equilibrada', description: 'Jerarquía clara y balanceada' },
  { value: 'dominante',   label: 'Dominante',   description: 'Títulos grandes y protagónicos' },
];

const DENSITIES = [
  { value: 'aireado',     label: 'Aireado',     description: 'Mucho espacio, pocas secciones' },
  { value: 'equilibrado', label: 'Equilibrado', description: 'Balance entre espacio y contenido' },
  { value: 'compacto',    label: 'Compacto',    description: 'Más información, menos espacio' },
];

const DIVIDERS = [
  { value: 'limpia',    label: 'Sin divisores', description: 'Transiciones por espacio y color' },
  { value: 'divisores', label: 'Con líneas',    description: 'Líneas horizontales entre secciones' },
  { value: 'formas',    label: 'Con formas',    description: 'Ondas, diagonales, recortes SVG' },
];

const SECTIONS_CONFIG = [
  {
    key: 'hero',
    label: 'Hero principal',
    description: 'Titular, subtítulo y CTA. Siempre incluida.',
    locked: true,
  },
  {
    key: 'features',
    label: 'Características y beneficios',
    description: 'Muestra los puntos fuertes de tu producto o servicio.',
    locked: false,
  },
  {
    key: 'testimonials',
    label: 'Testimonios',
    description: 'Prueba social de clientes reales.',
    locked: false,
  },
  {
    key: 'faq',
    label: 'Preguntas frecuentes',
    description: 'Responde las dudas más comunes antes de que surjan.',
    locked: false,
  },
  {
    key: 'pricing',
    label: 'Precios y planes',
    description: 'Muestra tu estructura de precios o paquetes.',
    locked: false,
  },
  {
    key: 'urgency',
    label: 'Urgencia y escasez',
    description: 'Promoción con límite de tiempo o de cupos.',
    locked: false,
  },
];

const Step3Visual = ({ planLevel }) => {
  const { formData, updateField, toggleSection } = useFormContext();
  const isLocked = planLevel < 2;

  if (isLocked) {
    return (
      <div className="space-y-4">
        <LockedField
          label="Estilo visual y estructura de secciones"
          requiredPlan="Intermedio"
          variant="intermedio"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Estilo visual */}
      <FieldGroup
        title="Estilo visual"
        description="Define la personalidad estética general de la landing."
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {VISUAL_STYLES.map(opt => (
            <OptionChip
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={formData.visualStyle === opt.value}
              onClick={() => updateField('visualStyle', opt.value)}
            />
          ))}
        </div>
      </FieldGroup>

      {/* Jerarquía tipográfica */}
      <FieldGroup
        title="Jerarquía tipográfica"
        description="¿Qué protagonismo tienen los títulos?"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {HIERARCHIES.map(opt => (
            <OptionChip
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={formData.typographyHierarchy === opt.value}
              onClick={() => updateField('typographyHierarchy', opt.value)}
            />
          ))}
        </div>
      </FieldGroup>

      {/* Densidad visual */}
      <FieldGroup
        title="Densidad de contenido"
        description="Cuánta información y cuánto espacio tendrá la página."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {DENSITIES.map(opt => (
            <OptionChip
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={formData.visualDensity === opt.value}
              onClick={() => updateField('visualDensity', opt.value)}
            />
          ))}
        </div>
      </FieldGroup>

      {/* Divisores de sección */}
      <FieldGroup
        title="Separación entre secciones"
        description="Cómo se distinguen visualmente las secciones entre sí."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {DIVIDERS.map(opt => (
            <OptionChip
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={formData.sectionDividers === opt.value}
              onClick={() => updateField('sectionDividers', opt.value)}
            />
          ))}
        </div>
      </FieldGroup>

      {/* Secciones activas */}
      <FieldGroup
        title="Secciones de la landing"
        description="Activa las secciones que quieres incluir. El Hero siempre está presente."
      >
        <div className="space-y-2">
          {SECTIONS_CONFIG.map(sec => (
            <SectionToggle
              key={sec.key}
              label={sec.label}
              description={sec.description}
              active={formData.sections[sec.key]}
              locked={sec.locked}
              onToggle={() => toggleSection(sec.key)}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {Object.values(formData.sections).filter(Boolean).length} secciones activas
        </p>
      </FieldGroup>

    </div>
  );
};

export default Step3Visual;