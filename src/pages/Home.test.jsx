import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

vi.mock('../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../components/organisms/Navbar', () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../components/organisms/Footer', () => ({ default: () => <footer>Footer</footer> }));

import Home from './Home';

const renderHome = (user = null) =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user, logout: vi.fn() }}>
        <Home />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Página: Home', () => {
  it('renderiza sin errores', () => {
    const { container } = renderHome();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Navbar', () => {
    renderHome();
    expect(screen.getByText('Navbar')).toBeTruthy();
  });

  it('muestra el Footer', () => {
    renderHome();
    expect(screen.getByText('Footer')).toBeTruthy();
  });

  it('muestra el botón de crear cuenta', () => {
    renderHome();
    expect(screen.getByText('Crear mi cuenta gratis')).toBeTruthy();
  });

  it('muestra el botón de soporte', () => {
    renderHome();
    expect(screen.getByText('Hablar con soporte')).toBeTruthy();
  });
});