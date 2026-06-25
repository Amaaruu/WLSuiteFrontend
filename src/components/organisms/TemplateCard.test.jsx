import { render, screen } from '@testing-library/react';
import TemplateCard from './TemplateCard';

const mockTemplate = {
  id: 1,
  title: 'Landing de Tecnología',
  description: 'Una landing moderna para startups tech',
  category: 'Tecnología',
  imageUrl: 'https://example.com/image.jpg',
};

describe('TemplateCard', () => {
  it('muestra el título', () => {
    render(<TemplateCard template={mockTemplate} />);
    expect(screen.getByText('Landing de Tecnología')).toBeTruthy();
  });

  it('muestra la descripción', () => {
    render(<TemplateCard template={mockTemplate} />);
    expect(screen.getByText('Una landing moderna para startups tech')).toBeTruthy();
  });

  it('muestra la categoría', () => {
    render(<TemplateCard template={mockTemplate} />);
    expect(screen.getByText('Tecnología')).toBeTruthy();
  });

  it('muestra badge Responsive', () => {
    render(<TemplateCard template={mockTemplate} />);
    expect(screen.getByText('Responsive')).toBeTruthy();
  });
});
