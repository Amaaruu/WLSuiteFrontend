import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

vi.mock('./pages/Home',          () => ({ default: () => <div>Home Page</div>      }));
vi.mock('./pages/About',         () => ({ default: () => <div>About Page</div>     }));
vi.mock('./pages/Support',       () => ({ default: () => <div>Support Page</div>   }));
vi.mock('./pages/Plans',         () => ({ default: () => <div>Plans Page</div>     }));
vi.mock('./pages/Templates',     () => ({ default: () => <div>Templates Page</div> }));
vi.mock('./pages/Register',      () => ({ default: () => <div>Register Page</div>  }));
vi.mock('./pages/Login',         () => ({ default: () => <div>Login Page</div>     }));
vi.mock('./pages/Checkout',      () => ({ default: () => <div>Checkout Page</div>  }));
vi.mock('./pages/CreateLanding', () => ({ default: () => <div>CreateLanding</div>  }));
vi.mock('./pages/ProjectResult', () => ({ default: () => <div>ProjectResult</div>  }));
vi.mock('./pages/LandingViewer', () => ({ default: () => <div>LandingViewer</div>  }));
vi.mock('./pages/user/UserDashboard',   () => ({ default: () => <div>UserDashboard</div>  }));
vi.mock('./pages/user/UserProjects',    () => ({ default: () => <div>UserProjects</div>   }));
vi.mock('./pages/admin/AdminDashboard', () => ({ default: () => <div>AdminDashboard</div> }));
vi.mock('./pages/admin/AdminUsers',     () => ({ default: () => <div>AdminUsers</div>     }));
vi.mock('./pages/admin/AdminProjects',  () => ({ default: () => <div>AdminProjects</div>  }));
vi.mock('./pages/admin/AdminLogs',      () => ({ default: () => <div>AdminLogs</div>      }));
vi.mock('./pages/admin/AdminSupport',   () => ({ default: () => <div>AdminSupport</div>   }));
vi.mock('./pages/admin/AdminPlans',     () => ({ default: () => <div>AdminPlans</div>     }));

import { AppRoutes, PageLoader } from './App';

const normalUser = { name: 'Juan',  role: 'user'  };
const adminUser  = { name: 'Admin', role: 'admin' };

const renderAt = (path, user = null) =>
  render(
    <AuthContext.Provider value={{ user, logout: vi.fn() }}>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </AuthContext.Provider>
  );

const resolves = async (text) =>
  waitFor(() => expect(screen.getByText(text)).toBeTruthy(), { timeout: 3000 });

describe('App — lazy imports (factory arrows)', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('/ → resuelve lazy(Home)', async () => {
    renderAt('/');
    await resolves('Home Page');
  });

  it('/about → resuelve lazy(About)', async () => {
    renderAt('/about');
    await resolves('About Page');
  });

  it('/support → resuelve lazy(Support)', async () => {
    renderAt('/support');
    await resolves('Support Page');
  });

  it('/plans → resuelve lazy(Plans)', async () => {
    renderAt('/plans');
    await resolves('Plans Page');
  });

  it('/templates → resuelve lazy(Templates)', async () => {
    renderAt('/templates');
    await resolves('Templates Page');
  });

  it('/login → resuelve lazy(Login) para guest', async () => {
    renderAt('/login', null);
    await resolves('Login Page');
  });

  it('/register → resuelve lazy(Register) para guest', async () => {
    renderAt('/register', null);
    await resolves('Register Page');
  });

  it('/checkout → resuelve lazy(Checkout) para usuario autenticado', async () => {
    renderAt('/checkout', normalUser);
    await resolves('Checkout Page');
  });

  it('/create-landing → resuelve lazy(CreateLanding) para usuario autenticado', async () => {
    renderAt('/create-landing', normalUser);
    await resolves('CreateLanding');
  });

  it('/project-result/1 → resuelve lazy(ProjectResult) para usuario autenticado', async () => {
    renderAt('/project-result/1', normalUser);
    await resolves('ProjectResult');
  });

  it('/landings/1 → resuelve lazy(LandingViewer) sin autenticación', async () => {
    renderAt('/landings/1', null);
    await resolves('LandingViewer');
  });

  it('/dashboard → resuelve lazy(UserDashboard) para usuario normal', async () => {
    renderAt('/dashboard', normalUser);
    await resolves('UserDashboard');
  });

  it('/dashboard/projects → resuelve lazy(UserProjects) para usuario normal', async () => {
    renderAt('/dashboard/projects', normalUser);
    await resolves('UserProjects');
  });

  it('/admin → resuelve lazy(AdminDashboard) para admin', async () => {
    renderAt('/admin', adminUser);
    await resolves('AdminDashboard');
  });

  it('/admin/users → resuelve lazy(AdminUsers) para admin', async () => {
    renderAt('/admin/users', adminUser);
    await resolves('AdminUsers');
  });

  it('/admin/projects → resuelve lazy(AdminProjects) para admin', async () => {
    renderAt('/admin/projects', adminUser);
    await resolves('AdminProjects');
  });

  it('/admin/logs → resuelve lazy(AdminLogs) para admin', async () => {
    renderAt('/admin/logs', adminUser);
    await resolves('AdminLogs');
  });

  it('/admin/support → resuelve lazy(AdminSupport) para admin', async () => {
    renderAt('/admin/support', adminUser);
    await resolves('AdminSupport');
  });

  it('/admin/plans → resuelve lazy(AdminPlans) para admin', async () => {
    renderAt('/admin/plans', adminUser);
    await resolves('AdminPlans');
  });

  it('PageLoader es un componente válido (renderiza el spinner)', () => {
    const { container } = render(<PageLoader />);
    expect(container.firstChild).toBeTruthy();
  });

  it('ruta inexistente redirige a / y muestra Home', async () => {
    renderAt('/ruta-inexistente');
    await resolves('Home Page');
  });
});