import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import PricingCard from './PricingCard';

// 1. Mocks de servicios y configuración
vi.mock('../../services/api', () => ({
  default: { post: vi.fn().mockResolvedValue({ data: { transactionId: 'tx-001' } }) }
}));

vi.mock('../../config/plansConfig', () => ({
  getPlanConfig: () => ({
    badge: 'Más popular',
    icon: '⭐',
    tagline: 'El más elegido',
    description: 'Todo lo que necesitas',
    features: [{ text: 'Landing page con IA', included: true }],
    idealFor: 'Emprendedores',
    ctaLabel: 'Elegir este plan',
  })
}));

// 2. EL TRUCO: Definimos el espía globalmente
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  // Hacemos que useNavigate siempre devuelva nuestro espía
  return { ...actual, useNavigate: () => mockNavigate };
});

const freePlan = { planId: 1, name: 'Básico', price: 0, features: [] };
const paidPlan = { planId: 2, name: 'Intermedio', price: 29, features: [] };

describe('Organismo: <PricingCard />', () => {
  
  // Limpiamos el espía antes de cada test para que no se acumulen las llamadas
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el nombre del plan', () => {
    render(<MemoryRouter><AuthContext.Provider value={{ user: null }}><PricingCard plan={paidPlan} /></AuthContext.Provider></MemoryRouter>);
    expect(screen.getByText('Intermedio')).toBeTruthy();
  });

  it('muestra "Gratis" para el plan gratuito', () => {
    render(<MemoryRouter><AuthContext.Provider value={{ user: null }}><PricingCard plan={freePlan} /></AuthContext.Provider></MemoryRouter>);
    expect(screen.getByText('Gratis')).toBeTruthy();
  });

  it('muestra el precio en USD para planes de pago', () => {
    render(<MemoryRouter><AuthContext.Provider value={{ user: null }}><PricingCard plan={paidPlan} /></AuthContext.Provider></MemoryRouter>);
    expect(screen.getByText('$29')).toBeTruthy();
    expect(screen.getByText('USD / único')).toBeTruthy();
  });

  it('muestra "Comenzar Gratis" para plan gratuito', () => {
    render(<MemoryRouter><AuthContext.Provider value={{ user: null }}><PricingCard plan={freePlan} /></AuthContext.Provider></MemoryRouter>);
    expect(screen.getByText('Comenzar Gratis')).toBeTruthy();
  });

  it('redirige a /login si no hay usuario autenticado al seleccionar plan', () => {
    render(<MemoryRouter><AuthContext.Provider value={{ user: null }}><PricingCard plan={paidPlan} /></AuthContext.Provider></MemoryRouter>);
    
    // Hacemos clic en el botón
    fireEvent.click(screen.getByText('Elegir este plan'));
    
    // Validamos usando el mockNavigate global que definimos arriba. ¡Sin usar require!
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('muestra las features del plan', () => {
    render(<MemoryRouter><AuthContext.Provider value={{ user: null }}><PricingCard plan={paidPlan} /></AuthContext.Provider></MemoryRouter>);
    expect(screen.getByText('Landing page con IA')).toBeTruthy();
  });
});