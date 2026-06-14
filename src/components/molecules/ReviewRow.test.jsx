import { render, screen, fireEvent } from '@testing-library/react';
import ReviewRow from './ReviewRow';

describe('ReviewRow', () => {
  it('muestra el label', () => {
    render(<ReviewRow label="Nombre" value="Mi empresa" />);
    expect(screen.getByText('Nombre')).toBeTruthy();
  });

  it('muestra el valor', () => {
    render(<ReviewRow label="Nombre" value="Mi empresa" />);
    expect(screen.getByText('Mi empresa')).toBeTruthy();
  });

  it('muestra emptyText cuando no hay valor', () => {
    render(<ReviewRow label="Sitio web" value="" />);
    expect(screen.getByText('No especificado')).toBeTruthy();
  });

  it('muestra botón Editar si se pasa onEdit', () => {
    render(<ReviewRow label="Nombre" value="Test" onEdit={() => {}} />);
    expect(screen.getByText('Editar')).toBeTruthy();
  });

  it('llama onEdit al hacer clic en Editar', () => {
    const handleEdit = vi.fn();
    render(<ReviewRow label="Nombre" value="Test" onEdit={handleEdit} />);
    fireEvent.click(screen.getByText('Editar'));
    expect(handleEdit).toHaveBeenCalledTimes(1);
  });
});