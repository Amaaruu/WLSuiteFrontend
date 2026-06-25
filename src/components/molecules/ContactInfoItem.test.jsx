import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ContactInfoItem from './ContactInfoItem';

const MockIcon = (props) => <svg data-testid="mock-icon" {...props} />;

describe('Molécula: <ContactInfoItem />', () => {
  it('Debe renderizar el título, el contenido y el icono correctamente', () => {
    render(
      <ContactInfoItem 
        icon={MockIcon} 
        title="Ubicación" 
        content="Av. Providencia 1234, Santiago" 
      />
    );

    expect(screen.getByText('Ubicación')).toBeInTheDocument();
    expect(screen.getByText('Av. Providencia 1234, Santiago')).toBeInTheDocument();
    
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('Debe renderizar el contenido como texto normal (<p>) si isLink es falso o no se provee', () => {
    render(
      <ContactInfoItem 
        icon={MockIcon} 
        title="Teléfono" 
        content="+56 9 1234 5678" 
        isLink={false} 
      />
    );

    const elemento = screen.getByText('+56 9 1234 5678');

    expect(elemento.tagName).toBe('P');
  });

  it('Debe renderizar un enlace (<a>) con el href correcto si isLink es verdadero', () => {
    render(
      <ContactInfoItem 
        icon={MockIcon} 
        title="Soporte" 
        content="ayuda@wlsuite.com" 
        isLink={true} 
        href="mailto:ayuda@wlsuite.com" 
      />
    );

    const elementoEnlace = screen.getByText('ayuda@wlsuite.com');
    expect(elementoEnlace.tagName).toBe('A');
    expect(elementoEnlace).toHaveAttribute('href', 'mailto:ayuda@wlsuite.com');
  });
});