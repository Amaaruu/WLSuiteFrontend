import React from 'react';
import Label from '../atoms/Label';
import Select from '../atoms/Select';

const SelectField = ({ label, id, name, value, onChange, error, children }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Select id={id} name={name} value={value} onChange={onChange} error={error}>
      {children}
    </Select>
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

export default SelectField;