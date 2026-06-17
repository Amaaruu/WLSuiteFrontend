import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { useContext } from 'react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

const Home         = () => <div>Home</div>;
const Login        = () => <div>Login</div>;
const Register     = () => <div>Register</div>;
const Dashboard    = () => <div>UserDashboard</div>;
const AdminPanel   = () => <div>AdminDashboard</div>;
const CheckoutPage = () => <div>Checkout</div>;
const Protected    = () => <div>Protected</div>;

const UserOnlyRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return children;
};

const renderRoutes = (path, user = null) =>
  render(
    <AuthContext.Provider value={{ user, logout: vi.fn() }}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/login"     element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register"  element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
          <Route path="/checkout"  element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/protected" element={<ProtectedRoute><Protected /></ProtectedRoute>} />
          <Route path="/dashboard" element={<UserOnlyRoute><Dashboard /></UserOnlyRoute>} />
          <Route path="/admin"          element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="/admin/users"    element={<AdminRoute><div>AdminUsers</div></AdminRoute>} />
          <Route path="/admin/logs"     element={<AdminRoute><div>AdminLogs</div></AdminRoute>} />
          <Route path="/admin/support"  element={<AdminRoute><div>AdminSupport</div></AdminRoute>} />
          <Route path="/admin/plans"    element={<AdminRoute><div>AdminPlans</div></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );

const guest      = null;
const normalUser = { name: 'Juan', role: 'user' };
const adminUser  = { name: 'Admin', role: 'admin' };

describe('App — rutas públicas', () => {
  it('/ muestra Home', () => {
    renderRoutes('/');
    expect(screen.getByText('Home')).toBeTruthy();
  });

  it('ruta inexistente redirige a Home', () => {
    renderRoutes('/no-existe');
    expect(screen.getByText('Home')).toBeTruthy();
  });
});

describe('App — PublicOnlyRoute', () => {
  it('/login muestra Login si no hay usuario', () => {
    renderRoutes('/login', guest);
    expect(screen.getByText('Login')).toBeTruthy();
  });

  it('/login redirige a /dashboard si el usuario es normal', () => {
    renderRoutes('/login', normalUser);
    expect(screen.getByText('UserDashboard')).toBeTruthy();
  });

  it('/login redirige a /admin si el usuario es admin', () => {
    renderRoutes('/login', adminUser);
    expect(screen.getByText('AdminDashboard')).toBeTruthy();
  });

  it('/register muestra Register si no hay usuario', () => {
    renderRoutes('/register', guest);
    expect(screen.getByText('Register')).toBeTruthy();
  });

  it('/register redirige a /dashboard si el usuario es normal', () => {
    renderRoutes('/register', normalUser);
    expect(screen.getByText('UserDashboard')).toBeTruthy();
  });
});

describe('App — ProtectedRoute', () => {
  it('/checkout redirige a /login si no hay usuario', () => {
    renderRoutes('/checkout', guest);
    expect(screen.getByText('Login')).toBeTruthy();
  });

  it('/checkout muestra Checkout si hay usuario autenticado', () => {
    renderRoutes('/checkout', normalUser);
    expect(screen.getByText('Checkout')).toBeTruthy();
  });

  it('/protected redirige a /login si no hay usuario', () => {
    renderRoutes('/protected', guest);
    expect(screen.getByText('Login')).toBeTruthy();
  });
});

describe('App — UserOnlyRoute', () => {
  it('/dashboard redirige a /login si no hay usuario', () => {
    renderRoutes('/dashboard', guest);
    expect(screen.getByText('Login')).toBeTruthy();
  });

  it('/dashboard muestra UserDashboard para usuario normal', () => {
    renderRoutes('/dashboard', normalUser);
    expect(screen.getByText('UserDashboard')).toBeTruthy();
  });

  it('/dashboard redirige a /admin si el usuario es admin', () => {
    renderRoutes('/dashboard', adminUser);
    expect(screen.getByText('AdminDashboard')).toBeTruthy();
  });
});

describe('App — AdminRoute', () => {
  it('/admin redirige a /login si no hay usuario', () => {
    renderRoutes('/admin', guest);
    expect(screen.getByText('Login')).toBeTruthy();
  });

  it('/admin muestra AdminDashboard para admin', () => {
    renderRoutes('/admin', adminUser);
    expect(screen.getByText('AdminDashboard')).toBeTruthy();
  });

  it('/admin redirige a /dashboard si es usuario normal', () => {
    renderRoutes('/admin', normalUser);
    expect(screen.getByText('UserDashboard')).toBeTruthy();
  });

  it('/admin/users muestra AdminUsers para admin', () => {
    renderRoutes('/admin/users', adminUser);
    expect(screen.getByText('AdminUsers')).toBeTruthy();
  });

  it('/admin/logs muestra AdminLogs para admin', () => {
    renderRoutes('/admin/logs', adminUser);
    expect(screen.getByText('AdminLogs')).toBeTruthy();
  });

  it('/admin/support muestra AdminSupport para admin', () => {
    renderRoutes('/admin/support', adminUser);
    expect(screen.getByText('AdminSupport')).toBeTruthy();
  });

  it('/admin/plans muestra AdminPlans para admin', () => {
    renderRoutes('/admin/plans', adminUser);
    expect(screen.getByText('AdminPlans')).toBeTruthy();
  });
});