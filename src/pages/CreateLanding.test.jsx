import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

vi.mock('../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../components/organisms/Navbar',     () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../components/organisms/Footer',     () => ({ default: () => <footer>Footer</footer> }));
vi.mock('../components/organisms/LandingForm',() => ({ default: () => <div>LandingForm</div> }));
vi.mock('../context/FormContext', () => ({
  FormProvider: ({ children }) => <div>{children}</div>,
}));

import CreateLanding from './CreateLanding';

const mockUser = { name: 'Juan', role: 'user' };

const renderPage = () =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: mockUser, logout: vi.fn() }}>
        <CreateLanding />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Página: CreateLanding', () => {
  it('renderiza sin errores', () => {
    const { container } = renderPage();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Navbar', () => {
    renderPage();
    expect(screen.getByText('Navbar')).toBeTruthy();
  });

  it('muestra el Footer', () => {
    renderPage();
    expect(screen.getByText('Footer')).toBeTruthy();
  });

  it('muestra el formulario LandingForm', () => {
    renderPage();
    expect(screen.getByText('LandingForm')).toBeTruthy();
  });

  it('muestra el título principal', () => {
    renderPage();
    expect(screen.getByText('Configura tu Landing Page')).toBeTruthy();
  });

  it('muestra el subtítulo descriptivo', () => {
    renderPage();
    expect(screen.getByText('Completa los pasos y nuestra IA hará el resto.')).toBeTruthy();
  });
});