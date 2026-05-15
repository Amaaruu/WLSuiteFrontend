import React, { useState } from 'react';
import FormField from '../molecules/FormField';
import TextArea from '../atoms/TextArea';
import Button from '../atoms/Button';
import { Mail, MapPin } from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 1500);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-16 items-start">
      
      <div className="space-y-8 lg:pr-12">
        <h3 className="text-2xl font-bold text-sapphire-950">Información Directa</h3>
        <p className="text-gray-600 text-lg leading-relaxed">
          Estamos disponibles para responder tus preguntas técnicas, hablar sobre integraciones o ayudarte a elegir el plan correcto para tu negocio.
        </p>
        
        <div className="space-y-8 pt-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Soporte y Ventas</p>
              <p className="text-lg font-bold text-sapphire-900">contacto@weblandingsuite.com</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Sede Central</p>
              <p className="text-lg font-bold text-sapphire-900">Santiago, Chile</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <FormField 
          label="Nombre Completo" 
          name="name" 
          type="text" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
        <FormField 
          label="Correo Electrónico" 
          name="email" 
          type="email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Mensaje o Consulta</label>
          <TextArea 
            name="message" 
            value={formData.message} 
            onChange={handleChange} 
            required 
            rows={5}
            className="w-full"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full py-4 mt-4 text-lg font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
        </Button>
      </form>
    </div>
  );
};

export default ContactSection;