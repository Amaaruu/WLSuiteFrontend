import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import OrderSummary from './OrderSummary';

describe('Molécula: <OrderSummary />', () => {

  it('No debe renderizar nada (null) si no se provee un objeto "plan"', () => {
    const { container } = render(<OrderSummary plan={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('Debe renderizar los detalles del Plan Básico por defecto si el plan no es reconocido', () => {
    const planInventado = { name: 'Desconocido', price: 99 };
    render(<OrderSummary plan={planInventado} />);

    expect(screen.getByText('Plan Desconocido')).toBeInTheDocument();
    
    expect(screen.getByText('Landing page con IA')).toBeInTheDocument();
    expect(screen.getByText('HTML listo para publicar')).toBeInTheDocument();
    
    expect(screen.getAllByText('$99 USD').length).toBeGreaterThan(0);
  });

  it('Debe aplicar los estilos y características del Plan Intermedio correctamente', () => {
    const planIntermedio = { name: 'Intermedio', price: 149 };
    render(<OrderSummary plan={planIntermedio} />);


    expect(screen.getByText('🚀')).toBeInTheDocument();
    

    expect(screen.getByText('Testimonios + FAQ + Urgencia')).toBeInTheDocument();
    

    expect(screen.getAllByText('$149 USD').length).toBeGreaterThan(0);
  });

  it('Debe limpiar tildes y mayúsculas en el nombre del plan para aplicar el Premium', () => {
    const planPremium = { name: 'Prémium', price: 299 };
    render(<OrderSummary plan={planPremium} />);


    expect(screen.getByText('✦')).toBeInTheDocument();
    
    // Validamos características élite
    expect(screen.getByText('Motor IA élite (Claude 3.5)')).toBeInTheDocument();
    expect(screen.getByText('Copywriting nivel experto')).toBeInTheDocument();
  });

  it('Debe renderizar las garantías de pago seguro', () => {
    const plan = { name: 'Basico', price: 49 };
    render(<OrderSummary plan={plan} />);


    expect(screen.getByText('Pago 100% seguro y encriptado')).toBeInTheDocument();
    expect(screen.getByText('Sin cargos recurrentes ni ocultos')).toBeInTheDocument();
    expect(screen.getByText('Acceso inmediato tras el pago')).toBeInTheDocument();
  });

});