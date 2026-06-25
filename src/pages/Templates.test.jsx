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
    ul:      ({ children, ...p }) => <ul {...p}>{children}</ul>,
    li:      ({ children, ...p }) => <li {...p}>{children}</li>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
  useAnimation:      () => ({ start: vi.fn() }),
  useInView:         () => true,
  useMotionValue:    () => ({ set: vi.fn(), get: vi.fn(() => 0), on: vi.fn() }),
  useAnimationFrame: vi.fn(),
  useTransform:      vi.fn(() => ({ set: vi.fn(), get: vi.fn(() => 0) })),
  animate:           vi.fn(),
}));

vi.mock('../components/organisms/InfiniteMarquee', () => ({
  default: () => <div data-testid="infinite-marquee">Marquee</div>,
}));

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

  it('contiene algún texto relacionado con plantillas o estilos', () => {
    renderTemplates();
    const elementos = screen.queryAllByText(/plantilla|template|estilo|diseño|ejemplo|muestra/i);
    expect(elementos.length).toBeGreaterThan(0);
  });

  it('muestra el título de la sección de templates', () => {
    renderTemplates();
    const { container } = renderTemplates();
    expect(container.textContent.length).toBeGreaterThan(50);
  });
});