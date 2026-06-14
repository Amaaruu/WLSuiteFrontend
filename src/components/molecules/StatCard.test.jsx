import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import StatCard from './StatCard';

describe('Molécula: <StatCard />', () => {
  it('Debe renderizar los datos (label, value, sublabel) como una tarjeta estática si no hay prop "to"', () => {
    render(
      <StatCard 
        label="Proyectos Activos" 
        value="15" 
        sublabel="+2 esta semana" 
      />
    );


    expect(screen.getByText('Proyectos Activos')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('+2 esta semana')).toBeInTheDocument();

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('Debe envolver la tarjeta en un <Link> si se proporciona la prop "to"', () => {
    render(
      <MemoryRouter>
        <StatCard 
          label="Usuarios Registrados" 
          value="1,024" 
          to="/admin/usuarios" 
        />
      </MemoryRouter>
    );


    expect(screen.getByText('Usuarios Registrados')).toBeInTheDocument();
    expect(screen.getByText('1,024')).toBeInTheDocument();

    const enlace = screen.getByRole('link');
    expect(enlace).toBeInTheDocument();
    expect(enlace).toHaveAttribute('href', '/admin/usuarios');
  });
});