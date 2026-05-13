//Identidad del negocio. Disponible en todos los planes.
import React from 'react';
import { useFormContext } from '../../../context/FormContext';
import FormField from '../../molecules/FormField';
import FieldGroup from '../../molecules/FieldGroup';
import OptionChip from '../../atoms/OptionChip';

const SECTORS = [
  { value: 'gastronomia',  label: 'Gastronomía',    description: 'Cafés, restaurantes, pastelerías' },
  { value: 'tecnologia',   label: 'Tecnología',      description: 'SaaS, apps, servicios digitales' },
  { value: 'salud',        label: 'Salud',           description: 'Clínicas, terapias, bienestar' },
  { value: 'educacion',    label: 'Educación',       description: 'Cursos, tutorías, academias' },
  { value: 'moda',         label: 'Moda',            description: 'Ropa, accesorios, estilo de vida' },
  { value: 'fitness',      label: 'Fitness',         description: 'Deporte, entrenamiento, gym' },
  { value: 'legal',        label: 'Legal',           description: 'Estudios jurídicos, asesoría' },
  { value: 'inmobiliaria', label: 'Inmobiliaria',    description: 'Agentes, propiedades, arriendo' },
  { value: 'turismo',      label: 'Turismo',         description: 'Viajes, tours, alojamiento' },
  { value: 'ecommerce',    label: 'E-commerce',      description: 'Tienda online generalista' },
  { value: 'fintech',      label: 'Finanzas',        description: 'Pagos, inversión, crédito' },
  { value: 'consultoria',  label: 'Consultoría',     description: 'Asesoría profesional' },
  { value: 'belleza',      label: 'Belleza',         description: 'Estética, cosmética, cuidado personal' },
  { value: 'eventos',      label: 'Eventos',         description: 'Bodas, celebraciones, entretenimiento' },
  { value: 'arte',         label: 'Arte & Creación', description: 'Fotógrafos, diseñadores, artistas' },
  { value: 'otro',         label: 'Otro',            description: 'Negocio de propósito general' },
];

const GOALS = [
  { value: 'ventas',    label: 'Vender',       description: 'Concretar ventas directas' },
  { value: 'leads',     label: 'Captar leads', description: 'Obtener datos de contacto' },
  { value: 'reservas',  label: 'Reservas',     description: 'Agendar hora, mesa o sesión' },
  { value: 'informar',  label: 'Informar',     description: 'Presentar el negocio o producto' },
  { value: 'descargas', label: 'Descarga',     description: 'App, ebook o recurso gratuito' },
  { value: 'registro',  label: 'Registro',     description: 'Crear cuenta o suscripción' },
];

const AUDIENCES = [
  { value: 'jovenes',         label: 'Jóvenes',         description: '18–28 años, nativos digitales' },
  { value: 'adultos',         label: 'Adultos',          description: '30–50 años, prácticos' },
  { value: 'profesionales',   label: 'Profesionales',    description: 'Ejecutivos y especialistas' },
  { value: 'empresas',        label: 'Empresas (B2B)',   description: 'Tomadores de decisión' },
  { value: 'emprendedores',   label: 'Emprendedores',    description: 'Fundadores, startups' },
  { value: 'padres',          label: 'Padres y madres',  description: 'Familias con hijos' },
  { value: 'adultos-mayores', label: 'Adultos mayores',  description: '55+ años' },
];

const POSITIONINGS = [
  { value: 'economico',       label: 'Económico',         description: 'Precio bajo, accesible para todos' },
  { value: 'calidad-precio',  label: 'Calidad-precio',    description: 'Mejor relación del mercado' },
  { value: 'premium',         label: 'Premium',           description: 'Calidad superior, vale más' },
  { value: 'lujo',            label: 'Lujo',              description: 'Exclusivo, aspiracional' },
];

const STAGES = [
  { value: 'nueva-marca',   label: 'Marca nueva',       description: 'Se presenta por primera vez' },
  { value: 'establecida',   label: 'Marca establecida', description: 'Con trayectoria y reconocimiento' },
  { value: 'relanzamiento', label: 'Relanzamiento',     description: 'Nueva propuesta de valor' },
];

// ── Componente ────────────────────────────────────────────────────────────────
const Step1Identity = () => {
  const { formData, updateField } = useFormContext();

  return (
    <div className="space-y-8">

      <FieldGroup
        title="Tu negocio"
        description="Información básica que la IA usará para construir toda la landing."
      >
        <FormField
          label="Nombre del proyecto o negocio"
          id="projectName"
          name="projectName"
          placeholder="Ej: Cafetería El Rincón"
          value={formData.projectName}
          onChange={e => updateField('projectName', e.target.value)}
          required
        />
        <FormField
          label="Propuesta de valor — ¿qué ofreces y qué te hace distinto?"
          id="projectIdea"
          name="projectIdea"
          placeholder="Ej: Café de especialidad en Santiago que vende café de origen y repostería artesanal en un ambiente íntimo y tranquilo."
          value={formData.projectIdea}
          onChange={e => updateField('projectIdea', e.target.value)}
          isTextArea
          required
        />
        <FormField
          label="Llamado a la acción (CTA) — ¿qué quieres que haga el visitante?"
          id="callToAction"
          name="callToAction"
          placeholder="Ej: Reserva tu mesa, Empieza gratis, Contáctanos hoy"
          value={formData.callToAction}
          onChange={e => updateField('callToAction', e.target.value)}
          required
        />
      </FieldGroup>

      <FieldGroup
        title="Sector del negocio"
        description="Selecciona la categoría que mejor describe tu negocio."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SECTORS.map(opt => (
            <OptionChip
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={formData.businessSector === opt.value}
              onClick={() => updateField('businessSector', opt.value)}
            />
          ))}
        </div>
      </FieldGroup>

      <FieldGroup
        title="Objetivo principal de la landing"
        description="Define qué acción quieres provocar en el visitante."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {GOALS.map(opt => (
            <OptionChip
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={formData.landingGoal === opt.value}
              onClick={() => updateField('landingGoal', opt.value)}
            />
          ))}
        </div>
      </FieldGroup>

      <FieldGroup
        title="Público objetivo"
        description="¿A quién va dirigida tu landing? La IA adaptará el lenguaje y la persuasión."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AUDIENCES.map(opt => (
            <OptionChip
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={formData.targetAudience === opt.value}
              onClick={() => updateField('targetAudience', opt.value)}
            />
          ))}
        </div>
      </FieldGroup>

      <FieldGroup
        title="Posicionamiento de precio"
        description="¿Cómo se posiciona tu marca frente al mercado?"
      >
        <div className="grid grid-cols-2 gap-2">
          {POSITIONINGS.map(opt => (
            <OptionChip
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={formData.brandPositioning === opt.value}
              onClick={() => updateField('brandPositioning', opt.value)}
            />
          ))}
        </div>
      </FieldGroup>

      <FieldGroup
        title="Etapa de la marca"
        description="¿En qué momento está tu negocio?"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {STAGES.map(opt => (
            <OptionChip
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={formData.brandStage === opt.value}
              onClick={() => updateField('brandStage', opt.value)}
            />
          ))}
        </div>
      </FieldGroup>

    </div>
  );
};

export default Step1Identity;