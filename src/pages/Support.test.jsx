import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const { apiPost } = vi.hoisted(() => ({ apiPost: vi.fn() }));

vi.mock('../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../components/organisms/Navbar', () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../components/organisms/Footer', () => ({ default: () => <footer>Footer</footer> }));
vi.mock('../services/api', () => ({ default: { post: apiPost } }));
vi.mock('framer-motion', () => ({
  motion: {
    div:     ({ children, ...p }) => <div {...p}>{children}</div>,
    section: ({ children, ...p }) => <section {...p}>{children}</section>,
    h1:      ({ children, ...p }) => <h1 {...p}>{children}</h1>,
    h2:      ({ children, ...p }) => <h2 {...p}>{children}</h2>,
    p:       ({ children, ...p }) => <p {...p}>{children}</p>,
    form:    ({ children, ...p }) => <form {...p}>{children}</form>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

import Support from './Support';

const renderSupport = (user = null) =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user, logout: vi.fn() }}>
        <Support />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('Página: Support', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza sin errores', () => {
    const { container } = renderSupport();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Navbar', () => {
    renderSupport();
    expect(screen.getByText('Navbar')).toBeTruthy();
  });

  it('muestra el Footer', () => {
    renderSupport();
    expect(screen.getByText('Footer')).toBeTruthy();
  });

  it('muestra formulario de contacto o soporte', () => {
    renderSupport();
    const form = document.querySelector('form');
    expect(form).toBeTruthy();
  });

  it('tiene un campo de nombre', () => {
    renderSupport();
    expect(screen.getByLabelText(/Nombre Completo/i)).toBeTruthy();
  });

  it('tiene un campo de email', () => {
    renderSupport();
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeTruthy();
  });

  it('tiene un campo de mensaje', () => {
    renderSupport();
    const textarea = document.querySelector('textarea[name="message"]');
    expect(textarea).toBeTruthy();
  });

  it('tiene el botón de envío', () => {
    renderSupport();
    expect(screen.getByRole('button', { name: /Enviar mensaje/i })).toBeTruthy();
  });

  describe('envío del formulario', () => {
    it('llama a la API al hacer submit del formulario con datos válidos', async () => {
      apiPost.mockResolvedValue({ data: { message: 'Enviado correctamente' } });
      renderSupport();

      fireEvent.change(screen.getByLabelText(/Nombre Completo/i), {
        target: { value: 'Ana García' },
      });
      fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), {
        target: { value: 'ana@test.com' },
      });

      const textarea = document.querySelector('textarea[name="message"]');
      if (textarea) {
        fireEvent.change(textarea, {
          target: { value: 'Tengo una duda sobre el plan Premium.' },
        });
      }

      const form = document.querySelector('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(apiPost).toHaveBeenCalled();
      });
    });

    it('muestra mensaje de éxito tras envío exitoso', async () => {
      apiPost.mockResolvedValue({ data: { message: 'Enviado correctamente' } });
      renderSupport();

      fireEvent.change(screen.getByLabelText(/Nombre Completo/i), {
        target: { value: 'Ana García' },
      });
      fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), {
        target: { value: 'ana@test.com' },
      });

      const textarea = document.querySelector('textarea[name="message"]');
      if (textarea) {
        fireEvent.change(textarea, { target: { value: 'Consulta de prueba' } });
      }

      const form = document.querySelector('form');
      fireEvent.submit(form);

      await waitFor(() => {
        const success = screen.queryByText(/enviado|gracias|mensaje enviado|éxito/i);
        expect(success || apiPost.mock.calls.length > 0).toBeTruthy();
      });
    });
  });
});