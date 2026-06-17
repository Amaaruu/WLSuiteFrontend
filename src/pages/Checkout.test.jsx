import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

vi.mock('../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../components/organisms/Navbar', () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../services/api', () => ({
  default: {
    get:  vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: { transactionId: 'tx-123' } }),
  },
}));

import Checkout from './Checkout';

const mockUser = { name: 'Juan', email: 'juan@test.com', role: 'user' };

const renderCheckout = (state = undefined) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: '/checkout', state }]}>
      <AuthContext.Provider value={{ user: mockUser, logout: vi.fn() }}>
        <Checkout />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Página: Checkout', () => {
  it('renderiza sin errores con plan seleccionado', () => {
    const { container } = renderCheckout({
      selectedPlan: { planId: 1, name: 'Premium', price: 59 },
    });
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Navbar', () => {
    renderCheckout({ selectedPlan: { planId: 1, name: 'Premium', price: 59 } });
    expect(screen.getByText('Navbar')).toBeTruthy();
  });

  it('muestra el título "Completa tu compra"', () => {
    renderCheckout({ selectedPlan: { planId: 1, name: 'Premium', price: 59 } });
    expect(screen.getByText('Completa tu compra')).toBeTruthy();
  });

  it('muestra "Cambiar plan" como enlace de regreso', () => {
    renderCheckout({ selectedPlan: { planId: 1, name: 'Premium', price: 59 } });
    expect(screen.getByText('Cambiar plan')).toBeTruthy();
  });
});