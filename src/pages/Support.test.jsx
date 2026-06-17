import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

vi.mock('../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../components/organisms/Navbar',  () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../components/organisms/Footer',  () => ({ default: () => <footer>Footer</footer> }));
vi.mock('../services/api', () => ({
  default: { post: vi.fn().mockResolvedValue({ data: {} }) },
}));

import Support from './Support';

const renderSupport = () =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: null, logout: vi.fn() }}>
        <Support />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Página: Support', () => {
  it('renderiza sin errores', () => {
    const { container } = renderSupport();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Navbar', () => {
    renderSupport();
    expect(screen.getByText('Navbar')).toBeTruthy();
  });

  it('muestra el Footer', () => {
    renderSupport();
    expect(screen.getByText('Footer')).toBeTruthy();
  });
});