import React, { createContext, useContext, useState, useCallback } from 'react';

const INITIAL_FORM_DATA = {
  
  projectName:      '',
  projectIdea:      '',
  callToAction:     '',
  businessSector:   '',
  landingGoal:      '',
  targetAudience:   '',
  brandPositioning: '',
  brandStage:       '',
  valueProposition: '',

  communicationTone: 'profesional',
  formalityLevel:    'semi-formal',
  primaryColor:      'azul-marino',
  secondaryColor:    'blanco',
  baseMode:          'claro',
  contrastLevel:     'estandar',

  visualStyle:         'moderno',
  typographyHierarchy: 'equilibrada',
  visualDensity:       'equilibrado',
  sectionDividers:     'limpia',
  
  sections: {
    hero:         true,   
    features:     true,
    testimonials: false,
    faq:          false,
    pricing:      false,
    urgency:      false,
  },

  typographyStyle: 'sans-humanista',
  buttonShape:     'redondeado',
  buttonStyle:     'solido',
  iconStyle:       'outline',
  layoutType:      'centrado',
  creativityLevel: 'equilibrada',
  animationLevel:  'sutil',
  scrollEffect:    'fade-in',
  heroEffect:      'ninguno',
  hoverIntensity:  'sutil',
  contentDensity:  'equilibrado',

  heroImageUrl: null,
  logoImageUrl: null,
};

const FormContext = createContext(null);

export const FormProvider = ({ children }) => {
  const [formData, setFormData]       = useState(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(1);

  const updateField = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const toggleSection = useCallback((sectionKey) => {
    if (sectionKey === 'hero') return;
    setFormData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: !prev.sections[sectionKey],
      },
    }));
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  const buildPayload = useCallback((transactionId) => {
    const activeSections = Object.entries(formData.sections)
      .filter(([, active]) => active)
      .map(([key]) => key)
      .join(',');

    return {
      transactionId,
      projectName:       formData.projectName,
      projectIdea:       formData.projectIdea,
      callToAction:      formData.callToAction,
      businessSector:    formData.businessSector,
      landingGoal:       formData.landingGoal,
      targetAudience:    formData.targetAudience,
      brandPositioning:  formData.brandPositioning,
      brandStage:        formData.brandStage,
      valueProposition:  formData.valueProposition,
      communicationTone: formData.communicationTone,
      formalityLevel:    formData.formalityLevel,
      designPreferences: {
        primaryColor:        formData.primaryColor,
        secondaryColor:      formData.secondaryColor,
        baseMode:            formData.baseMode,
        contrastLevel:       formData.contrastLevel,
        visualStyle:         formData.visualStyle,
        typographyHierarchy: formData.typographyHierarchy,
        visualDensity:       formData.visualDensity,
        sectionDividers:     formData.sectionDividers,
        sections:            activeSections,
        typographyStyle:     formData.typographyStyle,
        buttonShape:         formData.buttonShape,
        buttonStyle:         formData.buttonStyle,
        iconStyle:           formData.iconStyle,
        layoutType:          formData.layoutType,
        creativityLevel:     formData.creativityLevel,
        animationLevel:      formData.animationLevel,
        scrollEffect:        formData.scrollEffect,
        heroEffect:          formData.heroEffect,
        hoverIntensity:      formData.hoverIntensity,
        contentDensity:      formData.contentDensity,

        ...(formData.heroImageUrl && { heroImageUrl: formData.heroImageUrl }),
        ...(formData.logoImageUrl && { logoImageUrl: formData.logoImageUrl }),
      },
    };
  }, [formData]);

  return (
    <FormContext.Provider value={{
      formData,
      currentStep,
      updateField,
      toggleSection,
      goToStep,
      buildPayload,
    }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error('useFormContext debe usarse dentro de <FormProvider>');
  }
  return ctx;
};