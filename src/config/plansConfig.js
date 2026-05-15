// src/config/plansConfig.js
export const PLAN_CONFIG = {
  basico: {
    tagline: 'Tu primera presencia profesional en la web',
    description:
      'Ideal para emprendedores y negocios que están comenzando. Obtén una landing page generada con IA, lista para publicar en minutos, sin conocimientos técnicos.',
    badge: null,
    accentClass: 'basic',
    idealFor: 'Emprendedores y proyectos nuevos',
    features: [
      { text: 'Landing page generada con IA', included: true, highlight: false },
      { text: '1 sección Hero con titular y CTA', included: true, highlight: false },
      { text: 'Sección de características (3 bloques)', included: true, highlight: false },
      { text: 'Footer con datos de contacto', included: true, highlight: false },
      { text: 'Exportación en HTML listo para usar', included: true, highlight: false },
      { text: 'Personalización de color y estilo', included: false, highlight: false },
      { text: 'Secciones adicionales (FAQ, testimonios)', included: false, highlight: false },
      { text: 'Motor de IA premium (GPT-4o)', included: false, highlight: false },
    ],
    ctaLabel: 'Elegir Basico',
  },

  intermedio: {
    tagline: 'La landing que convierte visitas en clientes',
    description:
      'Para negocios en crecimiento que necesitan más que una página básica. Control total sobre el estilo visual, secciones adicionales y un motor de IA más potente.',
    badge: 'Más popular',
    accentClass: 'popular',
    idealFor: 'Negocios en crecimiento y freelancers',
    features: [
      { text: 'Todo lo del plan Básico', included: true, highlight: false },
      { text: 'Motor de IA avanzado (GPT-4o Mini)', included: true, highlight: true },
      { text: 'Paleta de colores personalizable', included: true, highlight: false },
      { text: 'Sección de testimonios con prueba social', included: true, highlight: false },
      { text: 'FAQ para resolver objeciones de compra', included: true, highlight: false },
      { text: 'Sección de urgencia y escasez', included: true, highlight: false },
      { text: 'Control de tono y audiencia objetivo', included: true, highlight: false },
      { text: 'Diseño avanzado con IA (Claude 3.5)', included: false, highlight: false },
    ],
    ctaLabel: 'Elegir Intermedio',
  },

  premium: {
    tagline: 'La experiencia completa para resultados extraordinarios',
    description:
      'Para marcas y profesionales que exigen el máximo. IA de élite (Claude 3.5 Sonnet), control absoluto del diseño y todas las secciones disponibles sin límite.',
    badge: 'Máximo poder',
    accentClass: 'premium',
    idealFor: 'Marcas establecidas y profesionales',
    features: [
      { text: 'Todo lo del plan Intermedio', included: true, highlight: false },
      { text: 'Motor de IA élite (Claude 3.5 Sonnet)', included: true, highlight: true },
      { text: 'Control total del estilo tipográfico', included: true, highlight: true },
      { text: 'Animaciones y efectos de scroll avanzados', included: true, highlight: false },
      { text: 'Layout, botones y densidad visual', included: true, highlight: false },
      { text: 'Sección de precios y planes integrada', included: true, highlight: false },
      { text: 'Copywriting persuasivo nivel experto', included: true, highlight: true },
      { text: 'Soporte prioritario', included: true, highlight: false },
    ],
    ctaLabel: 'Obtener Premium',
  },
};

export const getPlanConfig = (planName = '') => {
  const key = planName
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const normalized = {
    basico:     PLAN_CONFIG.basico,
    intermedio: PLAN_CONFIG.intermedio,
    premium:    PLAN_CONFIG.premium,
  };

  return normalized[key] || {
    tagline: '',
    description: '',
    badge: null,
    accentClass: 'basic',
    icon: '📄',
    idealFor: '',
    features: [],
    ctaLabel: 'Elegir plan',
  };
};