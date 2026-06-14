import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PlanModal from './PlanModal';

describe('Molécula: <PlanModal />', () => {

  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderizado Condicional (Crear vs Editar)', () => {
    it('Debe renderizar la interfaz de "Nuevo plan" cuando la prop plan es null', () => {
      render(<PlanModal plan={null} onClose={mockOnClose} onSave={mockOnSave} />);
      
      expect(screen.getByText('Nuevo plan')).toBeInTheDocument();
      expect(screen.getByText('Completa los campos para crear un nuevo plan.')).toBeInTheDocument();
      expect(screen.getByText('Crear plan')).toBeInTheDocument();
      
      const inputName = screen.getByPlaceholderText('Ej: Básico, Intermedio, Premium');
      expect(inputName).toHaveValue('');
    });

    it('Debe renderizar la interfaz de "Editar plan" con los datos precargados', () => {
      const planExistente = { name: 'Avanzado', description: 'Plan corporativo', price: 50000 };
      render(<PlanModal plan={planExistente} onClose={mockOnClose} onSave={mockOnSave} />);
      
      expect(screen.getByText('Editar plan')).toBeInTheDocument();
      expect(screen.getByText('Modificando: Avanzado')).toBeInTheDocument();
      expect(screen.getByText('Guardar cambios')).toBeInTheDocument();
      
      const inputName = screen.getByPlaceholderText('Ej: Básico, Intermedio, Premium');
      expect(inputName).toHaveValue('Avanzado');
      
      const inputPrice = screen.getByPlaceholderText('0');
      expect(inputPrice).toHaveValue(50000);
    });
  });

  describe('Validaciones del Formulario', () => {
    it('Debe mostrar errores si se intenta guardar con campos vacíos o inválidos', () => {
      render(<PlanModal plan={null} onClose={mockOnClose} onSave={mockOnSave} />);
      
      const botonCrear = screen.getByText('Crear plan');
      fireEvent.click(botonCrear);
      
      expect(mockOnSave).not.toHaveBeenCalled();
      
      expect(screen.getByText('El nombre debe tener al menos 3 caracteres.')).toBeInTheDocument();
      expect(screen.getByText('La descripción es obligatoria.')).toBeInTheDocument();
      expect(screen.getByText('El precio debe ser un número positivo.')).toBeInTheDocument();
    });

    it('Debe limpiar el error de un campo cuando el usuario empieza a escribir en él', () => {
      render(<PlanModal plan={null} onClose={mockOnClose} onSave={mockOnSave} />);
      
      fireEvent.click(screen.getByText('Crear plan'));
      expect(screen.getByText('El nombre debe tener al menos 3 caracteres.')).toBeInTheDocument();
      
      const inputName = screen.getByPlaceholderText('Ej: Básico, Intermedio, Premium');
      fireEvent.change(inputName, { target: { name: 'name', value: 'Prueba' } });
      
      expect(screen.queryByText('El nombre debe tener al menos 3 caracteres.')).toBeNull();
    });
  });

  describe('Interacción y Guardado', () => {
    it('Debe llamar a onSave con los datos correctos al completar el formulario', () => {
      render(<PlanModal plan={null} onClose={mockOnClose} onSave={mockOnSave} />);
      
      fireEvent.change(screen.getByPlaceholderText('Ej: Básico, Intermedio, Premium'), { target: { name: 'name', value: 'Plan Elite' } });
      fireEvent.change(screen.getByPlaceholderText('Describe brevemente qué incluye este plan...'), { target: { name: 'description', value: 'Acceso total' } });
      fireEvent.change(screen.getByPlaceholderText('0'), { target: { name: 'price', value: '99990' } });
      
      fireEvent.click(screen.getByText('Crear plan'));
      
      expect(mockOnSave).toHaveBeenCalledTimes(1);
      expect(mockOnSave).toHaveBeenCalledWith({
        name: 'Plan Elite',
        description: 'Acceso total',
        price: 99990
      });
    });

    it('Debe llamar a onClose cuando se hace clic en Cancelar o en la X', () => {
      render(<PlanModal plan={null} onClose={mockOnClose} onSave={mockOnSave} />);
      
      fireEvent.click(screen.getByText('Cancelar'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('Debe deshabilitar los inputs y mostrar estado de carga cuando isSaving es true', () => {
      render(<PlanModal plan={null} onClose={mockOnClose} onSave={mockOnSave} isSaving={true} />);
      
      expect(screen.getByPlaceholderText('Ej: Básico, Intermedio, Premium')).toBeDisabled();
      expect(screen.getByPlaceholderText('Describe brevemente qué incluye este plan...')).toBeDisabled();
      expect(screen.getByPlaceholderText('0')).toBeDisabled();
      
      expect(screen.getByText('Guardando...')).toBeInTheDocument();
      expect(screen.getByText('Cancelar')).toBeDisabled();
    });

    it('Debe mostrar el mensaje de error de la API si recibe la prop error', () => {
      const errorAPI = "El servidor no responde";
      render(<PlanModal plan={null} onClose={mockOnClose} onSave={mockOnSave} error={errorAPI} />);
      
      expect(screen.getByText(errorAPI)).toBeInTheDocument();
    });
  });
});