import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ContactSection from './ContactSection';

vi.mock('../../services/api', () => ({
  default: { post: vi.fn().mockResolvedValue({ data: {} }) }
}));

describe('ContactSection', () => {
  it('muestra la información de contacto', () => {
    render(<ContactSection />);
    expect(screen.getByText('weblandingsuite@gmail.com')).toBeTruthy();
    expect(screen.getByText('Santiago, Chile')).toBeTruthy();
  });

  it('muestra el campo de nombre', () => {
    render(<ContactSection />);
    expect(screen.getByLabelText('Nombre Completo')).toBeTruthy();
  });

  it('muestra el campo de email', () => {
    render(<ContactSection />);
    expect(screen.getByLabelText('Correo Electrónico')).toBeTruthy();
  });

  it('muestra el campo de mensaje', () => {
    render(<ContactSection />);
    expect(screen.getByText('Mensaje o Consulta')).toBeTruthy();
  });
  it('muestra el botón de enviar', () => {
    render(<ContactSection />);
    expect(screen.getByText('Enviar mensaje')).toBeTruthy();
  });

  it('muestra éxito al enviar el formulario', async () => {
    render(<ContactSection />);
    fireEvent.change(screen.getByLabelText('Nombre Completo'), { target: { value: 'Juan', name: 'name' } });
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'juan@test.com', name: 'email' } });
    fireEvent.submit(screen.getByText('Enviar mensaje').closest('form'));
    await waitFor(() => expect(screen.getByText(/Mensaje enviado correctamente/)).toBeTruthy());
  });
});
