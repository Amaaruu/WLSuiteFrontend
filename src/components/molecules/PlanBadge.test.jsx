import { render, screen } from '@testing-library/react';
import PlanBadge from './PlanBadge';

describe('PlanBadge', () => {
  it('muestra el nombre del plan', () => {
    render(<PlanBadge planName="Premium" transactionId="abc123" />);
    expect(screen.getByText(/Premium/)).toBeTruthy();
  });

  it('muestra el ID de transacción', () => {
    render(<PlanBadge planName="Básico" transactionId="tx-001" />);
    expect(screen.getByText(/tx-001/)).toBeTruthy();
  });
});