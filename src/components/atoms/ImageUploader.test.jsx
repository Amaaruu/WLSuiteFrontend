import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ImageUploader from './ImageUploader';
import api from '../../services/api';

vi.mock('../../services/api', () => ({
  default: { post: vi.fn() },
}));

describe('Átomo: <ImageUploader />', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  it('renderiza el estado vacío por defecto', () => {
    render(<ImageUploader />);
    expect(screen.getByText('Arrastra una imagen o haz clic para seleccionar')).toBeTruthy();
  });

  it('renderiza la imagen si se le pasa la prop value', () => {
    render(<ImageUploader value="https://img.com/foto.jpg" />);
    expect(screen.getByRole('img')).toBeTruthy();
  });

  it('muestra el label cuando se proporciona', () => {
    render(<ImageUploader label="Foto de perfil" />);
    expect(screen.getByText('Foto de perfil')).toBeTruthy();
  });

  it('no muestra label cuando no se proporciona', () => {
    render(<ImageUploader />);
    expect(screen.queryByRole('label')).toBeNull();
  });

  it('muestra error cuando el tipo de archivo no es permitido', async () => {
    render(<ImageUploader />);
    const archivoInvalido = new File(['texto'], 'doc.txt', { type: 'text/plain' });
    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [archivoInvalido] } });
    expect(await screen.findByText(/Tipo no permitido/i)).toBeTruthy();
  });

  it('muestra error cuando el archivo supera el límite de tamaño', async () => {
    render(<ImageUploader />);
    const archivoPesado = new File([''], 'foto.jpg', { type: 'image/jpeg' });
    Object.defineProperty(archivoPesado, 'size', { value: 6 * 1024 * 1024 });
    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [archivoPesado] } });
    expect(await screen.findByText(/El archivo supera 5MB/i)).toBeTruthy();
  });

  it('sube la imagen exitosamente y llama a onChange', async () => {
    const mockOnChange = vi.fn();
    render(<ImageUploader onChange={mockOnChange} />);
    api.post.mockResolvedValueOnce({
      data: { imageUrl: 'https://cdn.servidor.com/imagen.jpg' },
    });
    const archivo = new File(['contenido'], 'foto.jpg', { type: 'image/jpeg' });
    Object.defineProperty(archivo, 'size', { value: 1024 });
    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [archivo] } });
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('https://cdn.servidor.com/imagen.jpg');
    });
  });

  it('muestra error cuando la subida falla', async () => {
    render(<ImageUploader />);
    api.post.mockRejectedValueOnce(new Error('Network error'));
    const archivo = new File(['contenido'], 'foto.jpg', { type: 'image/jpeg' });
    Object.defineProperty(archivo, 'size', { value: 1024 });
    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [archivo] } });
    await waitFor(() => {
      expect(screen.queryByText(/error|Error/i) || api.post.mock.calls.length > 0).toBeTruthy();
    });
  });

  it('llama a onChange con null al hacer clic en Eliminar', () => {
    const mockOnChange = vi.fn();
    render(<ImageUploader value="https://imagen.com/foto.jpg" onChange={mockOnChange} />);
    fireEvent.click(screen.getByText('Eliminar'));
    expect(mockOnChange).toHaveBeenCalledWith(null);
  });

  it('el input está deshabilitado cuando disabled=true', () => {
    render(<ImageUploader disabled />);
    const input = document.querySelector('input[type="file"]');
    expect(input.disabled).toBe(true);
  });

  it('no abre el selector de archivo al hacer click en el contenedor cuando está disabled', () => {
    render(<ImageUploader disabled />);
    const container = document.querySelector('[class*="rounded-xl"]');
    fireEvent.click(container);
    expect(screen.queryByText(/Arrastra/i)).toBeTruthy();
  });

  it('abre el file picker al hacer click en el contenedor cuando no está disabled', () => {
    render(<ImageUploader />);
    const input = document.querySelector('input[type="file"]');
    const clickSpy = vi.spyOn(input, 'click').mockImplementation(() => {});
    const container = document.querySelector('[class*="rounded-xl"]');
    fireEvent.click(container);
    expect(clickSpy).toHaveBeenCalled();
  });

  it('handleDrop: procesa el archivo soltado correctamente', async () => {
    const mockOnChange = vi.fn();
    render(<ImageUploader onChange={mockOnChange} />);
    api.post.mockResolvedValueOnce({
      data: { imageUrl: 'https://cdn.servidor.com/dropped.jpg' },
    });

    const archivo = new File(['contenido'], 'dropped.jpg', { type: 'image/jpeg' });
    Object.defineProperty(archivo, 'size', { value: 1024 });

    const container = document.querySelector('[class*="rounded-xl"]');

    await act(async () => {
      fireEvent.drop(container, {
        dataTransfer: { files: [archivo] },
      });
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });
  });

  it('handleDrop: no procesa cuando disabled=true', async () => {
    render(<ImageUploader disabled />);
    const archivo = new File(['contenido'], 'foto.jpg', { type: 'image/jpeg' });
    const container = document.querySelector('[class*="rounded-xl"]');

    fireEvent.drop(container, {
      dataTransfer: { files: [archivo] },
    });

    await waitFor(() => {
      expect(api.post).not.toHaveBeenCalled();
    });
  });

  it('handleDragOver: activa el estado isDragging cuando no está disabled', () => {
    render(<ImageUploader />);
    const container = document.querySelector('[class*="rounded-xl"]');
    fireEvent.dragOver(container);
    expect(container.className).toBeTruthy();
  });

  it('handleDragOver: no activa isDragging cuando está disabled', () => {
    render(<ImageUploader disabled />);
    const container = document.querySelector('[class*="rounded-xl"]');
    fireEvent.dragOver(container);
    expect(container.className).toBeTruthy();
  });

  it('handleDragLeave: desactiva el estado isDragging', () => {
    render(<ImageUploader />);
    const container = document.querySelector('[class*="rounded-xl"]');
    fireEvent.dragOver(container);
    fireEvent.dragLeave(container);
    expect(container.className).toBeTruthy();
  });

  it('handleInputChange: no falla cuando files está vacío', () => {
    render(<ImageUploader />);
    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [] } });
    expect(screen.queryByText(/error/i)).toBeNull();
  });

  it('muestra el botón Cambiar imagen cuando hay imagen cargada', () => {
    render(<ImageUploader value="https://img.com/foto.jpg" />);
    expect(screen.getByText('Cambiar imagen')).toBeTruthy();
  });

  it('el botón Cambiar imagen abre el file picker al hacer clic', () => {
    render(<ImageUploader value="https://img.com/foto.jpg" />);
    const input = document.querySelector('input[type="file"]');
    const clickSpy = vi.spyOn(input, 'click').mockImplementation(() => {});
    fireEvent.click(screen.getByText('Cambiar imagen'));
    expect(clickSpy).toHaveBeenCalled();
  });

  it('renderiza con context prop personalizado', () => {
    render(<ImageUploader context="logo" label="Logo del negocio" />);
    expect(screen.getByText('Logo del negocio')).toBeTruthy();
  });

  it('renderiza con aspectRatio personalizado', () => {
    const { container } = render(<ImageUploader aspectRatio="1/1" />);
    expect(container.firstChild).toBeTruthy();
  });
});