import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';
import Button from '../atoms/Button';
import FormField from '../molecules/FormField';
import ContactInfoItem from '../molecules/ContactInfoItem';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    
    if (errors[id]) {
      setErrors({ ...errors, [id]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'El asunto es obligatorio';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es obligatorio';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje es muy corto (mínimo 10 caracteres)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Datos listos para enviar al backend:', formData);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }
  };

  return (
    <section id="contact" className="py-24 bg-sapphire-50/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-sapphire-100 rounded-full blur-3xl opacity-40 -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-sapphire-900 tracking-tight sm:text-5xl mb-4">
            Hablemos de tu{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sapphire-600 to-blue-400">
              próximo proyecto
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ¿Tienes dudas sobre los planes o quieres una solución a medida para tu negocio? Escríbenos y te responderemos a la brevedad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start">
          
          <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-xl shadow-sapphire-900/5 border border-sapphire-100/50">
            <h3 className="text-2xl font-bold text-sapphire-900 mb-8">Información de Contacto</h3>
            <div className="space-y-8">
              <ContactInfoItem icon={Mail} title="Email" content="hola@landing.cl" isLink href="mailto:hola@landing.cl" />
              <ContactInfoItem icon={Phone} title="Teléfono" content="+56 9 1234 5678" />
              <ContactInfoItem icon={MapPin} title="Ubicación" content="Santiago, Chile" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-xl shadow-sapphire-900/5 border border-sapphire-100/50">
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Notificación de Éxito Visual */}
              {submitSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-medium">¡Mensaje enviado con éxito! Te contactaremos pronto.</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField 
                  label="Nombre" 
                  id="name" 
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                />
                <FormField 
                  label="Correo electrónico" 
                  id="email" 
                  type="email" 
                  placeholder="ejemplo@correo.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
              </div>
              <FormField 
                label="Asunto" 
                id="subject" 
                placeholder="¿En qué te podemos ayudar?"
                value={formData.subject}
                onChange={handleChange}
                error={errors.subject}
              />
              <FormField 
                label="Mensaje" 
                id="message" 
                placeholder="Cuéntanos sobre tu idea..." 
                isTextArea
                value={formData.message}
                onChange={handleChange}
                error={errors.message}
              />

              <Button variant="primary" type="submit" className="w-full flex justify-center items-center gap-2 py-4">
                Enviar mensaje
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;