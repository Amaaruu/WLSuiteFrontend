import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CreditCard from './CreditCard';

describe('Molécula: <CreditCard />', () => {
  
  describe('Renderizado de valores por defecto (Placeholders)', () => {
    it('Debe mostrar placeholders cuando no se pasan props', () => {
      render(<CreditCard />);
      expect(screen.getByText('NOMBRE APELLIDO')).toBeInTheDocument();
      expect(screen.getByText('MM/AA')).toBeInTheDocument();
      expect(screen.getByText('•••• •••• •••• ••••')).toBeInTheDocument();
      expect(screen.getByText('•••')).toBeInTheDocument();
    });
  });

  describe('Renderizado de props dinámicos', () => {
    it('Debe mostrar el nombre del titular correctamente', () => {
      render(<CreditCard name="Juan Pérez" />);
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });

    it('Debe mostrar la fecha de vencimiento correcta', () => {
      render(<CreditCard expiry="12/28" />);
      expect(screen.getByText('12/28')).toBeInTheDocument();
    });

    it('Debe formatear el número de la tarjeta con espacios cada 4 dígitos', () => {
      render(<CreditCard number="4111222233334444" />);
      expect(screen.getByText('4111 2222 3333 4444')).toBeInTheDocument();
    });

    it('Debe ocultar el CVV con asteriscos (puntos) según su longitud', () => {
      render(<CreditCard cvv="1234" />);
      expect(screen.getByText('••••')).toBeInTheDocument();
    });
  });

  describe('Lógica de detección de Red (Visa, Mastercard, Amex)', () => {
    it('Debe detectar y mostrar VISA si el número empieza con 4', () => {
      render(<CreditCard number="42345678" />);
      expect(screen.getByText('VISA')).toBeInTheDocument();
    });

    it('Debe detectar y mostrar AMERICAN EXPRESS si el número empieza con 34 o 37', () => {
      render(<CreditCard number="34123456" />);
      expect(screen.getByText(/AMERICAN/i)).toBeInTheDocument();
      expect(screen.getByText(/EXPRESS/i)).toBeInTheDocument();
    });
  });

  describe('Lógica de animación y giro (isFlipped)', () => {
    it('Debe girar la tarjeta 180 grados si isFlipped es true', () => {

      const { container } = render(<CreditCard isFlipped={true} />);
       
      const innerCard = container.firstChild.firstChild;
      
      expect(innerCard).toHaveStyle('transform: rotateY(180deg)');
    });

    it('Debe mantener la tarjeta en 0 grados si isFlipped es false', () => {
      const { container } = render(<CreditCard isFlipped={false} />);
      const innerCard = container.firstChild.firstChild;
      expect(innerCard).toHaveStyle('transform: rotateY(0deg)');
    });
  });

});