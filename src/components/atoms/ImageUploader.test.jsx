import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ImageUploader from './ImageUploader';
import api from '../../services/api';

vi.mock('../../services/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('Átomo: <ImageUploader />', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  it('Debe renderizar el estado vacío por defecto con las instrucciones', () => {
    render(<ImageUploader />);
    expect(screen.getByText('Arrastra una imagen o haz clic para seleccionar')).toBeInTheDocument();
    expect(screen.getByText('Imagen')).toBeInTheDocument();
  });

  it('Debe renderizar la imagen si se le pasa la prop "value"', () => {
    const urlImagen = 'https://miservidor.com/mi-imagen.jpg';
    render(<ImageUploader value={urlImagen} />);
    const imagenRenderizada = screen.getByRole('img');
    expect(imagenRenderizada).toHaveAttribute('src', urlImagen);
  });

  it('Debe mostrar un error de validación si el tipo de archivo no es permitido', async () => {
    render(<ImageUploader />);
    
    const archivoInvalido = new File(['hola'], 'texto.txt', { type: 'text/plain' });

    const inputFalso = document.querySelector('input[type="file"]');
    
    fireEvent.change(inputFalso, { target: { files: [archivoInvalido] } });
    
    expect(await screen.findByText(/Tipo no permitido/i)).toBeInTheDocument();
  });

  it('Debe mostrar un error de validación si el archivo es mayor a 5MB', async () => {
    render(<ImageUploader />);
    
    const archivoPesado = new File([''], 'foto.jpg', { type: 'image/jpeg' });
    Object.defineProperty(archivoPesado, 'size', { value: 6 * 1024 * 1024 });
    
    const inputFalso = document.querySelector('input[type="file"]');
    fireEvent.change(inputFalso, { target: { files: [archivoPesado] } });
    
    expect(await screen.findByText(/El archivo supera 5MB/i)).toBeInTheDocument();
  });

  it('Debe subir la imagen exitosamente y llamar a onChange', async () => {
    const mockOnChange = vi.fn();
    render(<ImageUploader onChange={mockOnChange} />);
    
    api.post.mockResolvedValueOnce({
      data: { imageUrl: 'https://cdn.miservidor.com/imagen-subida.jpg' }
    });

    const archivoValido = new File(['dummy content'], 'foto.jpg', { type: 'image/jpeg' });
    Object.defineProperty(archivoValido, 'size', { value: 1024 }); // 1KB

    const inputFalso = document.querySelector('input[type="file"]');
    fireEvent.change(inputFalso, { target: { files: [archivoValido] } });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('https://cdn.miservidor.com/imagen-subida.jpg');
    });
  });

  it('Debe llamar a onChange con null al hacer clic en Eliminar', () => {
    const mockOnChange = vi.fn();
    render(<ImageUploader value="https://imagen.com/foto.jpg" onChange={mockOnChange} />);
    
    const botonEliminar = screen.getByText('Eliminar');
    fireEvent.click(botonEliminar);

    expect(mockOnChange).toHaveBeenCalledWith(null);
  });
});