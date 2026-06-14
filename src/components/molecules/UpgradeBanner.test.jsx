// src/components/molecules/UpgradeBanner.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UpgradeBanner from './UpgradeBanner';

// 1. MOCKEAMOS EL HOOK: Interceptamos 'react-router-dom' para controlar useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom'); // Mantenemos el resto de la librería intacta
  return {
    ...actual,
    useNavigate: () => mockNavigate, // Sobrescribimos solo useNavigate
  };
});

describe('Molécula: <UpgradeBanner />', () => {

  // Limpiamos la memoria del espía antes de cada test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Debe renderizar la invitación al Plan Intermedio si el planLevel es 1 (Básico)', () => {
    render(<UpgradeBanner planLevel={1} />);
    
    // Validamos los textos específicos del nivel 1
    expect(screen.getByText('Desbloquea más funciones con el Plan Intermedio')).toBeInTheDocument();
    expect(screen.getByText(/Actualiza al Plan Intermedio para desbloquear el tono de comunicación/i)).toBeInTheDocument();
  });

  it('Debe renderizar la invitación al Plan Premium si el planLevel es 2 (Intermedio)', () => {
    render(<UpgradeBanner planLevel={2} />);
    
    // Validamos los textos específicos del nivel 2
    expect(screen.getByText('Desbloquea más funciones con el Plan Premium')).toBeInTheDocument();
    expect(screen.getByText(/Actualiza al Plan Premium para desbloquear el nivel de animación/i)).toBeInTheDocument();
  });

  it('No debe renderizar nada (null) si el planLevel es 3 (Premium) u otro no configurado', () => {
    // Escenario: El usuario ya es Premium
    const { container: containerPremium } = render(<UpgradeBanner planLevel={3} />);
    expect(containerPremium.firstChild).toBeNull();

    // Escenario: Nivel inválido
    const { container: containerInvalido } = render(<UpgradeBanner planLevel={99} />);
    expect(containerInvalido.firstChild).toBeNull();
  });

  it('Debe llamar a navigate con la ruta "/planes" al hacer clic en el botón', () => {
    render(<UpgradeBanner planLevel={1} />);
    
    const boton = screen.getByRole('button', { name: 'Ver planes' });
    fireEvent.click(boton);
    
    // Verificamos que nuestro mock de useNavigate se disparó exactamente una vez hacia '/planes'
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/planes');
  });
});