//Comunicación e identidad de color. Plan Intermedio+.
import React from 'react';
import { useFormContext } from '../../../context/FormContext';
import FieldGroup from '../../molecules/FieldGroup';
import OptionChip from '../../atoms/OptionChip';
import ColorSwatch, { COLOR_HEX_MAP, COLOR_LABELS } from '../../atoms/ColorSwatch';
import LockedField from '../../molecules/LockedField';

const TONES = [
  { value: 'profesional', label: 'Profesional',  description: 'Confiable, preciso, serio' },
  { value: 'cercano',     label: 'Cercano',       description: 'Conversacional, amigable' },
  { value: 'elegante',    label: 'Elegante',      description: 'Sofisticado, palabras cuidadas' },
  { value: 'jovial',      label: 'Jovial',        description: 'Divertido, con energía' },
  { value: 'inspirador',  label: 'Inspirador',    description: 'Motivacional, enfocado en potencial' },
  { value: 'tecnico',     label: 'Técnico',       description: 'Especializado, directo a expertos' },
];

const FORMALITIES = [
  { value: 'formal',      label: 'Formal',       description: 'Usted, sin informalidades' },
  { value: 'semi-formal', label: 'Semi-formal',  description: 'Tuteo respetuoso y amable' },
  { value: 'informal',    label: 'Informal',     description: 'Coloquial y directo' },
];

const BASE_MODES = [
  { value: 'claro',  label: 'Modo claro',  description: 'Fondo blanco o claro' },
  { value: 'oscuro', label: 'Modo oscuro', description: 'Fondo negro o muy oscuro' },
  { value: 'mixto',  label: 'Mixto',       description: 'Secciones claras y oscuras' },
];

const CONTRASTS = [
  { value: 'suave',    label: 'Suave',    description: 'Diferencias de color sutiles' },
  { value: 'estandar', label: 'Estándar', description: 'Equilibrio visual clásico' },
  { value: 'alto',     label: 'Alto',     description: 'Máximo contraste, muy definido' },
];

const COLOR_KEYS = Object.keys(COLOR_HEX_MAP);

const Step2Communication = ({ planLevel }) => {
  const { formData, updateField } = useFormContext();
  const isLocked = planLevel < 2;

  if (isLocked) {
    return (
      <div className="space-y-4">
        <LockedField
          label="Tono de comunicación, colores e identidad visual"
          requiredPlan="Intermedio"
          variant="intermedio"
        />
        <p className="text-sm text-gray-500 text-center py-4">
          Estos campos están disponibles desde el Plan Intermedio.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <FieldGroup
        title="Tono de comunicación"
        description="Define cómo habla tu marca. La IA adaptará cada párrafo de copy a este tono."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TONES.map(opt => (
            <OptionChip
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={formData.communicationTone === opt.value}
              onClick={() => updateField('communicationTone', opt.value)}
            />
          ))}
        </div>
      </FieldGroup>

      <FieldGroup
        title="Nivel de formalidad"
        description="¿Cómo se dirige la landing al visitante?"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {FORMALITIES.map(opt => (
            <OptionChip
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={formData.formalityLevel === opt.value}
              onClick={() => updateField('formalityLevel', opt.value)}
            />
          ))}
        </div>
      </FieldGroup>

      <FieldGroup
        title="Color primario"
        description="Color dominante de la landing: botones, títulos, elementos de marca."
      >
        <div className="flex flex-wrap gap-3 py-1">
          {COLOR_KEYS.map(key => (
            <div key={key} className="flex flex-col items-center gap-1">
              <ColorSwatch
                colorKey={key}
                selected={formData.primaryColor === key}
                onClick={() => updateField('primaryColor', key)}
              />
              <span className="text-xs text-gray-400 text-center w-12 leading-tight">
                {COLOR_LABELS[key]}
              </span>
            </div>
          ))}
        </div>
      </FieldGroup>

      <FieldGroup
        title="Color secundario / acento"
        description="Color de contraste y acento. Se usa en fondos de sección, líneas y detalles."
      >
        <div className="flex flex-wrap gap-3 py-1">
          {COLOR_KEYS.map(key => (
            <div key={key} className="flex flex-col items-center gap-1">
              <ColorSwatch
                colorKey={key}
                selected={formData.secondaryColor === key}
                onClick={() => updateField('secondaryColor', key)}
              />
              <span className="text-xs text-gray-400 text-center w-12 leading-tight">
                {COLOR_LABELS[key]}
              </span>
            </div>
          ))}
        </div>
      </FieldGroup>

      <FieldGroup
        title="Modo base"
        description="Determina si la landing tendrá fondos claros u oscuros."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {BASE_MODES.map(opt => (
            <OptionChip
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={formData.baseMode === opt.value}
              onClick={() => updateField('baseMode', opt.value)}
            />
          ))}
        </div>
      </FieldGroup>

      <FieldGroup
        title="Nivel de contraste"
        description="Define qué tan marcadas son las diferencias visuales entre elementos."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {CONTRASTS.map(opt => (
            <OptionChip
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={formData.contrastLevel === opt.value}
              onClick={() => updateField('contrastLevel', opt.value)}
            />
          ))}
        </div>
      </FieldGroup>

    </div>
  );
};

export default Step2Communication;