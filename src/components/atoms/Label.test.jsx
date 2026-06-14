import { render, screen } from '@testing-library/react';
import Label from './Label';

describe('Label', () => {
  it('renderiza el texto correctamente', () => {
    render(<Label>Correo</Label>);
    expect(screen.getByText('Correo')).toBeTruthy();
  });

  it('asocia el htmlFor correctamente', () => {
    render(<Label htmlFor="email">Correo</Label>);
    const label = screen.getByText('Correo');
    expect(label.getAttribute('for')).toBe('email');
  });

  it('aplica className adicional', () => {
    render(<Label className="text-red-500">Error</Label>);
    const label = screen.getByText('Error');
    expect(label.className).toContain('text-red-500');
  });
});
