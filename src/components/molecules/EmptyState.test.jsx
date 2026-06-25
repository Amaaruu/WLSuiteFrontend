import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom'; // IMPORTANTE para simular rutas
import EmptyState from './EmptyState';

describe('Molécula: <EmptyState />', () => {
  it('Debe renderizar solo el mensaje cuando no hay botón de acción', () => {
    render(<EmptyState message="No hay proyectos disponibles" />);
    
    expect(screen.getByText('No hay proyectos disponibles')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('Debe renderizar el botón y el enlace correctamente cuando se pasan los props de acción', () => {
    render(
      <MemoryRouter>
        <EmptyState 
          message="Aún no tienes facturas" 
          actionLabel="Crear Nueva" 
          actionTo="/crear-factura" 
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Aún no tienes facturas')).toBeInTheDocument();

    expect(screen.getByText('Crear Nueva')).toBeInTheDocument();

    const enlace = screen.getByRole('link');
    expect(enlace).toBeInTheDocument();
    expect(enlace).toHaveAttribute('href', '/crear-factura');
  });
});