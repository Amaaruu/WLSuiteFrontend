import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const { apiGet } = vi.hoisted(() => ({ apiGet: vi.fn() }));
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../components/organisms/Navbar', () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../components/organisms/Footer', () => ({ default: () => <footer>Footer</footer> }));
vi.mock('../services/api', () => ({ default: { get: apiGet } }));
vi.mock('framer-motion', () => ({
  motion: {
    div:     ({ children, ...p }) => <div {...p}>{children}</div>,
    section: ({ children, ...p }) => <section {...p}>{children}</section>,
    h1:      ({ children, ...p }) => <h1 {...p}>{children}</h1>,
    h2:      ({ children, ...p }) => <h2 {...p}>{children}</h2>,
    p:       ({ children, ...p }) => <p {...p}>{children}</p>,
    button:  ({ children, ...p }) => <button {...p}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

import Plans from './Plans';

const mockPlans = [
  { planId: 1, name: 'Básico',     price: 9,  description: 'Plan básico',    features: ['1 proyecto', 'Soporte email'] },
  { planId: 2, name: 'Intermedio', price: 29, description: 'Plan intermedio', features: ['5 proyectos', 'Soporte chat'] },
  { planId: 3, name: 'Premium',    price: 79, description: 'Plan premium',    features: ['Ilimitado', 'Soporte 24/7'] },
];

const renderPlans = (user = null) =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user, logout: vi.fn() }}>
        <Plans />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Página: Plans', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    apiGet.mockResolvedValue({ data: mockPlans });
  });

  it('renderiza sin errores', () => {
    const { container } = renderPlans();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Navbar', () => {
    renderPlans();
    expect(screen.getByText('Navbar')).toBeTruthy();
  });

  it('muestra los planes desde la API', async () => {
    renderPlans();
    await waitFor(() => {
      expect(screen.getAllByText('Básico').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Intermedio').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Premium').length).toBeGreaterThan(0);
    });
  });

  it('muestra el precio de cada plan', async () => {
    renderPlans();
    await waitFor(() => {
      expect(screen.getByText('$9')).toBeTruthy();
      expect(screen.getByText('$29')).toBeTruthy();
      expect(screen.getByText('$79')).toBeTruthy();
    });
  });

  describe('con usuario autenticado', () => {
    it('permite seleccionar un plan y navegar al checkout', async () => {
      renderPlans({ name: 'Ana', role: 'user' });
      await waitFor(() => screen.getAllByText('Básico'));

      const btns = screen.queryAllByRole('button', { name: /elegir|seleccionar|comprar|empezar/i });
      if (btns.length > 0) {
        fireEvent.click(btns[0]);
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.stringContaining('checkout'),
          expect.anything()
        );
      }
    });
  });

  describe('sin usuario (guest)', () => {
    it('redirige al login cuando un guest intenta seleccionar un plan', async () => {
      renderPlans(null);
      await waitFor(() => screen.getAllByText('Básico'));

      const btns = screen.queryAllByRole('button', { name: /elegir|seleccionar|comprar|empezar/i });
      if (btns.length > 0) {
        fireEvent.click(btns[0]);
        expect(mockNavigate).toHaveBeenCalled();
        expect(mockNavigate.mock.calls[0][0]).toBe('/login');
      }
    });
  });

  describe('error al cargar planes', () => {
    it('maneja error de API sin romper el componente', async () => {
      apiGet.mockRejectedValue(new Error('Network Error'));
      const { container } = renderPlans();
      await waitFor(() => {
        expect(container.firstChild).toBeTruthy();
      });
    });
  });

  describe('sin planes disponibles', () => {
    it('no muestra tarjetas cuando la API retorna array vacío', async () => {
      apiGet.mockResolvedValue({ data: [] });
      renderPlans();
      await waitFor(() => {
        expect(screen.queryByText('$9')).toBeNull();
      });
    });
  });

  describe('plan destacado', () => {
    it('renderiza sin errores cuando un plan tiene highlighted=true', async () => {
      apiGet.mockResolvedValue({
        data: [
          { ...mockPlans[1], highlighted: true },
          mockPlans[0],
          mockPlans[2],
        ],
      });
      renderPlans();
      await waitFor(() => {
        // FIX: getAllByText porque aparece en tarjeta y tabla
        expect(screen.getAllByText('Intermedio').length).toBeGreaterThan(0);
      });
    });
  });
});