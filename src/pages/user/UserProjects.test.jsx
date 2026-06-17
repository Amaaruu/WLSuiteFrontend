import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

vi.mock('../../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../../components/organisms/Navbar',  () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../../components/organisms/Footer',  () => ({ default: () => <footer>Footer</footer> }));
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        content: [
          { projectId: 1, projectName: 'Mi Tienda', status: 'Ready', createdAt: '2024-01-01' },
        ],
      },
    }),
    delete: vi.fn().mockResolvedValue({}),
  },
}));
vi.mock('../../components/molecules/ProjectRow', () => ({
  default: ({ project }) => <div data-testid="project-row">{project.projectName}</div>,
}));

import UserProjects from './UserProjects';

const mockUser = { name: 'Juan', email: 'juan@test.com', role: 'user' };

const renderProjects = (user = mockUser) =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user, logout: vi.fn() }}>
        <UserProjects />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Página: UserProjects', () => {
  it('renderiza sin errores', () => {
    const { container } = renderProjects();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Navbar', () => {
    renderProjects();
    expect(screen.getByText('Navbar')).toBeTruthy();
  });

  it('muestra el Footer', () => {
    renderProjects();
    expect(screen.getByText('Footer')).toBeTruthy();
  });

  it('muestra el título Mis proyectos', () => {
    renderProjects();
    expect(screen.getByText('Mis proyectos')).toBeTruthy();
  });
});