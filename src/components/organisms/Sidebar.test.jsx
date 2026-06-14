import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';
import { AuthContext } from '../../context/AuthContext'; 

const mockAuthValue = {
  user: { name: 'Admin', email: 'admin@test.com' },
  logout: vi.fn(),
};

const renderSidebar = () =>
  render(
    <AuthContext.Provider value={mockAuthValue}>
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    </AuthContext.Provider>
  );

describe('Organismo: <Sidebar />', () => {
  it('renderiza sin errores', () => {
    const { container } = renderSidebar();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra items de navegación', () => {
    renderSidebar();
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('muestra al menos un elemento de texto', () => {
  
    const { container } = renderSidebar();
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});