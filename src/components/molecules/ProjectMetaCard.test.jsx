import { render, screen } from '@testing-library/react';
import ProjectMetaCard from './ProjectMetaCard';

describe('ProjectMetaCard', () => {
  it('muestra el label y el valor', () => {
    render(<ProjectMetaCard icon="🎯" label="Sector" value="Tecnología" />);
    expect(screen.getByText('Sector')).toBeTruthy();
    expect(screen.getByText('Tecnología')).toBeTruthy();
  });

  it('muestra el icono', () => {
    render(<ProjectMetaCard icon="🎯" label="Sector" value="Tecnología" />);
    expect(screen.getByText('🎯')).toBeTruthy();
  });

  it('no renderiza nada si no hay value', () => {
    const { container } = render(<ProjectMetaCard icon="🎯" label="Sector" value="" />);
    expect(container.firstChild).toBeNull();
  });
});