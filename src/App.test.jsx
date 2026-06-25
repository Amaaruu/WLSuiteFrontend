import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import {
  ProtectedRoute,
  PublicOnlyRoute,
  UserOnlyRoute,
  AdminRoute,
} from './App';

const Home          = () => <div>Home</div>;
const Login         = () => <div>Login</div>;
const Register      = () => <div>Register</div>;
const UserDashboard = () => <div>UserDashboard</div>;
const UserProjects  = () => <div>UserProjects</div>;
const AdminPanel    = () => <div>AdminDashboard</div>;
const CheckoutPage  = () => <div>Checkout</div>;
const CreateLanding = () => <div>CreateLanding</div>;
const Protected     = () => <div>Protected</div>;

const guest      = null;
const normalUser = { name: 'Juan', role: 'user' };
const adminUser  = { name: 'Admin', role: 'admin' };

const renderRoutes = (path, user = null) =>
  render(
    <AuthContext.Provider value={{ user, logout: vi.fn() }}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/"          element={<Home />} />
          <Route path="/login"     element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register"  element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

          {/* Rutas protegidas (cualquier usuario autenticado) */}
          <Route path="/checkout"       element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/create-landing" element={<ProtectedRoute><CreateLanding /></ProtectedRoute>} />
          <Route path="/protected"      element={<ProtectedRoute><Protected /></ProtectedRoute>} />

          {/* Rutas solo para usuarios normales */}
          <Route path="/dashboard"          element={<UserOnlyRoute><UserDashboard /></UserOnlyRoute>} />
          <Route path="/dashboard/projects" element={<UserOnlyRoute><UserProjects /></UserOnlyRoute>} />

          {/* Rutas solo para admin */}
          <Route path="/admin"          element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="/admin/users"    element={<AdminRoute><div>AdminUsers</div></AdminRoute>} />
          <Route path="/admin/projects" element={<AdminRoute><div>AdminProjects</div></AdminRoute>} />
          <Route path="/admin/logs"     element={<AdminRoute><div>AdminLogs</div></AdminRoute>} />
          <Route path="/admin/support"  element={<AdminRoute><div>AdminSupport</div></AdminRoute>} />
          <Route path="/admin/plans"    element={<AdminRoute><div>AdminPlans</div></AdminRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );

describe('App — rutas públicas', () => {
  it('/ muestra Home para cualquier usuario', () => {
    renderRoutes('/');
    expect(screen.getByText('Home')).toBeTruthy();
  });

  it('ruta inexistente redirige a /', () => {
    renderRoutes('/ruta-que-no-existe');
    expect(screen.getByText('Home')).toBeTruthy();
  });
});

describe('App — PublicOnlyRoute', () => {
  it('/login muestra Login cuando no hay sesión', () => {
    renderRoutes('/login', guest);
    expect(screen.getByText('Login')).toBeTruthy();
  });

  it('/login redirige a /dashboard para usuario normal autenticado', () => {
    renderRoutes('/login', normalUser);
    expect(screen.getByText('UserDashboard')).toBeTruthy();
  });

  it('/login redirige a /admin para usuario admin autenticado', () => {
    renderRoutes('/login', adminUser);
    expect(screen.getByText('AdminDashboard')).toBeTruthy();
  });

  it('/register muestra Register cuando no hay sesión', () => {
    renderRoutes('/register', guest);
    expect(screen.getByText('Register')).toBeTruthy();
  });

  it('/register redirige a /dashboard para usuario normal autenticado', () => {
    renderRoutes('/register', normalUser);
    expect(screen.getByText('UserDashboard')).toBeTruthy();
  });

  it('/register redirige a /admin para usuario admin autenticado', () => {
    renderRoutes('/register', adminUser);
    expect(screen.getByText('AdminDashboard')).toBeTruthy();
  });
});

describe('App — ProtectedRoute', () => {
  it('/checkout redirige a /login cuando no hay sesión', () => {
    renderRoutes('/checkout', guest);
    expect(screen.getByText('Login')).toBeTruthy();
  });

  it('/checkout muestra contenido para usuario normal autenticado', () => {
    renderRoutes('/checkout', normalUser);
    expect(screen.getByText('Checkout')).toBeTruthy();
  });

  it('/checkout muestra contenido para usuario admin autenticado', () => {
    renderRoutes('/checkout', adminUser);
    expect(screen.getByText('Checkout')).toBeTruthy();
  });

  it('/create-landing redirige a /login cuando no hay sesión', () => {
    renderRoutes('/create-landing', guest);
    expect(screen.getByText('Login')).toBeTruthy();
  });

  it('/create-landing muestra contenido para usuario autenticado', () => {
    renderRoutes('/create-landing', normalUser);
    expect(screen.getByText('CreateLanding')).toBeTruthy();
  });

  it('/protected redirige a /login cuando no hay sesión', () => {
    renderRoutes('/protected', guest);
    expect(screen.getByText('Login')).toBeTruthy();
  });

  it('/protected muestra contenido si hay sesión activa', () => {
    renderRoutes('/protected', normalUser);
    expect(screen.getByText('Protected')).toBeTruthy();
  });
});

describe('App — UserOnlyRoute', () => {
  it('/dashboard redirige a /login cuando no hay sesión', () => {
    renderRoutes('/dashboard', guest);
    expect(screen.getByText('Login')).toBeTruthy();
  });

  it('/dashboard muestra UserDashboard para usuario normal', () => {
    renderRoutes('/dashboard', normalUser);
    expect(screen.getByText('UserDashboard')).toBeTruthy();
  });

  it('/dashboard redirige a /admin cuando el usuario es admin', () => {
    renderRoutes('/dashboard', adminUser);
    expect(screen.getByText('AdminDashboard')).toBeTruthy();
  });

  it('/dashboard/projects redirige a /login cuando no hay sesión', () => {
    renderRoutes('/dashboard/projects', guest);
    expect(screen.getByText('Login')).toBeTruthy();
  });

  it('/dashboard/projects muestra UserProjects para usuario normal', () => {
    renderRoutes('/dashboard/projects', normalUser);
    expect(screen.getByText('UserProjects')).toBeTruthy();
  });

  it('/dashboard/projects redirige a /admin cuando el usuario es admin', () => {
    renderRoutes('/dashboard/projects', adminUser);
    expect(screen.getByText('AdminDashboard')).toBeTruthy();
  });
});

describe('App — AdminRoute', () => {
  it('/admin redirige a /login cuando no hay sesión', () => {
    renderRoutes('/admin', guest);
    expect(screen.getByText('Login')).toBeTruthy();
  });

  it('/admin muestra AdminDashboard para usuario admin', () => {
    renderRoutes('/admin', adminUser);
    expect(screen.getByText('AdminDashboard')).toBeTruthy();
  });

  it('/admin redirige a /dashboard para usuario normal', () => {
    renderRoutes('/admin', normalUser);
    expect(screen.getByText('UserDashboard')).toBeTruthy();
  });

  it('/admin/users muestra AdminUsers para usuario admin', () => {
    renderRoutes('/admin/users', adminUser);
    expect(screen.getByText('AdminUsers')).toBeTruthy();
  });

  it('/admin/users redirige a /login cuando no hay sesión', () => {
    renderRoutes('/admin/users', guest);
    expect(screen.getByText('Login')).toBeTruthy();
  });

  it('/admin/projects redirige a /dashboard para usuario normal', () => {
    renderRoutes('/admin/projects', normalUser);
    expect(screen.getByText('UserDashboard')).toBeTruthy();
  });

  it('/admin/logs muestra AdminLogs para usuario admin', () => {
    renderRoutes('/admin/logs', adminUser);
    expect(screen.getByText('AdminLogs')).toBeTruthy();
  });

  it('/admin/support muestra AdminSupport para usuario admin', () => {
    renderRoutes('/admin/support', adminUser);
    expect(screen.getByText('AdminSupport')).toBeTruthy();
  });

  it('/admin/plans muestra AdminPlans para usuario admin', () => {
    renderRoutes('/admin/plans', adminUser);
    expect(screen.getByText('AdminPlans')).toBeTruthy();
  });
});