import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

vi.mock('../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../components/organisms/Navbar', () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../components/organisms/RegisterForm', () => ({ default: () => <div>RegisterForm</div> }));

import Register from './Register';

const renderRegister = () =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: null, logout: vi.fn() }}>
        <Register />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Página: Register', () => {
  it('renderiza sin errores', () => {
    const { container } = renderRegister();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Navbar', () => {
    renderRegister();
    expect(screen.getByText('Navbar')).toBeTruthy();
  });

  it('muestra el formulario de registro', () => {
    renderRegister();
    expect(screen.getByText('RegisterForm')).toBeTruthy();
  });
});