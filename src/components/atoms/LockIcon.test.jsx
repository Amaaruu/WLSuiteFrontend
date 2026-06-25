import { render } from '@testing-library/react';
import LockIcon from './LockIcon';

describe('LockIcon', () => {
  it('renderiza el SVG sin errores', () => {
    const { container } = render(<LockIcon />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('aplica el tamaño correcto', () => {
    const { container } = render(<LockIcon size={20} />);
    const svg = container.querySelector('svg');
    expect(svg.getAttribute('width')).toBe('20');
    expect(svg.getAttribute('height')).toBe('20');
  });

  it('tiene aria-hidden para accesibilidad', () => {
    const { container } = render(<LockIcon />);
    expect(container.querySelector('svg').getAttribute('aria-hidden')).toBe('true');
  });
});