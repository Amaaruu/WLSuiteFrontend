import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

vi.mock('../../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));

describe('Footer', () => {
  it('renderiza el nombre de la marca', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>);
    const marcaElements = screen.getAllByText(/WebLanding/i);
    expect(marcaElements.length).toBeGreaterThan(0);
  });
  it('muestra los links de navegación', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>);
    expect(screen.getByText('Plantillas IA')).toBeTruthy();
    expect(screen.getByText('Planes de Precios')).toBeTruthy();
  });

  it('muestra el año actual en el copyright', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeTruthy();
  });
});
