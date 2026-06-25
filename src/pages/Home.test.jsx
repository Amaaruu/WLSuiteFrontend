import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

vi.mock('../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../components/organisms/Navbar', () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../components/organisms/Footer', () => ({ default: () => <footer>Footer</footer> }));

vi.mock('framer-motion', () => ({
  motion: {
    div:     ({ children, ...p }) => <div {...p}>{children}</div>,
    section: ({ children, ...p }) => <section {...p}>{children}</section>,
    h1:      ({ children, ...p }) => <h1 {...p}>{children}</h1>,
    h2:      ({ children, ...p }) => <h2 {...p}>{children}</h2>,
    p:       ({ children, ...p }) => <p {...p}>{children}</p>,
    span:    ({ children, ...p }) => <span {...p}>{children}</span>,
    button:  ({ children, ...p }) => <button {...p}>{children}</button>,
    a:       ({ children, ...p }) => <a {...p}>{children}</a>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
  useAnimation: () => ({ start: vi.fn() }),
  useInView:    () => true,
}));

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

  it('contiene algún texto con propuesta de valor de la plataforma', () => {
    renderHome();
    const elements = screen.getAllByText(/landing|web|ai|genera|crea/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('contiene links o botones de acción principal', () => {
    renderHome();
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('muestra el headline principal', () => {
    renderHome();
    expect(screen.getByText(/Crea tu éxito/i)).toBeTruthy();
  });

  it('muestra el badge de estado de la plataforma', () => {
    renderHome();
    expect(screen.getByText(/WebLandingSuite Beta/i)).toBeTruthy();
  });

  it('renderiza correctamente con usuario autenticado', () => {
    const { container } = renderHome({ name: 'Juan', role: 'user' });
    expect(container.firstChild).toBeTruthy();
  });

  it('renderiza correctamente sin usuario (guest)', () => {
    const { container } = renderHome(null);
    expect(container.firstChild).toBeTruthy();
  });
});