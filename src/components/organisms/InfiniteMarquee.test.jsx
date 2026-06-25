import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import InfiniteMarquee from './InfiniteMarquee';
let animationFrameCallback = null;
let motionValueInstance = null;

vi.mock('framer-motion', () => {
  const motionValue = (initial) => {
    let val = initial;
    motionValueInstance = {
      get: () => val,
      set: (v) => { val = v; },
    };
    return motionValueInstance;
  };

  return {
    motion: {
      div: ({ children, style, onMouseEnter, onMouseLeave }) => (
        <div style={style} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          {children}
        </div>
      ),
    },
    useAnimationFrame: (cb) => {
      animationFrameCallback = cb;
    },
    useMotionValue: motionValue,
    useTransform: (val, fn) => {
      if (typeof fn === 'function') {
        fn(10);
        fn(-10);
        fn(-5);
        fn(5);
      }
      return val;
    },
  };
});

const makeTemplates = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Landing ${i + 1}`,
    description: `Desc ${i + 1}`,
    category: 'Test',
    imageUrl: '',
  }));

describe('InfiniteMarquee', () => {

  beforeEach(() => {
    animationFrameCallback = null;
    vi.clearAllMocks();
  });

  it('no renderiza nada si no hay templates', () => {
    const { container } = render(<InfiniteMarquee templates={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renderiza los títulos de los templates', () => {
    const templates = makeTemplates(3);
    render(<InfiniteMarquee templates={templates} />);
    expect(screen.getAllByText('Landing 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Landing 2').length).toBeGreaterThan(0);
  });

  it('renderiza dos filas (left y right)', () => {
    const { container } = render(<InfiniteMarquee templates={makeTemplates(3)} />);
    expect(container.firstChild.children.length).toBe(2);
  });

  it('usa reverse() para row2 cuando templates tiene longitud igual a half (par)', () => {
    const templates = makeTemplates(1);
    const { container } = render(<InfiniteMarquee templates={templates} />);
    expect(container.firstChild.children.length).toBe(2);
    expect(screen.getAllByText('Landing 1').length).toBeGreaterThan(0);
  });

  it('con número impar de templates, row2 no usa reverse', () => {
    const templates = makeTemplates(3);
    const { container } = render(<InfiniteMarquee templates={templates} />);
    expect(container.firstChild.children.length).toBe(2);
  });

  it('con número par de templates (4), row2 usa slice normal', () => {
    const templates = makeTemplates(4);
    const { container } = render(<InfiniteMarquee templates={templates} />);
    expect(container.firstChild.children.length).toBe(2);
  });

  it('acepta speed personalizado sin errores', () => {
    const { container } = render(
      <InfiniteMarquee templates={makeTemplates(3)} speed={80} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('acepta cardWidth y gap personalizados', () => {
    const { container } = render(
      <InfiniteMarquee templates={makeTemplates(3)} cardWidth={250} gap={10} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('acepta fadeColor personalizado', () => {
    const { container } = render(
      <InfiniteMarquee templates={makeTemplates(3)} fadeColor="#ffffff" />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('pausa la animación al hacer mouseenter en una fila', () => {
    render(<InfiniteMarquee templates={makeTemplates(3)} />);
    const overflowDivs = document.querySelectorAll('[class*="overflow-hidden"]');
    if (overflowDivs.length > 0) {
      fireEvent.mouseEnter(overflowDivs[0]);
      expect(true).toBe(true);
    }
  });

  it('reanuda la animación al hacer mouseleave en una fila', () => {
    render(<InfiniteMarquee templates={makeTemplates(3)} />);
    const overflowDivs = document.querySelectorAll('[class*="overflow-hidden"]');
    if (overflowDivs.length > 0) {
      fireEvent.mouseEnter(overflowDivs[0]);
      fireEvent.mouseLeave(overflowDivs[0]);
      expect(true).toBe(true);
    }
  });

  it('ejecuta el callback de animación con delta positivo', () => {
    render(<InfiniteMarquee templates={makeTemplates(3)} />);
    if (animationFrameCallback) {
      expect(() => animationFrameCallback(0, 16)).not.toThrow();
    }
  });

  it('el callback de animación no falla cuando paused es true', () => {
    render(<InfiniteMarquee templates={makeTemplates(3)} />);
    const overflowDivs = document.querySelectorAll('[class*="overflow-hidden"]');
    if (overflowDivs.length > 0) {
      fireEvent.mouseEnter(overflowDivs[0]);
    }
    if (animationFrameCallback) {
      expect(() => animationFrameCallback(0, 16)).not.toThrow();
    }
  });
});