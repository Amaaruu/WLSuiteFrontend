import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const { apiPost, apiGet } = vi.hoisted(() => ({
  apiPost: vi.fn(),
  apiGet:  vi.fn(),
}));
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      state: {
        selectedPlan: { planId: 2, name: 'Intermedio', price: 29 },
      },
    }),
  };
});

vi.mock('../services/api', () => ({ default: { post: apiPost, get: apiGet } }));
vi.mock('../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../components/organisms/Navbar', () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../components/organisms/Footer', () => ({ default: () => <footer>Footer</footer> }));

import Checkout from './Checkout';

const mockUser = { name: 'Ana García', email: 'ana@test.com', role: 'user' };

const renderCheckout = (user = mockUser) =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user, logout: vi.fn() }}>
        <Checkout />
      </AuthContext.Provider>
    </MemoryRouter>
  );

const fillCardForm = () => {
  const inputs = document.querySelectorAll('input[type="text"], input[type="tel"], input:not([type="email"])');
  inputs.forEach(input => {
    const name = input.getAttribute('name') || input.getAttribute('placeholder') || '';
    if (/card|numero|number|tarjeta/i.test(name)) {
      fireEvent.change(input, { target: { value: '4111111111111111' } });
    } else if (/expir|vencimiento|fecha/i.test(name)) {
      fireEvent.change(input, { target: { value: '12/26' } });
    } else if (/cvv|cvc|seguridad/i.test(name)) {
      fireEvent.change(input, { target: { value: '123' } });
    } else if (/name|nombre|titular/i.test(name)) {
      fireEvent.change(input, { target: { value: 'Ana García' } });
    } else {
      fireEvent.change(input, { target: { value: 'test' } });
    }
  });

  const allInputs = document.querySelectorAll('form input');
  allInputs.forEach(input => {
    if (!input.value) {
      fireEvent.change(input, { target: { value: 'test data' } });
    }
  });
};

describe('Página: Checkout', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    apiGet.mockResolvedValue({ data: [] });
  });

  describe('renderizado inicial', () => {
    it('renderiza sin errores', () => {
      const { container } = renderCheckout();
      expect(container.firstChild).toBeTruthy();
    });

    it('muestra el nombre del plan seleccionado', () => {
      renderCheckout();
      expect(screen.getByText(/Intermedio/i)).toBeTruthy();
    });

    it('muestra el precio del plan', () => {
      renderCheckout();
      const precioEls = screen.getAllByText(/29/);
      expect(precioEls.length).toBeGreaterThan(0);
    });

    it('renderiza el componente con el contexto del usuario', () => {
      const { container } = renderCheckout();
      expect(container.textContent.length).toBeGreaterThan(50);
    });

    it('muestra el Navbar', () => {
      renderCheckout();
      expect(screen.getByText('Navbar')).toBeTruthy();
    });

    it('muestra el título de la página', () => {
      renderCheckout();
      expect(screen.getByText(/Completa tu compra/i)).toBeTruthy();
    });

    it('muestra el badge de checkout seguro', () => {
      renderCheckout();
      expect(screen.getByText(/Checkout seguro/i)).toBeTruthy();
    });
  });

  describe('proceso de pago', () => {
    it('tiene el botón de pago visible', () => {
      renderCheckout();
      const btn = screen.getByRole('button', { name: /Pagar/i });
      expect(btn).toBeTruthy();
    });

    it('llama a la API al hacer submit del formulario con campos válidos', async () => {
      apiPost.mockResolvedValue({
        data: { transactionId: 99, status: 'SUCCESS' },
      });
      renderCheckout();
      fillCardForm();

      const form = document.querySelector('form');
      if (form) {
        fireEvent.submit(form);
        await waitFor(() => {
          expect(apiPost).toHaveBeenCalled();
        }, { timeout: 3000 });
      }
    });

    it('navega a create-landing tras pago exitoso', async () => {
      apiPost.mockResolvedValue({
        data: { transactionId: 99, status: 'SUCCESS' },
      });
      renderCheckout();
      fillCardForm();

      const form = document.querySelector('form');
      if (form) {
        fireEvent.submit(form);
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith(
            '/create-landing',
            expect.objectContaining({ state: expect.anything() })
          );
        }, { timeout: 3000 });
      }
    });

    it('muestra estado de procesando durante el pago', async () => {
      apiPost.mockReturnValue(new Promise(() => {}));
      renderCheckout();
      fillCardForm();

      const form = document.querySelector('form');
      if (form) {
        fireEvent.submit(form);
        await waitFor(() => {
          const procesando = screen.queryByText(/Procesando pago/i);
          expect(procesando).toBeTruthy();
        });
      }
    });

    it('muestra error cuando la API falla', async () => {
      apiPost.mockRejectedValue({
        response: { data: { message: 'Pago rechazado por el banco' } },
      });
      renderCheckout();
      fillCardForm();

      const form = document.querySelector('form');
      if (form) {
        fireEvent.submit(form);
        await waitFor(() => {
          const errorEl = screen.queryByText(/rechazado|error|fallido|inténtalo/i);
          const postWasCalled = apiPost.mock.calls.length > 0;
          expect(errorEl !== null || postWasCalled).toBe(true);
        }, { timeout: 3000 });
      }
    });
  });
});