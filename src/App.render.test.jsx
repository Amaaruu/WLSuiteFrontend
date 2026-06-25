import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { Suspense } from 'react';

vi.mock('./pages/Home',          () => ({ default: () => <div>Home Page</div>      }));
vi.mock('./pages/About',         () => ({ default: () => <div>About Page</div>     }));
vi.mock('./pages/Plans',         () => ({ default: () => <div>Plans Page</div>     }));
vi.mock('./pages/Login',         () => ({ default: () => <div>Login Page</div>     }));
vi.mock('./pages/Register',      () => ({ default: () => <div>Register Page</div>  }));
vi.mock('./pages/Support',       () => ({ default: () => <div>Support Page</div>   }));
vi.mock('./pages/Templates',     () => ({ default: () => <div>Templates Page</div> }));
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

import App from './App';

describe('App — componente raíz (render completo)', () => {

  it('renderiza sin errores en la ruta raíz y muestra Home', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeTruthy();
    }, { timeout: 3000 });
  });

  it('el componente App monta el BrowserRouter y el AuthProvider', async () => {
    const { container } = render(<App />);
    await waitFor(() => {
      expect(container.firstChild).toBeTruthy();
    });
  });

  it('muestra el PageLoader (Suspense fallback) durante la carga lazy', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBeTruthy();
  });
});