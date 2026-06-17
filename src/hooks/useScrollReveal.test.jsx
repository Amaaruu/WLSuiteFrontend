import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useScrollReveal } from './useScrollReveal';

let capturedCallback = null;
const observeMock    = vi.fn();
const unobserveMock  = vi.fn();

beforeEach(() => {
  capturedCallback = null;
  observeMock.mockClear();
  unobserveMock.mockClear();
  global.IntersectionObserver = vi.fn(function (cb, options) {
    capturedCallback = cb;
    return {
      observe:    observeMock,
      unobserve:  unobserveMock,
      disconnect: vi.fn(),
    };
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

const TestComponent = ({ options, onData } = {}) => {
  const [ref, isVisible] = useScrollReveal(options);
  onData?.({ isVisible });
  return <div ref={ref} data-testid="target">contenido</div>;
};

describe('useScrollReveal', () => {

  it('isVisible es false inicialmente', () => {
    let data = {};
    render(<TestComponent onData={(d) => { data = d; }} />);
    expect(data.isVisible).toBe(false);
  });

  it('instancia IntersectionObserver y llama a observe sobre el elemento', () => {
    render(<TestComponent />);

    expect(global.IntersectionObserver).toHaveBeenCalledTimes(1);
    expect(observeMock).toHaveBeenCalledTimes(1);

    const observedEl = observeMock.mock.calls[0][0];
    expect(observedEl).toBe(screen.getByTestId('target'));
  });

  it('pasa las opciones correctas al IntersectionObserver', () => {
    const options = { threshold: 0.5, rootMargin: '10px' };
    render(<TestComponent options={options} />);

    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      options
    );
  });

  it('usa threshold 0.1 y rootMargin por defecto si no se pasan opciones', () => {
    render(<TestComponent />);

    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
  });

  it('cambia isVisible a true cuando el elemento intersecta', () => {
    let data = {};
    render(<TestComponent onData={(d) => { data = d; }} />);

    expect(data.isVisible).toBe(false);

    act(() => {
      capturedCallback([
        { isIntersecting: true, target: screen.getByTestId('target') },
      ]);
    });

    expect(data.isVisible).toBe(true);
  });

  it('NO cambia isVisible si isIntersecting es false', () => {
    let data = {};
    render(<TestComponent onData={(d) => { data = d; }} />);

    act(() => {
      capturedCallback([
        { isIntersecting: false, target: screen.getByTestId('target') },
      ]);
    });

    expect(data.isVisible).toBe(false);
  });

  it('llama a unobserve después de que el elemento se vuelve visible', () => {
    render(<TestComponent />);

    act(() => {
      capturedCallback([
        { isIntersecting: true, target: screen.getByTestId('target') },
      ]);
    });

    expect(unobserveMock).toHaveBeenCalledTimes(1);
  });
});