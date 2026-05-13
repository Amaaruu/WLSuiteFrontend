//Tipografía, botones y animaciones. Solo Plan Premium.
import React from 'react';
import { useFormContext } from '../../../context/FormContext';
import FieldGroup from '../../molecules/FieldGroup';
import OptionChip from '../../atoms/OptionChip';
import LockedField from '../../molecules/LockedField';

const TYPOGRAPHY_STYLES = [
  { value: 'geometrica',     label: 'Geométrica',     description: 'Montserrat, Poppins — moderna' },
  { value: 'sans-humanista', label: 'Sans humanista',  description: 'Inter, DM Sans — legible y versátil' },
  { value: 'serif-clasico',  label: 'Serif clásica',  description: 'Lora, Playfair — elegante, premium' },
  { value: 'display',        label: 'Display',         description: 'Clash Display — impacto, personalidad' },
  { value: 'monospace',      label: 'Monospace',       description: 'JetBrains Mono — marcas tech/dev' },
];

const BUTTON_SHAPES = [
  { value: 'cuadrado',   label: 'Cuadrado',    description: 'Bordes rectos, formal' },
  { value: 'redondeado', label: 'Redondeado',  description: 'Esquinas suaves, amigable' },
  { value: 'pildora',    label: 'Píldora',     description: 'Completamente redondo' },
];

const BUTTON_STYLES = [
  { value: 'solido',    label: 'Sólido',    description: 'Fondo de color pleno' },
  { value: 'outline',   label: 'Outline',   description: 'Solo borde, sin relleno' },
  { value: 'ghost',     label: 'Ghost',     description: 'Casi transparente' },
  { value: 'gradiente', label: 'Gradiente', description: 'Degradado primario → secundario' },
];

const ICON_STYLES = [
  { value: 'outline', label: 'Outline',    description: 'Íconos de línea' },
  { value: 'filled',  label: 'Rellenos',   description: 'Íconos sólidos' },
  { value: 'ninguno', label: 'Sin íconos', description: 'Solo texto y tipografía' },
];

const LAYOUTS = [
  { value: 'centrado',   label: 'Centrado',     description: 'Columna central, muy limpio' },
  { value: 'asimetrico', label: 'Asimétrico',   description: 'Texto e imagen alternados' },
  { value: 'full-width', label: 'Full-width',   description: 'Secciones de borde a borde' },
  { value: 'tarjetas',   label: 'En tarjetas',  description: 'Grid de cards por sección' },
];

const ANIMATIONS = [
  { value: 'ninguna',   label: 'Sin animaciones', description: 'Página completamente estática' },
  { value: 'sutil',     label: 'Sutil',           description: 'Fade-in suave al cargar' },
  { value: 'moderada',  label: 'Moderada',        description: 'Elementos aparecen al hacer scroll' },
  { value: 'expresiva', label: 'Expresiva',       description: 'Transiciones fluidas, microinteracciones' },
];

const SCROLL_EFFECTS = [
  { value: 'ninguno',  label: 'Ninguno',   description: 'Sin efectos de scroll' },
  { value: 'fade-in',  label: 'Fade-in',   description: 'Aparición suave por opacidad' },
  { value: 'slide-in', label: 'Slide-in',  description: 'Deslizamiento desde el borde' },
  { value: 'parallax', label: 'Parallax',  description: 'Fondo se mueve más lento que el contenido' },
];

const HERO_EFFECTS = [
  { value: 'ninguno',           label: 'Ninguno',          description: 'Hero estático clásico' },
  { value: 'particulas',        label: 'Partículas',       description: 'Puntos animados de fondo' },
  { value: 'gradiente-animado', label: 'Gradiente vivo',   description: 'Fondo con gradiente en movimiento' },
];

const CREATIVITIES = [
  { value: 'conservadora', label: 'Conservadora',  description: 'Sigue las convenciones estándar' },
  { value: 'equilibrada',  label: 'Equilibrada',   description: 'Creativo pero reconocible' },
  { value: 'experimental', label: 'Experimental',  description: 'Estructuras y jerarquías originales' },
];

const Step4Advanced = ({ planLevel }) => {
  const { formData, updateField } = useFormContext();
  const isLocked = planLevel < 3;

  if (isLocked) {
    return (
      <div className="space-y-4">
        <LockedField
          label="Tipografía, botones, layout y animaciones"
          requiredPlan="Premium"
          variant="premium"
        />
        <p className="text-sm text-gray-500 text-center py-4">
          Estas opciones avanzadas de diseño están disponibles en el Plan Premium.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <FieldGroup title="Tipografía" description="Familia tipográfica que usará la landing en títulos y cuerpo.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TYPOGRAPHY_STYLES.map(opt => (
            <OptionChip key={opt.value} label={opt.label} description={opt.description}
              selected={formData.typographyStyle === opt.value}
              onClick={() => updateField('typographyStyle', opt.value)} />
          ))}
        </div>
      </FieldGroup>

      <FieldGroup title="Forma de botones" description="Estilo de los bordes de todos los botones de la landing.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {BUTTON_SHAPES.map(opt => (
            <OptionChip key={opt.value} label={opt.label} description={opt.description}
              selected={formData.buttonShape === opt.value}
              onClick={() => updateField('buttonShape', opt.value)} />
          ))}
        </div>
      </FieldGroup>

      <FieldGroup title="Estilo de botones" description="Visual del relleno y borde de los botones de acción.">
        <div className="grid grid-cols-2 gap-2">
          {BUTTON_STYLES.map(opt => (
            <OptionChip key={opt.value} label={opt.label} description={opt.description}
              selected={formData.buttonStyle === opt.value}
              onClick={() => updateField('buttonStyle', opt.value)} />
          ))}
        </div>
      </FieldGroup>

      <FieldGroup title="Estilo de íconos" description="¿Cómo se verán los íconos decorativos y de apoyo?">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {ICON_STYLES.map(opt => (
            <OptionChip key={opt.value} label={opt.label} description={opt.description}
              selected={formData.iconStyle === opt.value}
              onClick={() => updateField('iconStyle', opt.value)} />
          ))}
        </div>
      </FieldGroup>

      <FieldGroup title="Tipo de layout" description="Estructura general de distribución de contenido en la página.">
        <div className="grid grid-cols-2 gap-2">
          {LAYOUTS.map(opt => (
            <OptionChip key={opt.value} label={opt.label} description={opt.description}
              selected={formData.layoutType === opt.value}
              onClick={() => updateField('layoutType', opt.value)} />
          ))}
        </div>
      </FieldGroup>

      <FieldGroup title="Animaciones" description="Nivel general de movimiento y transiciones de la landing.">
        <div className="grid grid-cols-2 gap-2">
          {ANIMATIONS.map(opt => (
            <OptionChip key={opt.value} label={opt.label} description={opt.description}
              selected={formData.animationLevel === opt.value}
              onClick={() => updateField('animationLevel', opt.value)} />
          ))}
        </div>
      </FieldGroup>

      <FieldGroup title="Efecto de scroll" description="Cómo aparecen los elementos al hacer scroll hacia abajo.">
        <div className="grid grid-cols-2 gap-2">
          {SCROLL_EFFECTS.map(opt => (
            <OptionChip key={opt.value} label={opt.label} description={opt.description}
              selected={formData.scrollEffect === opt.value}
              onClick={() => updateField('scrollEffect', opt.value)} />
          ))}
        </div>
      </FieldGroup>

      <FieldGroup title="Efecto en el Hero" description="Efecto visual especial en la sección principal de entrada.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {HERO_EFFECTS.map(opt => (
            <OptionChip key={opt.value} label={opt.label} description={opt.description}
              selected={formData.heroEffect === opt.value}
              onClick={() => updateField('heroEffect', opt.value)} />
          ))}
        </div>
      </FieldGroup>

      <FieldGroup title="Nivel de creatividad" description="Cuánta libertad creativa le das a la IA para proponer diseños.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {CREATIVITIES.map(opt => (
            <OptionChip key={opt.value} label={opt.label} description={opt.description}
              selected={formData.creativityLevel === opt.value}
              onClick={() => updateField('creativityLevel', opt.value)} />
          ))}
        </div>
      </FieldGroup>

    </div>
  );
};

export default Step4Advanced;