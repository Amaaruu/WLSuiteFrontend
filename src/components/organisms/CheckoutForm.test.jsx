import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CheckoutForm from './CheckoutForm';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});
vi.mock('../../services/api', () => ({
  default: { post: vi.fn().mockResolvedValue({ data: { transactionId: 'tx-001' } }) }
}));

const freePlan  = { planId: 1, name: 'Básico', price: 0 };
const paidPlan  = { planId: 2, name: 'Intermedio', price: 29 };

describe('CheckoutForm', () => {
  describe('plan gratuito', () => {
    it('muestra el mensaje de plan gratuito', () => {
      render(<MemoryRouter><CheckoutForm plan={freePlan} /></MemoryRouter>);
      expect(screen.getByText('Plan Gratuito')).toBeTruthy();
    });

    it('muestra botón Comenzar gratis ahora', () => {
      render(<MemoryRouter><CheckoutForm plan={freePlan} /></MemoryRouter>);
      expect(screen.getByText('Comenzar gratis ahora')).toBeTruthy();
    });

    it('no muestra campos de tarjeta', () => {
      render(<MemoryRouter><CheckoutForm plan={freePlan} /></MemoryRouter>);
      expect(screen.queryByText('Número de tarjeta')).toBeNull();
    });
  });

it('muestra los campos de tarjeta de crédito', () => {
    render(
      <MemoryRouter>
        <CheckoutForm plan={paidPlan} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('•••• •••• •••• ••••')).toBeTruthy();
    expect(screen.getByText('Titular')).toBeTruthy();
    expect(screen.getByText('NOMBRE APELLIDO')).toBeTruthy();
    expect(screen.getByText('Vence')).toBeTruthy();
    expect(screen.getByText('MM/AA')).toBeTruthy();
  });
    it('muestra el resumen de compra', () => {
      render(<MemoryRouter><CheckoutForm plan={paidPlan} /></MemoryRouter>);
      expect(screen.getByText('Resumen de compra')).toBeTruthy();
    });

    it('muestra el precio en el botón de pago', () => {
      render(<MemoryRouter><CheckoutForm plan={paidPlan} /></MemoryRouter>);
      expect(screen.getByText(/Pagar \$29 USD/)).toBeTruthy();
    });

    it('botón de pago está deshabilitado si el formulario está incompleto', () => {
      render(<MemoryRouter><CheckoutForm plan={paidPlan} /></MemoryRouter>);
      const payBtn = screen.getByText(/Pagar \$29 USD/);
      expect(payBtn.closest('button').disabled).toBe(true);
    });

    it('muestra error de número incompleto al salir del campo', () => {
      render(<MemoryRouter><CheckoutForm plan={paidPlan} /></MemoryRouter>);
      const input = screen.getByPlaceholderText('1234 5678 9012 3456');
      fireEvent.change(input, { target: { value: '1234' } });
      fireEvent.blur(input);
      expect(screen.getByText(/incompleto/)).toBeTruthy();
    });
  });
