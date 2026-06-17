import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

vi.mock('../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../components/organisms/Navbar', () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../components/organisms/Footer', () => ({ default: () => <footer>Footer</footer> }));
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: [
        { planId: 1, name: 'Básico',      price: 0,  features: [] },
        { planId: 2, name: 'Intermedio',  price: 29, features: [] },
        { planId: 3, name: 'Premium',     price: 59, features: [] },
      ],
    }),
  },
}));
vi.mock('../components/organisms/PricingCard', () => ({
  default: ({ plan }) => <div data-testid="pricing-card">{plan.name}</div>,
}));

import Plans from './Plans';

const renderPlans = () =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: null, logout: vi.fn() }}>
        <Plans />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Página: Plans', () => {
  it('renderiza sin errores', () => {
    const { container } = renderPlans();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Navbar', () => {
    renderPlans();
    expect(screen.getByText('Navbar')).toBeTruthy();
  });

  it('muestra el Footer', () => {
    renderPlans();
    expect(screen.getByText('Footer')).toBeTruthy();
  });
});