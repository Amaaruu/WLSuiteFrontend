import { render, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AuthContext, AuthProvider } from './AuthContext';
import { useContext } from 'react';

vi.mock('../services/api', () => ({
  default: { post: vi.fn() },
}));
import api from '../services/api';

const buildJwt = (payload) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body   = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
};

const validToken = buildJwt({
  sub: 'user@test.com',
  exp: Math.floor(Date.now() / 1000) + 3600,
  authorities: [{ authority: 'ROLE_USER' }],
});

const adminToken = buildJwt({
  sub: 'admin@test.com',
  exp: Math.floor(Date.now() / 1000) + 3600,
  authorities: [{ authority: 'ROLE_ADMIN' }],
});

const expiredToken = buildJwt({
  sub: 'old@test.com',
  exp: Math.floor(Date.now() / 1000) - 100,
  authorities: [{ authority: 'ROLE_USER' }],
});

const roleStringToken = buildJwt({
  sub: 'role@test.com',
  exp: Math.floor(Date.now() / 1000) + 3600,
  role: 'ROLE_USER',
});

const noRoleToken = buildJwt({
  sub: 'norole@test.com',
  exp: Math.floor(Date.now() / 1000) + 3600,
});

const emptyAuthorityToken = buildJwt({
  sub: 'empty@test.com',
  exp: Math.floor(Date.now() / 1000) + 3600,
  authorities: [{}],
});

const noExpToken = buildJwt({
  sub: 'noexp@test.com',
});

const ContextReader = ({ onRead }) => {
  const ctx = useContext(AuthContext);
  onRead(ctx);
  return <div data-testid="reader">ok</div>;
};

describe('AuthContext', () => {

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

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

    it('recupera usuario desde localStorage si el token es válido', () => {
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

    it('limpia localStorage y retorna null si el token está expirado', () => {
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
    });

    it('extrae rol ADMIN correctamente desde authorities', () => {
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

    it('usa "Usuario" como nombre cuando no hay userName en localStorage', () => {
      localStorage.setItem('token', validToken);
      let ctx;
      render(
        <AuthProvider>
          <ContextReader onRead={(c) => { ctx = c; }} />
        </AuthProvider>
      );
      expect(ctx.user.name).toBe('Usuario');
    });

    it('extrae rol desde payload.role string (formato alternativo)', () => {
      localStorage.setItem('token', roleStringToken);
      localStorage.setItem('userName', 'RoleUser');
      let ctx;
      render(
        <AuthProvider>
          <ContextReader onRead={(c) => { ctx = c; }} />
        </AuthProvider>
      );
      expect(ctx.user.role).toBe('user');
    });

    it('trata token malformado como expirado y limpia sesión', () => {
      localStorage.setItem('token', 'token.invalido.jwt');
      localStorage.setItem('userName', 'Broken');
      let ctx;
      render(
        <AuthProvider>
          <ContextReader onRead={(c) => { ctx = c; }} />
        </AuthProvider>
      );
      expect(ctx.user).toBeNull();
    });

    it('limpia la sesión si el token no tiene campo exp', () => {
      localStorage.setItem('token', noExpToken);
      localStorage.setItem('userName', 'NoExp');
      let ctx;
      render(
        <AuthProvider>
          <ContextReader onRead={(c) => { ctx = c; }} />
        </AuthProvider>
      );
      expect(ctx.user).toBeNull();
    });

    it('maneja authorities sin campo authority (usa string vacío como fallback)', () => {
      localStorage.setItem('token', emptyAuthorityToken);
      localStorage.setItem('userName', 'EmptyAuth');
      let ctx;
      render(
        <AuthProvider>
          <ContextReader onRead={(c) => { ctx = c; }} />
        </AuthProvider>
      );
      expect(ctx.user).not.toBeNull();
      expect(ctx.user.role).toBe('');
    });

    it('retorna rol "user" como fallback cuando no hay authorities ni role en payload', () => {
      localStorage.setItem('token', noRoleToken);
      localStorage.setItem('userName', 'NoRole');
      let ctx;
      render(
        <AuthProvider>
          <ContextReader onRead={(c) => { ctx = c; }} />
        </AuthProvider>
      );
      expect(ctx.user.role).toBe('user');
    });

    it('retorna null cuando localStorage.getItem lanza excepción', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
        throw new Error('localStorage bloqueado');
      });
      let ctx;
      render(
        <AuthProvider>
          <ContextReader onRead={(c) => { ctx = c; }} />
        </AuthProvider>
      );
      expect(ctx.user).toBeNull();
    });
  });

  describe('login()', () => {
    it('devuelve { success: true, role } al loguearse correctamente', async () => {
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
        result = await ctx.login('maria@test.com', 'pass123');
      });
      expect(result.success).toBe(true);
      expect(result.role).toBe('user');
    });

    it('devuelve { success: false } cuando el token en respuesta es undefined', async () => {
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

    it('devuelve { success: false } cuando la API lanza error con mensaje', async () => {
      api.post.mockRejectedValueOnce({
        response: { data: { message: 'Credenciales inválidas.' } },
      });
      let ctx;
      render(
        <AuthProvider>
          <ContextReader onRead={(c) => { ctx = c; }} />
        </AuthProvider>
      );
      let result;
      await act(async () => {
        result = await ctx.login('bad@test.com', 'wrong');
      });
      expect(result.success).toBe(false);
      expect(result.message).toBe('Credenciales inválidas.');
    });

    it('devuelve mensaje genérico cuando la API lanza error sin response', async () => {
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

    it('login con token de rol ADMIN extrae admin correctamente', async () => {
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
        result = await ctx.login('admin@test.com', 'adminpass');
      });
      expect(result.success).toBe(true);
      expect(result.role).toBe('admin');
    });
  });

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
      await act(async () => { ctx.logout(); });
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('userName')).toBeNull();
    });
  });

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