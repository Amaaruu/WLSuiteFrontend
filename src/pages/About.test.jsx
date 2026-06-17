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
  },
  AnimatePresence: ({ children }) => <>{children}</>,
  useAnimation: () => ({ start: vi.fn() }),
  useInView:    () => true,
}));

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

  it('muestra contenido sobre la misión o historia', () => {
    renderAbout();
    const elements = screen.getAllByText(/historia|misión|equipo|nosotros|fundada/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('menciona el stack tecnológico', () => {
    renderAbout();
    const elements = screen.getAllByText(/React|Spring|Python|Backend|Frontend/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('menciona WebLandingSuite', () => {
    renderAbout();
    const elements = screen.getAllByText(/WebLandingSuite/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('muestra el título principal de la página', () => {
    renderAbout();
    expect(screen.getByText(/motor de internet/i)).toBeTruthy();
  });
});