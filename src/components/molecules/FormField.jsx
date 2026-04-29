import React from 'react';
import Label from '../atoms/Label';
import Input from '../atoms/Input';
import TextArea from '../atoms/TextArea';

const FormField = ({ label, id, type = 'text', placeholder, isTextArea = false, value, onChange, error }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {isTextArea ? (
        <TextArea id={id} placeholder={placeholder} value={value} onChange={onChange} error={error} />
      ) : (
        <Input type={type} id={id} placeholder={placeholder} value={value} onChange={onChange} error={error} />
      )}
      {/* Si hay un error, mostramos este texto en rojo */}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default FormField;