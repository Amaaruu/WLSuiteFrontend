import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

vi.mock('../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../components/organisms/Navbar', () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../components/organisms/LoginForm', () => ({ default: () => <div>LoginForm</div> }));

import Login from './Login';

const renderLogin = () =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: null, logout: vi.fn() }}>
        <Login />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Página: Login', () => {
  it('renderiza sin errores', () => {
    const { container } = renderLogin();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Navbar', () => {
    renderLogin();
    expect(screen.getByText('Navbar')).toBeTruthy();
  });

  it('muestra el formulario de login', () => {
    renderLogin();
    expect(screen.getByText('LoginForm')).toBeTruthy();
  });
});