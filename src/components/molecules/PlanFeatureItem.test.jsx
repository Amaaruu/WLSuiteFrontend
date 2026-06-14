import { render, screen } from '@testing-library/react';
import PlanFeatureItem from './PlanFeatureItem';

describe('PlanFeatureItem', () => {
  it('muestra el texto cuando es string', () => {
    render(<ul><PlanFeatureItem feature="Landing page con IA" /></ul>);
    expect(screen.getByText('Landing page con IA')).toBeTruthy();
  });

  it('muestra el texto cuando es objeto incluido', () => {
    render(<ul><PlanFeatureItem feature={{ text: 'Motor IA', included: true }} /></ul>);
    expect(screen.getByText('Motor IA')).toBeTruthy();
  });

  it('muestra el texto tachado cuando no está incluido', () => {
    render(<ul><PlanFeatureItem feature={{ text: 'Animaciones', included: false }} /></ul>);
    const item = screen.getByText('Animaciones');
    expect(item.className).toContain('line-through');
  });
});