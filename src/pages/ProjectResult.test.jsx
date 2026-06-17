import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

vi.mock('../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../components/organisms/Navbar', () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        projectId: 42,
        projectName: 'Mi Tienda',
        status: 'Ready',
        signedUrl: 'https://cdn.test.com/landing?token=abc',
        aiMetadata: null,
      },
    }),
  },
}));

import ProjectResult from './ProjectResult';

const mockUser = { name: 'Juan', role: 'user' };

const renderResult = () =>
  render(
    <MemoryRouter initialEntries={['/project-result/42']}>
      <AuthContext.Provider value={{ user: mockUser, logout: vi.fn() }}>
        <Routes>
          <Route path="/project-result/:projectId" element={<ProjectResult />} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Página: ProjectResult', () => {
  it('renderiza sin errores', () => {
    const { container } = renderResult();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Navbar', () => {
    renderResult();
    expect(screen.getByText('Navbar')).toBeTruthy();
  });

  it('muestra el nombre del proyecto cuando carga', async () => {
    renderResult();
    expect(await screen.findByText('Mi Tienda')).toBeTruthy();
  });
});