import { render, screen } from '@testing-library/react';
import InfiniteMarquee from './InfiniteMarquee';

vi.mock('framer-motion', () => ({
  motion: { div: ({ children, style }) => <div style={style}>{children}</div> },
  useAnimationFrame: vi.fn(),
  useMotionValue: (val) => ({ get: () => val, set: vi.fn() }),
  useTransform: (val, fn) => val,
}));

const templates = [
  { id: 1, title: 'Landing Tech', description: 'Para startups tech', category: 'Tecnología', imageUrl: '' },
  { id: 2, title: 'Landing Café', description: 'Para cafeterías', category: 'Gastronomía', imageUrl: '' },
  { id: 3, title: 'Landing Gym', description: 'Para gimnasios', category: 'Fitness', imageUrl: '' },
];

describe('InfiniteMarquee', () => {
  it('no renderiza nada si no hay templates', () => {
    const { container } = render(<InfiniteMarquee templates={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renderiza los títulos de los templates', () => {
    render(<InfiniteMarquee templates={templates} />);
    expect(screen.getAllByText('Landing Tech').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Landing Café').length).toBeGreaterThan(0);
  });

  it('renderiza dos filas (left y right)', () => {
    const { container } = render(<InfiniteMarquee templates={templates} />);
    expect(container.firstChild.children.length).toBe(2);
  });
});
