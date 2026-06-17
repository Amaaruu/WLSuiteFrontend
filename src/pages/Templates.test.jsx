import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

vi.mock('../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../components/organisms/Navbar',  () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../components/organisms/Footer',  () => ({ default: () => <footer>Footer</footer> }));

import Templates from './Templates';

const renderTemplates = () =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: null, logout: vi.fn() }}>
        <Templates />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Página: Templates', () => {
  it('renderiza sin errores', () => {
    const { container } = renderTemplates();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Navbar', () => {
    renderTemplates();
    expect(screen.getByText('Navbar')).toBeTruthy();
  });

  it('muestra el Footer', () => {
    renderTemplates();
    expect(screen.getByText('Footer')).toBeTruthy();
  });
});