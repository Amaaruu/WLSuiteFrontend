import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const { apiGet, apiPost, apiPut, apiDelete } = vi.hoisted(() => ({
  apiGet:    vi.fn(),
  apiPost:   vi.fn(),
  apiPut:    vi.fn(),
  apiDelete: vi.fn(),
}));

vi.mock('../../assets/WebLandingSuiteLogo.webp', () => ({ default: 'logo.webp' }));
vi.mock('../../components/organisms/Sidebar', () => ({
  default: () => <aside>Sidebar</aside>,
}));
vi.mock('../../components/molecules/ErrorBanner', () => ({
  default: ({ message }) => <div data-testid="error-banner">{message}</div>,
}));

vi.mock('../../components/molecules/PlanModal', () => ({
  default: ({ plan, onSave, onClose, isSaving, error }) => {
    const isEditing = !!plan;
    return (
      <div data-testid="plan-modal">
        <h2>{isEditing ? 'Editar plan' : 'Nuevo plan'}</h2>
        {error && <p data-testid="modal-error">{error}</p>}
        <input
          data-testid="input-name"
          placeholder="Ej: Básico, Intermedio, Premium"
          defaultValue={plan?.name || ''}
        />
        <input
          data-testid="input-price"
          placeholder="0"
          defaultValue={plan?.price != null ? String(plan.price) : ''}
        />
        <button
          onClick={() => onSave({
            name: document.querySelector('[data-testid="input-name"]')?.value || 'Plan Test',
            description: 'Descripción test',
            price: 15,
          })}
          disabled={isSaving}
        >
          {isEditing ? 'Guardar cambios' : 'Crear plan'}
        </button>
        <button onClick={onClose}>Cancelar modal</button>
      </div>
    );
  },
}));

vi.mock('../../components/molecules/ConfirmModal', () => ({
  default: ({ title, onConfirm, onClose }) => (
    <div data-testid="confirm-modal">
      <span>{title}</span>
      <button onClick={onConfirm}>Confirmar eliminación</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  ),
}));
vi.mock('lucide-react', () => ({
  RefreshCw:   () => <span>RefreshIcon</span>,
  Plus:        () => <span>PlusIcon</span>,
  Tag:         () => <span>TagIcon</span>,
  Pencil:      () => <span>PencilIcon</span>,
  Trash2:      () => <span>TrashIcon</span>,
  X:           () => <span>XIcon</span>,
  Save:        () => <span>SaveIcon</span>,
  AlertCircle: () => <span>AlertIcon</span>,
}));
vi.mock('../../services/api', () => ({
  default: { get: apiGet, post: apiPost, put: apiPut, delete: apiDelete },
}));

import AdminPlans from './AdminPlans';

const mockPlans = [
  { planId: 1, name: 'Básico',     description: 'Plan de entrada', price: 0  },
  { planId: 2, name: 'Intermedio', description: 'Plan medio',      price: 29 },
  { planId: 3, name: 'Premium',    description: 'Plan completo',   price: 59 },
];

const renderPage = () =>
  render(<MemoryRouter><AdminPlans /></MemoryRouter>);

const waitForTableLoaded = () => screen.findByText('Plan de entrada');

beforeEach(() => {
  apiGet.mockResolvedValue({ data: mockPlans });
  apiPost.mockResolvedValue({
    data: { planId: 4, name: 'Plan Test', description: 'Desc', price: 15 },
  });
  apiPut.mockResolvedValue({
    data: { planId: 1, name: 'Básico Actualizado', description: 'Plan de entrada', price: 0 },
  });
  apiDelete.mockResolvedValue({});
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe('AdminPlans — renderizado base', () => {

  it('renderiza sin errores', () => {
    const { container } = renderPage();
    expect(container.firstChild).toBeTruthy();
  });

  it('muestra el Sidebar', () => {
    renderPage();
    expect(screen.getByText('Sidebar')).toBeTruthy();
  });

  it('muestra el título Planes', () => {
    renderPage();
    expect(screen.getByText('Planes')).toBeTruthy();
  });

  it('muestra los planes cargados de la API', async () => {
    renderPage();
    expect(await waitForTableLoaded()).toBeTruthy();
    expect(screen.getByText('Plan medio')).toBeTruthy();
    expect(screen.getByText('Plan completo')).toBeTruthy();
  });

  it('muestra el conteo correcto de planes', async () => {
    renderPage();
    expect(await screen.findByText(/3 planes activos/)).toBeTruthy();
  });

  it('muestra el botón Nuevo plan', () => {
    renderPage();
    expect(screen.getByText('Nuevo plan')).toBeTruthy();
  });
});

describe('AdminPlans — errores de carga', () => {

  it('muestra error 403 al cargar planes sin permisos', async () => {
    apiGet.mockRejectedValueOnce({ response: { status: 403 } });
    renderPage();
    expect(await screen.findByText(/No tienes permisos para ver los planes/)).toBeTruthy();
  });

  it('muestra error genérico para otros fallos de carga', async () => {
    apiGet.mockRejectedValueOnce({ response: { status: 500 } });
    renderPage();
    expect(await screen.findByText(/No se pudieron cargar los planes/)).toBeTruthy();
  });

  it('muestra ErrorBanner cuando hay error', async () => {
    apiGet.mockRejectedValueOnce({ response: { status: 500 } });
    renderPage();
    expect(await screen.findByTestId('error-banner')).toBeTruthy();
  });

  it('muestra mensaje cuando no hay planes', async () => {
    apiGet.mockResolvedValueOnce({ data: [] });
    renderPage();
    expect(await screen.findByText(/No hay planes creados aún/)).toBeTruthy();
  });
});

describe('AdminPlans — crear plan', () => {

  it('abre el modal al hacer clic en Nuevo plan', async () => {
    renderPage();
    await waitForTableLoaded();
    fireEvent.click(screen.getByText('Nuevo plan'));
    expect(screen.getByTestId('plan-modal')).toBeTruthy();
    expect(screen.getByText('Nuevo plan', { selector: 'h2' })).toBeTruthy();
  });

  it('el modal de creación muestra el título "Nuevo plan"', async () => {
    renderPage();
    await waitForTableLoaded();
    fireEvent.click(screen.getByText('Nuevo plan'));
    expect(screen.getByRole('heading', { name: 'Nuevo plan' })).toBeTruthy();
  });

  it('llama a api.post al guardar un nuevo plan', async () => {
    renderPage();
    await waitForTableLoaded();
    fireEvent.click(screen.getByText('Nuevo plan'));
    fireEvent.click(screen.getByText('Crear plan'));

    await waitFor(() => {
      expect(apiPost).toHaveBeenCalledWith('/plans', expect.objectContaining({
        name: 'Plan Test',
      }));
    });
  });

  it('muestra toast de éxito tras crear plan', async () => {
    renderPage();
    await waitForTableLoaded();
    fireEvent.click(screen.getByText('Nuevo plan'));
    fireEvent.click(screen.getByText('Crear plan'));

    expect(await screen.findByText(/creado correctamente/i)).toBeTruthy();
  });

  it('cierra el modal al hacer clic en Cancelar', async () => {
    renderPage();
    await waitForTableLoaded();
    fireEvent.click(screen.getByText('Nuevo plan'));
    expect(screen.getByTestId('plan-modal')).toBeTruthy();
    fireEvent.click(screen.getByText('Cancelar modal'));
    expect(screen.queryByTestId('plan-modal')).toBeNull();
  });
});

describe('AdminPlans — editar plan', () => {

  it('abre el modal con título "Editar plan" al hacer clic en Editar', async () => {
    renderPage();
    await waitForTableLoaded();
    fireEvent.click(screen.getAllByTitle('Editar plan')[0]);
    expect(screen.getByTestId('plan-modal')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Editar plan' })).toBeTruthy();
  });

  it('el campo nombre viene pre-relleno con los datos del plan', async () => {
    renderPage();
    await waitForTableLoaded();
    fireEvent.click(screen.getAllByTitle('Editar plan')[0]);
    const input = screen.getByTestId('input-name');
    expect(input.value).toBe('Básico');
  });

  it('llama a api.put al guardar cambios', async () => {
    renderPage();
    await waitForTableLoaded();
    fireEvent.click(screen.getAllByTitle('Editar plan')[0]);
    fireEvent.click(screen.getByText('Guardar cambios'));

    await waitFor(() => {
      expect(apiPut).toHaveBeenCalledWith('/plans/1', expect.any(Object));
    });
  });

  it('muestra toast de éxito tras actualizar plan', async () => {
    renderPage();
    await waitForTableLoaded();
    fireEvent.click(screen.getAllByTitle('Editar plan')[0]);
    fireEvent.click(screen.getByText('Guardar cambios'));

    expect(await screen.findByText(/actualizado correctamente/i)).toBeTruthy();
  });
});

describe('AdminPlans — eliminar plan', () => {

  it('abre el modal de confirmación al hacer clic en Eliminar', async () => {
    renderPage();
    await waitForTableLoaded();
    fireEvent.click(screen.getAllByTitle('Eliminar plan')[0]);
    expect(screen.getByTestId('confirm-modal')).toBeTruthy();
  });

  it('cierra el modal al hacer clic en Cancelar', async () => {
    renderPage();
    await waitForTableLoaded();
    fireEvent.click(screen.getAllByTitle('Eliminar plan')[0]);
    fireEvent.click(screen.getByText('Cancelar'));
    expect(screen.queryByTestId('confirm-modal')).toBeNull();
  });

  it('llama a api.delete con el planId correcto', async () => {
    renderPage();
    await waitForTableLoaded();
    fireEvent.click(screen.getAllByTitle('Eliminar plan')[0]);
    fireEvent.click(screen.getByText('Confirmar eliminación'));

    await waitFor(() => {
      expect(apiDelete).toHaveBeenCalledWith('/plans/1');
    });
  });

  it('quita el plan de la lista tras eliminarlo', async () => {
    renderPage();
    await waitForTableLoaded();
    fireEvent.click(screen.getAllByTitle('Eliminar plan')[0]);
    fireEvent.click(screen.getByText('Confirmar eliminación'));

    await waitFor(() => {
      expect(screen.queryByText('Plan de entrada')).toBeNull();
    });
  });

  it('muestra toast de éxito tras eliminar plan', async () => {
    renderPage();
    await waitForTableLoaded();
    fireEvent.click(screen.getAllByTitle('Eliminar plan')[0]);
    fireEvent.click(screen.getByText('Confirmar eliminación'));

    expect(await screen.findByText(/eliminado/i)).toBeTruthy();
  });

  it('muestra toast de error cuando api.delete falla', async () => {
    apiDelete.mockRejectedValueOnce({
      response: { data: { message: 'El plan tiene transacciones activas.' } },
    });
    renderPage();
    await waitForTableLoaded();
    fireEvent.click(screen.getAllByTitle('Eliminar plan')[0]);
    fireEvent.click(screen.getByText('Confirmar eliminación'));

    expect(await screen.findByText(/transacciones activas/i)).toBeTruthy();
  });
});

describe('AdminPlans — recarga', () => {

  it('el botón de recarga llama a api.get nuevamente', async () => {
    renderPage();
    await waitForTableLoaded();
    fireEvent.click(screen.getByTitle('Recargar planes'));
    await waitFor(() => {
      expect(apiGet).toHaveBeenCalledTimes(2);
    });
  });
});