// src/context/AuthContext.test.jsx
import { render, screen, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AuthContext, AuthProvider } from './AuthContext';
import { useContext } from 'react';

// ── Mock de la API ────────────────────────────────────────────────────────────
vi.mock('../services/api', () => ({
  default: { post: vi.fn() },
}));
import api from '../services/api';

// ── Helpers para generar JWTs falsos ─────────────────────────────────────────
const buildJwt = (payload) => {
  const header  = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body    = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
};

const validToken = buildJwt({
  sub: 'user@test.com',
  exp: Math.floor(Date.now() / 1000) + 3600, // expira en 1 hora
  authorities: [{ authority: 'ROLE_USER' }],
});

const adminToken = buildJwt({
  sub: 'admin@test.com',
  exp: Math.floor(Date.now() / 1000) + 3600,
  authorities: [{ authority: 'ROLE_ADMIN' }],
});

const expiredToken = buildJwt({
  sub: 'old@test.com',
  exp: Math.floor(Date.now() / 1000) - 100, // ya expiró
  authorities: [{ authority: 'ROLE_USER' }],
});

// ── Componente auxiliar para leer el contexto en tests ────────────────────────
const ContextReader = ({ onRead }) => {
  const ctx = useContext(AuthContext);
  onRead(ctx);
  return <div data-testid="reader">ok</div>;
};

// ── Suite ─────────────────────────────────────────────────────────────────────
describe('AuthContext', () => {

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ── Estado inicial ──────────────────────────────────────────────────────────
  describe('estado inicial', () => {
    it('user es null cuando no hay token en localStorage', () => {
      let ctx;
      render(
        <AuthProvider>
          <ContextReader onRead={(c) => { ctx = c; }} />
        </AuthProvider>
      );
      expect(ctx.user).toBeNull();
    });

    it('recupera el usuario desde localStorage si el token es válido', () => {
      localStorage.setItem('token', validToken);
      localStorage.setItem('userName', 'Juan');

      let ctx;
      render(
        <AuthProvider>
          <ContextReader onRead={(c) => { ctx = c; }} />
        </AuthProvider>
      );

      expect(ctx.user).not.toBeNull();
      expect(ctx.user.name).toBe('Juan');
      expect(ctx.user.role).toBe('user');
    });

    it('limpia localStorage y devuelve null si el token está expirado', () => {
      localStorage.setItem('token', expiredToken);
      localStorage.setItem('userName', 'Viejo');

      let ctx;
      render(
        <AuthProvider>
          <ContextReader onRead={(c) => { ctx = c; }} />
        </AuthProvider>
      );

      expect(ctx.user).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('userName')).toBeNull();
    });

    it('extrae el rol ADMIN correctamente desde el token', () => {
      localStorage.setItem('token', adminToken);
      localStorage.setItem('userName', 'Admin');

      let ctx;
      render(
        <AuthProvider>
          <ContextReader onRead={(c) => { ctx = c; }} />
        </AuthProvider>
      );

      expect(ctx.user.role).toBe('admin');
    });
  });

  // ── login() ─────────────────────────────────────────────────────────────────
  describe('login()', () => {
    it('devuelve { success: true, role } y setea el usuario al loguearse correctamente', async () => {
      api.post.mockResolvedValueOnce({
        data: { token: validToken, name: 'María' },
      });

      let ctx;
      render(
        <AuthProvider>
          <ContextReader onRead={(c) => { ctx = c; }} />
        </AuthProvider>
      );

      let result;
      await act(async () => {
        result = await ctx.login('maria@test.com', 'pass1234');
      });

      expect(result.success).toBe(true);
      expect(result.role).toBe('user');
      expect(localStorage.getItem('token')).toBe(validToken);
      expect(localStorage.getItem('userName')).toBe('María');
    });

    it('devuelve { success: true, role: "admin" } para un administrador', async () => {
      api.post.mockResolvedValueOnce({
        data: { token: adminToken, name: 'SuperAdmin' },
      });

      let ctx;
      render(
        <AuthProvider>
          <ContextReader onRead={(c) => { ctx = c; }} />
        </AuthProvider>
      );

      let result;
      await act(async () => {
        result = await ctx.login('admin@test.com', 'admin123');
      });

      expect(result.success).toBe(true);
      expect(result.role).toBe('admin');
    });

    it('devuelve { success: false, message } cuando la API responde con error', async () => {
      api.post.mockRejectedValueOnce({
        response: { data: { message: 'Credenciales incorrectas' } },
      });

      let ctx;
      render(
        <AuthProvider>
          <ContextReader onRead={(c) => { ctx = c; }} />
        </AuthProvider>
      );

      let result;
      await act(async () => {
        result = await ctx.login('wrong@test.com', 'wrongpass');
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Credenciales incorrectas');
    });

    it('devuelve mensaje genérico si la API no devuelve data.message', async () => {
      api.post.mockRejectedValueOnce(new Error('Network Error'));

      let ctx;
      render(
        <AuthProvider>
          <ContextReader onRead={(c) => { ctx = c; }} />
        </AuthProvider>
      );

      let result;
      await act(async () => {
        result = await ctx.login('x@test.com', 'pass');
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Error al conectar con el servidor.');
    });

    it('devuelve error si el token en la respuesta es undefined', async () => {
      api.post.mockResolvedValueOnce({ data: { name: 'Sin Token' } });

      let ctx;
      render(
        <AuthProvider>
          <ContextReader onRead={(c) => { ctx = c; }} />
        </AuthProvider>
      );

      let result;
      await act(async () => {
        result = await ctx.login('x@test.com', 'pass');
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Respuesta del servidor inválida.');
    });
  });

  // ── logout() ────────────────────────────────────────────────────────────────
  describe('logout()', () => {
    it('limpia localStorage y pone user en null', async () => {
      localStorage.setItem('token', validToken);
      localStorage.setItem('userName', 'Juan');

      let ctx;
      render(
        <AuthProvider>
          <ContextReader onRead={(c) => { ctx = c; }} />
        </AuthProvider>
      );

      await act(async () => {
        ctx.logout();
      });

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('userName')).toBeNull();
    });
  });

  // ── evento auth-error ───────────────────────────────────────────────────────
  describe('evento auth-error', () => {
    it('limpia la sesión al dispararse el evento global auth-error', async () => {
      localStorage.setItem('token', validToken);
      localStorage.setItem('userName', 'Juan');

      render(
        <AuthProvider>
          <div data-testid="child">child</div>
        </AuthProvider>
      );

      await act(async () => {
        window.dispatchEvent(new Event('auth-error'));
      });

      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});