import { render, screen } from '@testing-library/react';
import FieldGroup from './FieldGroup';

describe('FieldGroup', () => {
  it('muestra el título', () => {
    render(<FieldGroup title="Información"><input /></FieldGroup>);
    expect(screen.getByText('Información')).toBeTruthy();
  });

  it('muestra la descripción', () => {
    render(<FieldGroup title="Info" description="Completa los datos"><input /></FieldGroup>);
    expect(screen.getByText('Completa los datos')).toBeTruthy();
  });

  it('renderiza los children', () => {
    render(<FieldGroup><input placeholder="nombre" /></FieldGroup>);
    expect(screen.getByPlaceholderText('nombre')).toBeTruthy();
  });
});