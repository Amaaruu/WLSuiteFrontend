import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from './ConfirmModal';

describe('ConfirmModal', () => {
  it('muestra el título por defecto', () => {
    render(<ConfirmModal onConfirm={() => {}} onClose={() => {}} />);
    expect(screen.getByText('¿Estás seguro?')).toBeTruthy();
  });

  it('muestra el título personalizado', () => {
    render(<ConfirmModal title="¿Eliminar proyecto?" onConfirm={() => {}} onClose={() => {}} />);
    expect(screen.getByText('¿Eliminar proyecto?')).toBeTruthy();
  });

  it('llama onClose al hacer clic en Cancelar', () => {
    const handleClose = vi.fn();
    render(<ConfirmModal onConfirm={() => {}} onClose={handleClose} />);
    fireEvent.click(screen.getByText('Cancelar'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('llama onConfirm al hacer clic en el botón de confirmar', () => {
    const handleConfirm = vi.fn();
    render(<ConfirmModal onConfirm={handleConfirm} onClose={() => {}} />);
    fireEvent.click(screen.getByText('Eliminar'));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('muestra estado de carga cuando isLoading es true', () => {
    render(<ConfirmModal onConfirm={() => {}} onClose={() => {}} isLoading />);
    expect(screen.getByText('Eliminando...')).toBeTruthy();
  });
});