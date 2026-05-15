import React from 'react';
import Label from '../atoms/Label';
import Input from '../atoms/Input';
import TextArea from '../atoms/TextArea';

// 1. Agregamos name, required y minLength a los props
const FormField = ({ label, id, name, type = 'text', placeholder, isTextArea = false, value, onChange, error, required, minLength }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {isTextArea ? (
        <TextArea 
          id={id} 
          name={name || id} // Si no hay name, usa el id como name
          placeholder={placeholder} 
          value={value} 
          onChange={onChange} 
          error={error} 
          required={required} 
        />
      ) : (
        <Input 
          type={type} 
          id={id} 
          name={name || id} // Fundamental para que tu RegisterForm funcione
          placeholder={placeholder} 
          value={value} 
          onChange={onChange} 
          error={error} 
          required={required} 
          minLength={minLength} 
        />
      )}
      {/* Si hay un error, mostramos este texto en rojo */}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default FormField;