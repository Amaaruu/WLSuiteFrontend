import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const { mockNavigate, apiPost } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  apiPost:      vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));

vi.mock('../molecules/CreditCard', () => ({
  default: ({ number, name, expiry, isFlipped }) => (
    <div data-testid="credit-card">
      <span>{number  || '•••• •••• •••• ••••'}</span>
      <span>{name    || 'NOMBRE APELLIDO'}</span>
      <span>{expiry  || 'MM/AA'}</span>
      <span>{isFlipped ? 'flipped' : 'front'}</span>
    </div>
  ),
}));

vi.mock('../molecules/OrderSummary', () => ({
  default: ({ plan }) => (
    <div data-testid="order-summary">Resumen de compra — {plan?.name}</div>
  ),
}));

vi.mock('../../services/api', () => ({
  default: { post: apiPost },
}));

import CheckoutForm from './CheckoutForm';

const freePlan = { planId: 1, name: 'Básico',     price: 0  };
const paidPlan = { planId: 2, name: 'Intermedio', price: 29 };

const VALID_CARD           = '4532015112830366';
const VALID_CARD_FORMATTED = '4532 0151 1283 0366';

const renderForm = (plan = paidPlan) =>
  render(<MemoryRouter><CheckoutForm plan={plan} /></MemoryRouter>);


beforeEach(() => {
  vi.useFakeTimers();
  mockNavigate.mockClear();
  apiPost.mockResolvedValue({ data: { transactionId: 'tx-001' } });
});

afterEach(() => {
  vi.runAllTimers();
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe('CheckoutForm — plan gratuito', () => {

  it('muestra el bloque de plan gratuito', () => {
    renderForm(freePlan);
    expect(screen.getByText('Plan Gratuito')).toBeTruthy();
  });

  it('muestra el botón Comenzar gratis ahora', () => {
    renderForm(freePlan);
    expect(screen.getByText('Comenzar gratis ahora')).toBeTruthy();
  });

  it('no muestra campos de tarjeta de crédito', () => {
    renderForm(freePlan);
    expect(screen.queryByPlaceholderText('1234 5678 9012 3456')).toBeNull();
    expect(screen.queryByPlaceholderText('NOMBRE APELLIDO')).toBeNull();
  });

  it('muestra el resumen de compra con el nombre del plan', () => {
    renderForm(freePlan);
    expect(screen.getByText(/Resumen de compra — Básico/)).toBeTruthy();
  });

  it('al hacer submit del plan gratuito llama a api.post con paymentMethod gratis', async () => {
    renderForm(freePlan);
    const btn = screen.getByText('Comenzar gratis ahora');

    await act(async () => { fireEvent.click(btn); });
    await act(async () => { vi.advanceTimersByTime(3000); });

    expect(apiPost).toHaveBeenCalledWith('/transactions', {
      planId:        freePlan.planId,
      paymentMethod: 'gratis',
      status:        'completado',
    });
  });

  it('navega a /create-landing tras confirmar plan gratuito', async () => {
    renderForm(freePlan);

    await act(async () => { fireEvent.click(screen.getByText('Comenzar gratis ahora')); });
    await act(async () => { vi.advanceTimersByTime(3000); });
    await act(async () => { vi.advanceTimersByTime(2000); });

    expect(mockNavigate).toHaveBeenCalledWith('/create-landing', {
      state: { transactionId: 'tx-001', selectedPlan: freePlan },
    });
  });
});

describe('CheckoutForm — plan de pago, renderizado', () => {

  it('muestra el campo de número de tarjeta', () => {
    renderForm();
    expect(screen.getByPlaceholderText('1234 5678 9012 3456')).toBeTruthy();
  });

  it('muestra el campo de nombre', () => {
    renderForm();
    expect(screen.getByPlaceholderText('NOMBRE APELLIDO')).toBeTruthy();
  });

  it('muestra el campo de vencimiento', () => {
    renderForm();
    expect(screen.getByPlaceholderText('MM/AA')).toBeTruthy();
  });

  it('muestra el campo de CVV', () => {
    renderForm();
    expect(screen.getByPlaceholderText('•••')).toBeTruthy();
  });

  it('muestra el precio en el botón de pago', () => {
    renderForm();
    expect(screen.getByText(/Pagar \$29 USD/)).toBeTruthy();
  });

  it('muestra el resumen de compra', () => {
    renderForm();
    expect(screen.getByTestId('order-summary')).toBeTruthy();
  });

  it('botón de pago está deshabilitado con formulario vacío', () => {
    renderForm();
    const btn = screen.getByText(/Pagar \$29 USD/).closest('button');
    expect(btn.disabled).toBe(true);
  });

  it('renderiza la tarjeta de crédito visual', () => {
    renderForm();
    expect(screen.getByTestId('credit-card')).toBeTruthy();
  });
});

describe('CheckoutForm — validaciones', () => {

  it('muestra error de número incompleto al salir del campo', () => {
    renderForm();
    const input = screen.getByPlaceholderText('1234 5678 9012 3456');
    fireEvent.change(input, { target: { name: 'number', value: '1234' } });
    fireEvent.blur(input);
    expect(screen.getByText(/incompleto/i)).toBeTruthy();
  });

  it('muestra error de nombre requerido al salir del campo vacío', () => {
    renderForm();
    const input = screen.getByPlaceholderText('NOMBRE APELLIDO');
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(screen.getByText(/Nombre requerido/)).toBeTruthy();
  });

  it('muestra error de nombre muy corto', () => {
    renderForm();
    const input = screen.getByPlaceholderText('NOMBRE APELLIDO');
    fireEvent.change(input, { target: { name: 'name', value: 'AB' } });
    fireEvent.blur(input);
    expect(screen.getByText(/nombre completo/i)).toBeTruthy();
  });

  it('muestra error de fecha requerida al salir del campo vacío', () => {
    renderForm();
    const input = screen.getByPlaceholderText('MM/AA');
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(screen.getByText(/Fecha requerida/)).toBeTruthy();
  });

  it('muestra error de CVV requerido al salir del campo vacío', () => {
    renderForm();
    const input = screen.getByPlaceholderText('•••');
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(screen.getByText(/CVV requerido/)).toBeTruthy();
  });

  it('muestra error de CVV inválido con menos de 3 dígitos', () => {
    renderForm();
    const input = screen.getByPlaceholderText('•••');
    fireEvent.change(input, { target: { name: 'cvv', value: '12' } });
    fireEvent.blur(input);
    expect(screen.getByText(/CVV inválido/)).toBeTruthy();
  });

  it('CVV voltea la tarjeta al recibir foco', () => {
    renderForm();
    fireEvent.focus(screen.getByPlaceholderText('•••'));
    expect(screen.getByText('flipped')).toBeTruthy();
  });

  it('CVV desdobla la tarjeta al perder foco', () => {
    renderForm();
    const cvv = screen.getByPlaceholderText('•••');
    fireEvent.focus(cvv);
    fireEvent.blur(cvv);
    expect(screen.getByText('front')).toBeTruthy();
  });

  it('número de tarjeta se formatea con espacios cada 4 dígitos', () => {
    renderForm();
    const input = screen.getByPlaceholderText('1234 5678 9012 3456');
    fireEvent.change(input, { target: { name: 'number', value: VALID_CARD } });
    expect(input.value).toBe(VALID_CARD_FORMATTED);
  });

  it('nombre se convierte a mayúsculas automáticamente', () => {
    renderForm();
    const input = screen.getByPlaceholderText('NOMBRE APELLIDO');
    fireEvent.change(input, { target: { name: 'name', value: 'juan pérez' } });
    expect(input.value).toBe('JUAN PÉREZ');
  });

  it('vencimiento se formatea con barra MM/AA', () => {
    renderForm();
    const input = screen.getByPlaceholderText('MM/AA');
    fireEvent.change(input, { target: { name: 'expiry', value: '1228' } });
    expect(input.value).toBe('12/28');
  });

  it('botón de pago se habilita con formulario válido completo', () => {
    renderForm();
    fireEvent.change(screen.getByPlaceholderText('1234 5678 9012 3456'), {
      target: { name: 'number', value: VALID_CARD },
    });
    fireEvent.change(screen.getByPlaceholderText('NOMBRE APELLIDO'), {
      target: { name: 'name', value: 'JUAN PEREZ' },
    });
    fireEvent.change(screen.getByPlaceholderText('MM/AA'), {
      target: { name: 'expiry', value: '1228' },
    });
    fireEvent.change(screen.getByPlaceholderText('•••'), {
      target: { name: 'cvv', value: '123' },
    });
    expect(screen.getByText(/Pagar \$29 USD/).closest('button').disabled).toBe(false);
  });
});

describe('CheckoutForm — submit exitoso', () => {

  const fillValidForm = () => {
    fireEvent.change(screen.getByPlaceholderText('1234 5678 9012 3456'), {
      target: { name: 'number', value: VALID_CARD },
    });
    fireEvent.change(screen.getByPlaceholderText('NOMBRE APELLIDO'), {
      target: { name: 'name', value: 'JUAN PEREZ' },
    });
    fireEvent.change(screen.getByPlaceholderText('MM/AA'), {
      target: { name: 'expiry', value: '1228' },
    });
    fireEvent.change(screen.getByPlaceholderText('•••'), {
      target: { name: 'cvv', value: '123' },
    });
  };

  it('muestra pantalla de procesando al hacer submit', async () => {
    renderForm();
    fillValidForm();
    const form = screen.getByPlaceholderText('1234 5678 9012 3456').closest('form');
    await act(async () => { fireEvent.submit(form); });
    expect(screen.getByText(/Procesando pago/i)).toBeTruthy();
  });

  it('llama a api.post con los datos correctos al confirmar pago', async () => {
    renderForm();
    fillValidForm();
    const form = screen.getByPlaceholderText('1234 5678 9012 3456').closest('form');
    await act(async () => { fireEvent.submit(form); });
    await act(async () => { vi.advanceTimersByTime(3000); });

    expect(apiPost).toHaveBeenCalledWith('/transactions', {
      planId:        paidPlan.planId,
      paymentMethod: 'online',
      status:        'completado',
    });
  });

  it('muestra pantalla de éxito tras pago confirmado', async () => {
    renderForm();
    fillValidForm();
    const form = screen.getByPlaceholderText('1234 5678 9012 3456').closest('form');
    await act(async () => { fireEvent.submit(form); });
    await act(async () => { vi.advanceTimersByTime(3000); });

    expect(screen.getByText(/¡Pago completado!/)).toBeTruthy();
    expect(screen.getByText(/Intermedio/)).toBeTruthy();
  });

  it('navega a /create-landing con transactionId y selectedPlan tras éxito', async () => {
    renderForm();
    fillValidForm();
    const form = screen.getByPlaceholderText('1234 5678 9012 3456').closest('form');
    await act(async () => { fireEvent.submit(form); });
    await act(async () => { vi.advanceTimersByTime(3000); });
    await act(async () => { vi.advanceTimersByTime(2000); });

    expect(mockNavigate).toHaveBeenCalledWith('/create-landing', {
      state: { transactionId: 'tx-001', selectedPlan: paidPlan },
    });
  });
});

describe('CheckoutForm — error de API', () => {

  const fillValidForm = () => {
    fireEvent.change(screen.getByPlaceholderText('1234 5678 9012 3456'), {
      target: { name: 'number', value: VALID_CARD },
    });
    fireEvent.change(screen.getByPlaceholderText('NOMBRE APELLIDO'), {
      target: { name: 'name', value: 'JUAN PEREZ' },
    });
    fireEvent.change(screen.getByPlaceholderText('MM/AA'), {
      target: { name: 'expiry', value: '1228' },
    });
    fireEvent.change(screen.getByPlaceholderText('•••'), {
      target: { name: 'cvv', value: '123' },
    });
  };

  it('muestra la pantalla de error cuando la API falla con mensaje', async () => {
    apiPost.mockRejectedValueOnce({
      response: { data: { message: 'Tarjeta rechazada por el banco.' } },
    });
    renderForm();
    fillValidForm();
    const form = screen.getByPlaceholderText('1234 5678 9012 3456').closest('form');
    await act(async () => { fireEvent.submit(form); });
    await act(async () => { vi.advanceTimersByTime(3000); });

    expect(screen.getByText(/Error al procesar el pago/i)).toBeTruthy();
    expect(screen.getByText('Tarjeta rechazada por el banco.')).toBeTruthy();
  });

  it('muestra mensaje genérico cuando el error no tiene mensaje de API', async () => {
    apiPost.mockRejectedValueOnce({ response: {} });
    renderForm();
    fillValidForm();
    const form = screen.getByPlaceholderText('1234 5678 9012 3456').closest('form');
    await act(async () => { fireEvent.submit(form); });
    await act(async () => { vi.advanceTimersByTime(3000); });

    expect(screen.getByText(/No se pudo completar la transacción/)).toBeTruthy();
  });

  it('el botón Intentar de nuevo vuelve al formulario', async () => {
    apiPost.mockRejectedValueOnce({ response: {} });
    renderForm();
    fillValidForm();
    const form = screen.getByPlaceholderText('1234 5678 9012 3456').closest('form');
    await act(async () => { fireEvent.submit(form); });
    await act(async () => { vi.advanceTimersByTime(3000); });

    fireEvent.click(screen.getByText('Intentar de nuevo'));
    expect(screen.getByPlaceholderText('1234 5678 9012 3456')).toBeTruthy();
  });
});

describe('CheckoutForm — submit con formulario inválido', () => {

  it('no llama a api.post si el formulario está vacío', async () => {
    renderForm();
    const form = screen.getByPlaceholderText('1234 5678 9012 3456').closest('form');
    await act(async () => { fireEvent.submit(form); });
    expect(apiPost).not.toHaveBeenCalled();
  });

  it('marca todos los campos como tocados al intentar submit inválido', async () => {
    renderForm();
    const form = screen.getByPlaceholderText('1234 5678 9012 3456').closest('form');
    await act(async () => { fireEvent.submit(form); });

    expect(screen.getByText(/Número de tarjeta requerido/)).toBeTruthy();
    expect(screen.getByText(/Nombre requerido/)).toBeTruthy();
    expect(screen.getByText(/Fecha requerida/)).toBeTruthy();
    expect(screen.getByText(/CVV requerido/)).toBeTruthy();
  });
});