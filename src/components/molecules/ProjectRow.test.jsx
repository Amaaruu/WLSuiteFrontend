import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProjectRow from './ProjectRow';

describe('Molécula: <ProjectRow />', () => {
  // Creamos un proyecto de prueba reutilizable
  const proyectoMock = {
    projectName: 'Landing Page IA',
    projectIdea: 'Plataforma de cursos online',
    status: 'ready',
    createdAt: '2026-06-14T12:00:00Z',
    signedUrl: 'https://miservidor.com/preview/123'
  };

  it('Debe renderizar la información básica del proyecto', () => {
    render(<ProjectRow project={proyectoMock} />);
    
    expect(screen.getByText('Landing Page IA')).toBeInTheDocument();
    expect(screen.getByText('Plataforma de cursos online')).toBeInTheDocument();
  });

  it('Debe formatear la fecha correctamente a formato chileno (es-CL)', () => {
    render(<ProjectRow project={proyectoMock} />);
    
    expect(screen.getByText(/14 de junio de 2026/i)).toBeInTheDocument();
  });

  it('Debe mostrar un guion "—" si el proyecto no tiene fecha de creación', () => {
    const proyectoSinFecha = { ...proyectoMock, createdAt: null };
    render(<ProjectRow project={proyectoSinFecha} />);
    
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  describe('Renderizado del enlace (Ver página)', () => {
    it('Debe mostrar el botón de enlace si showLink es true y signedUrl existe', () => {
      render(<ProjectRow project={proyectoMock} showLink={true} />);
      
      const enlace = screen.getByRole('link');
      expect(enlace).toBeInTheDocument();
      expect(enlace).toHaveAttribute('href', proyectoMock.signedUrl);
      expect(enlace).toHaveAttribute('target', '_blank');
      expect(screen.getByText('Ver página')).toBeInTheDocument();
    });

    it('No debe mostrar el botón de enlace si showLink es false', () => {
      render(<ProjectRow project={proyectoMock} showLink={false} />);
      expect(screen.queryByText('Ver página')).toBeNull();
    });

    it('No debe mostrar el botón de enlace si signedUrl no existe', () => {
      const proyectoSinUrl = { ...proyectoMock, signedUrl: null };
      render(<ProjectRow project={proyectoSinUrl} showLink={true} />);
      
      expect(screen.queryByText('Ver página')).toBeNull();
    });
  });

  describe('Renderizado y acción del botón Eliminar', () => {
    it('Debe renderizar el botón de eliminar y llamar a onDelete con el proyecto', () => {
      const mockOnDelete = vi.fn();
      render(<ProjectRow project={proyectoMock} onDelete={mockOnDelete} />);
      
      const botonEliminar = screen.getByTitle('Eliminar proyecto');
      expect(botonEliminar).toBeInTheDocument();
      
      fireEvent.click(botonEliminar);
      
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith(proyectoMock);
    });

    it('Debe deshabilitar el botón de eliminar cuando isDeleting es true', () => {
      const mockOnDelete = vi.fn();
      render(<ProjectRow project={proyectoMock} onDelete={mockOnDelete} isDeleting={true} />);
      
      const botonEliminar = screen.getByTitle('Eliminar proyecto');
      
      expect(botonEliminar).toBeDisabled();
      
      fireEvent.click(botonEliminar);
      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });
});