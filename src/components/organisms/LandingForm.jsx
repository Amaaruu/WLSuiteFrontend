import React, { useState } from 'react';
import FormField from '../molecules/FormField';
import TextArea from '../atoms/TextArea';
import Button from '../atoms/Button';
import api from '../../services/api';

const LandingForm = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    businessDescription: '',
    targetAudience: '',
    colorPalette: 'Modern Blue',
    toneOfVoice: 'Professional'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/projects/generate', formData);
      console.log('Landing generada:', response.data);
    } catch (error) {
      console.error('Error al generar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <FormField 
        label="Nombre del Proyecto" 
        name="projectName" 
        value={formData.projectName} 
        onChange={handleChange} 
        required 
      />
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Descripción del Negocio</label>
        <TextArea 
          name="businessDescription" 
          value={formData.businessDescription} 
          onChange={handleChange} 
          placeholder="Ej: Una cafetería de especialidad..." 
          required 
        />
      </div>

      <FormField 
        label="Público Objetivo" 
        name="targetAudience" 
        value={formData.targetAudience} 
        onChange={handleChange} 
        required 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Paleta de Colores</label>
          <select 
            name="colorPalette" 
            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          >
            <option value="Modern Blue">Azul Moderno</option>
            <option value="Minimal Dark">Oscuro Minimalista</option>
            <option value="Nature Green">Verde Naturaleza</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Tono de Voz</label>
          <select 
            name="toneOfVoice" 
            className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          >
            <option value="Professional">Profesional</option>
            <option value="Friendly">Cercano / Amigable</option>
            <option value="Elegant">Elegante / Lujoso</option>
          </select>
        </div>
      </div>

      <Button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl" disabled={isLoading}>
        {isLoading ? 'Generando con IA...' : 'Generar mi Página'}
      </Button>
    </form>
  );
};

export default LandingForm;