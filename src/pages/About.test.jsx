import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

vi.mock('../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../components/organisms/Navbar',  () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../components/organisms/Footer',  () => ({ default: () => <footer>Footer</footer> }));

import About from './About';

const renderAbout = () =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: null, logout: vi.fn() }}>
        <About />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Página: About', () => {
  it('renderiza sin errores', () => {
    const { container } = renderAbout();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Navbar', () => {
    renderAbout();
    expect(screen.getByText('Navbar')).toBeTruthy();
  });

  it('muestra el Footer', () => {
    renderAbout();
    expect(screen.getByText('Footer')).toBeTruthy();
  });
});